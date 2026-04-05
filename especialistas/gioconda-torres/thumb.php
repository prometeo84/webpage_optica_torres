<?php
// Improved proxy for Dailymotion thumbnails with disk cache, validation and safe headers.
// Usage: thumb.php?id=xa3s212

// Configuration
$MAX_BYTES = 5 * 1024 * 1024; // 5 MB max
$CACHE_TTL = 60 * 60 * 24; // 1 day
$CACHE_DIR = __DIR__ . '/.thumb_cache';

if(!isset($_GET['id']) || empty($_GET['id'])){
    http_response_code(400);
    header('Content-Type: text/plain; charset=utf-8');
    echo 'Missing id';
    exit;
}

$id = preg_replace('/[^a-zA-Z0-9_\-]/', '', $_GET['id']);
if(!$id){
    http_response_code(400);
    header('Content-Type: text/plain; charset=utf-8');
    echo 'Invalid id';
    exit;
}

$remote = 'https://www.dailymotion.com/thumbnail/video/' . $id;

// Ensure cache dir exists
if(!is_dir($CACHE_DIR)){
    @mkdir($CACHE_DIR, 0755, true);
}

$cache_key = sha1($remote);
$cache_file = $CACHE_DIR . '/' . $cache_key . '.bin';
$meta_file  = $CACHE_DIR . '/' . $cache_key . '.json';

// Helper: send cached file with headers
function send_cached($meta, $cache_file){
    header('Access-Control-Allow-Origin: *');
    header('X-Proxy: thumb-proxy/1.1');
    if(!empty($meta['content_type'])) header('Content-Type: ' . $meta['content_type']);
    else header('Content-Type: image/jpeg');
    if(!empty($meta['etag'])) header('ETag: "' . $meta['etag'] . '"');
    if(!empty($meta['last_modified'])) header('Last-Modified: ' . gmdate('D, d M Y H:i:s', $meta['last_modified']) . ' GMT');
    header('Cache-Control: public, max-age=' . (isset($meta['ttl']) ? $meta['ttl'] : 86400));
    readfile($cache_file);
    exit;
}

// If cached and fresh, honor conditional requests
if(file_exists($cache_file) && file_exists($meta_file)){
    $meta = json_decode(file_get_contents($meta_file), true);
    $age = time() - ($meta['fetched_at'] ?? 0);
    // If client sent If-None-Match or If-Modified-Since, respond 304 if matches
    if(!empty($meta['etag']) && isset($_SERVER['HTTP_IF_NONE_MATCH'])){
        $ifnm = trim($_SERVER['HTTP_IF_NONE_MATCH'], ' "');
        if($ifnm === $meta['etag']){
            header('HTTP/1.1 304 Not Modified');
            header('Cache-Control: public, max-age=' . $CACHE_TTL);
            exit;
        }
    }
    if($age <= $CACHE_TTL){
        send_cached($meta, $cache_file);
    }
    // else fallthrough to refresh cache
}

// Fetch remote with cURL
$ch = curl_init($remote);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_USERAGENT, isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : 'thumb-proxy/1.0');
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
curl_setopt($ch, CURLOPT_FAILONERROR, true);

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$content_type = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
curl_close($ch);

if($response === false || $http_code >= 400){
    // If we have stale cache, serve it as a fallback
    if(file_exists($cache_file) && file_exists($meta_file)){
        $meta = json_decode(file_get_contents($meta_file), true);
        header('X-Proxy-Warning: remote_fetch_failed; serving-stale-cache');
        send_cached($meta, $cache_file);
    }
    http_response_code(502);
    header('Content-Type: text/plain; charset=utf-8');
    echo 'Failed to fetch thumbnail';
    exit;
}

// Validate size
$size = strlen($response);
if($size > $MAX_BYTES){
    http_response_code(413);
    header('Content-Type: text/plain; charset=utf-8');
    echo 'Remote file too large';
    exit;
}

// Validate content-type (must be image/*)
if($content_type === null) $content_type = 'image/jpeg';
if(strpos($content_type, 'image/') !== 0){
    http_response_code(502);
    header('Content-Type: text/plain; charset=utf-8');
    echo 'Remote resource is not an image';
    exit;
}

// Save to cache atomically
$tmp = $cache_file . '.tmp';
file_put_contents($tmp, $response);
rename($tmp, $cache_file);
$etag = sha1($response);
$meta = [
    'fetched_at' => time(),
    'content_type' => $content_type,
    'size' => $size,
    'etag' => $etag,
    'ttl' => $CACHE_TTL
];
file_put_contents($meta_file, json_encode($meta));

// Serve
header('Access-Control-Allow-Origin: *');
header('X-Proxy: thumb-proxy/1.1');
header('Content-Type: ' . $content_type);
header('Cache-Control: public, max-age=' . $CACHE_TTL);
header('ETag: "' . $etag . '"');
echo $response;
exit;
