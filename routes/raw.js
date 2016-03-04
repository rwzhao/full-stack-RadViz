var express = require('express');
var router = express.Router();

router.get('/',function (req,res) {
    res.render('raw',{title:'提交表单及参数示例'});
    
    var userName = req.query.txtUserName;
    var userPwd = req.query.txtUserPwd;
    
    console.log(userName);
    console.log(userPwd);
    
});

module.exports = router;