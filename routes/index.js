var express = require('express');
var router = express.Router();
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'RadViz1' });
});



module.exports = router;
