var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('tangent', { title: 'tangent' });
});

module.exports = router;