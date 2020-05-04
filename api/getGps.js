let http = require('http');
let qs = require('querystring');
const token = '407a2cf82309fdf5ca8549f53a61b776';
const ip = '58.101.51.11';
// search_key = qs.stringify(search_key);
// console.log(search_key);
const options = {
  hostname: 'api.ip138.com',
  path: `/query/?ip=${ip}&token=${token}`,
  method: 'get',
  port: 80
};
http
  .request(options, res => {
    let content = '';
    res.setEncoding('utf-8');
    res.on('data', chunk => {
      content += chunk;
    });
    res.on('end', () => {
      console.log(content);
    });
  })
  .end();
