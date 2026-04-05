#!/usr/bin/env python3
import sys, json
from urllib import request, parse

if len(sys.argv) < 2:
    print('Usage: validate_html_w3c.py <path-to-html-file>')
    sys.exit(2)

path = sys.argv[1]
with open(path, 'rb') as f:
    data = f.read()

url = 'https://validator.w3.org/nu/?out=json'
req = request.Request(url, data=data, method='POST')
req.add_header('Content-Type', 'text/html; charset=utf-8')
req.add_header('User-Agent', 'local-html-validator/1.0')

try:
    with request.urlopen(req, timeout=30) as resp:
        body = resp.read().decode('utf-8')
        j = json.loads(body)
except Exception as e:
    print('ERROR_FETCH', str(e))
    sys.exit(3)

messages = j.get('messages', [])
errors = [m for m in messages if m.get('type') == 'error']
warnings = [m for m in messages if m.get('type') == 'info' or m.get('subtype') == 'warning' or m.get('type')=='warning']
print(json.dumps({
    'total_messages': len(messages),
    'errors': len(errors),
    'warnings': len(warnings),
    'sample': messages[:10]
}, ensure_ascii=False, indent=2))
