const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    ["/api","/reports"],// You can pass in an array too eg. ['/api', '/another/path']
    createProxyMiddleware( {
      target: process.env.REACT_APP_PROXY_HOST,
      changeOrigin: true,
    })
  );
};
