var https = require('https');
var express = require('express');
var router = express.Router();

var DEFAULT_OPTIONS = { method: 'HEAD', hostname: 'gitter.im', port: 443 };
var SLASH_REGEXP = /\/{1,}/g;

// The "room" endpoint allows clients to check if a given room exists. We
// perform this check by passing the request to Gitter and examinging the
// response code.
router.get('/room/*', function(req, res, next) {
  var options = JSON.parse(JSON.stringify(DEFAULT_OPTIONS));
  var path = req.path + '/';
  path = '/' + path.replace(SLASH_REGEXP, '/').split('/').splice(2).join('/');
  path = path.substring(0, path.length - 1);
  
  options.path = path;
  var roomReq = https.request(options, function(response) {
    res.type('application/json');
    res.json({ gitterStatus: response.statusCode });
  });
  roomReq.end();

  roomReq.on('error', function(e) {
    console.error(e);
  });
});

module.exports = router;
