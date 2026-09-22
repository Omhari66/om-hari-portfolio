const http = require('http');

const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/chat',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
}, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('STATUS:', res.statusCode);
    console.log('DATA:', data);
  });
});

req.on('error', e => console.error('REQUEST ERROR:', e));
req.write(JSON.stringify({ messages: [{ role: 'user', content: 'Show me the architecture for AdaptIQ' }] }));
req.end();
