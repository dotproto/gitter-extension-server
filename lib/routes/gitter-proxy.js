var proxy = require('express-http-proxy');
var url = require('url');

module.exports = function(app) {
  var proxyUrl = 'https://api.gitter.im';

  app.get('/gitter/room/*', function(req, res, next) {
    var url = req.path.split('/').splice(3).join('/');
    var body = {
      url: url,
      exists: url.length % 2 === 0
    };

    res.json(body);
  });

  app.use('/gitter', proxy(proxyUrl, {
    forwardPath: function(req, res) {
      var forward = url.parse(req.url).path;
      console.log('Proxying "' + req.path + '" to "' + proxyUrl + forward + '"');
      return forward;
    },
    decorateRequest: function(req) {
      req.headers['Authorization'] = 'Bearer ' + process.env.TOKEN;
      return req;
    }
  }));
};