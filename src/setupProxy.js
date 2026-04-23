const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api', // This will proxy any request starting with /api
    createProxyMiddleware({
      target: 'http://localhost:8080', //Spring Boot backend server
      changeOrigin: true,
    })
  );
};