var express = require('express');
var router = express.Router();


var formidable = require('formidable'),
    http = require('http'),
    util = require('util'),
fs=require('fs');


router.get('/',function (req,res) {
    
    
    
    res.render('raw',{title:'RadViz'});
    
    // var userName = req.query.txtUserName;
    // var userPwd = req.query.txtUserPwd;
    
    // console.log(userName);
    // console.log(userPwd);
    
});

router.post('/upload',function (req,res) {
    
      if (req.url == '/upload' && req.method.toLowerCase() == 'post') {
    // parse a file upload
 
    var form = new formidable.IncomingForm();
	form.encoding ='utf-8';
	// form.uploadDir = '/data/';
	form.keepExtensions = true;
	

    form.parse(req, function(err, fields, files) {
		
		if (err) {
		      res.locals.error = err;
		      res.render('index', { title: 'upload' });
		      return;		
		    }  
		
//		var newPath = form.uploadDir;
	
	
		//写文件
		 fs.renameSync(files.upload.path,"./public/iris-normalization.csv"); 
         
         res.end();
		
        //   res.render('raw.ejs',{title:'提交表单及参数示例'});
    });

    return;
  }

		
//		var newPath = form.uploadDir;
       
        //   res.render('raw.ejs',{title:'提交表单及参数示例'});
    });
  

module.exports = router;