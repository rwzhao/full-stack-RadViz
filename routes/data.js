var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('data', { title: 'data' });
});

module.exports = router;