'use strict';

const HttpsProxyAgent = require('https-proxy-agent');

/*
 * API proxy configuration.
 * This allows you to proxy HTTP request like `http.get('/api/stuff')` to another server/port.
 * This is especially useful during app development to avoid CORS issues while running a local server.
 * For more details and options, see https://github.com/angular/angular-cli#proxy-to-backend
 */
const proxyConfig = [
  // {
  //   context: '/api/quote',
  //   pathRewrite: { '^/api': '' },
  //   // target: 'https://api.chucknorris.io/jokes/random',
  //   // target: 'http://api.icndb.com/jokes/random?firstName=John&amp;lastName=Doe',
  //   target: 'http://api.forismatic.com/api/1.0/',
  //   changeOrigin: true,
  //   secure: false
  // },
  {
    context: '/api',
    pathRewrite: { '^/api': '/api/v1' },
    target: 'http://localhost:3003',
    changeOrigin: true,
    secure: false
  }

  //
  // {
  //   context: '/api',
  //   pathRewrite: { '^/api': '/api/v1' },
  //   // target: 'https://api.chucknorris.io',
  //   target: 'http://192.168.1.5:3003',
  //   changeOrigin: true,
  //   secure: false
  // },
  // {
  //   context: '/auth',
  //   pathRewrite: function (path, req) { return path.replace('/api', '/192.168.1.5:3003/api/v1') },
  //   target: 'http://192.168.1.5:3003',
  //   secure: false
  // }
];

/*
 * Configures a corporate proxy agent for the API proxy if needed.
 */
function setupForCorporateProxy(proxyConfig) {
  if (!Array.isArray(proxyConfig)) {
    proxyConfig = [proxyConfig];
  }

  const proxyServer = process.env.http_proxy || process.env.HTTP_PROXY;
  let agent = null;

  if (proxyServer) {
    console.log(`Using corporate proxy server: ${proxyServer}`);
    agent = new HttpsProxyAgent(proxyServer);
    proxyConfig.forEach(entry => { entry.agent = agent; });
  }

  return proxyConfig;
}

module.exports = setupForCorporateProxy(proxyConfig);
