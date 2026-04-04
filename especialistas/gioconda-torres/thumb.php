<?php
// Simple proxy to fetch Dailymotion thumbnails and return them with proper headers
// Usage: thumb.php?id=xa3s212

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

// Initialize cURL
$ch = curl_init($remote);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_USERAGENT, isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : 'PHP-curl');
curl_setopt($ch, CURLOPT_TIMEOUT, 10);

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$content_type = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
curl_close($ch);

if($response === false || $http_code >= 400){
    http_response_code(502);
    header('Content-Type: text/plain; charset=utf-8');
    echo 'Failed to fetch thumbnail';
    exit;
}

// Return image with permissive CORS header so browser won't block
header('Access-Control-Allow-Origin: *');
if($content_type) header('Content-Type: ' . $content_type);
else header('Content-Type: image/jpeg');

// Cache for a short time (adjust as needed)
header('Cache-Control: public, max-age=86400');

echo $response;
exit;
