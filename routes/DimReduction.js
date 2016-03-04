var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('DimReduction', { title: '使用session示例' });
});

module.exports = router;