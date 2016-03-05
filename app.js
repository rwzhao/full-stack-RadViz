var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');



var formidable = require('formidable'),
    http = require('http'),
    util = require('util'),
fs=require('fs');

var DimReduction = require('./routes/DimReduction');
var tangent = require('./routes/tangent');
var predictor = require('./routes/predictor');
var raw = require('./routes/raw');            


var routes = require('./routes/index');
// var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




app.post('/post-raw',function (req,res) {
    
    var form = new formidable.IncomingForm();
	form.encoding ='utf-8';
    form.uploadDir = 'public/';
    form.keepExtensions = true;
         
     form.parse(req, function(err, fields, files) {
		
		if (err) {
		      res.locals.error = err;
		    //   res.render('raw', { title: 'upload' });
		      return;		
		    }  
		
//		var newPath = form.uploadDir;
		//   console.log('kkkkk');
	
		var newPath = form.uploadDir + "iris-normalization.csv";
		// console.log(newPath);
	    //    console.log(files);
        //  console.log(files);
        // fs.renameSync(files.upload.path, newPath);
        res.end(util.inspect({fields: fields, files: files}));
       
     
		//写文件
		//  fs.renameSync(files,newPath); 
        //  fs.rename(files.path,newPath);
        //  res.end(util.inspect({fields: fields, files: files}));
		
    //   res.writeHead(200, {'content-type': 'text/plain'});
    //   res.write('received upload:\n\n');
    //   res.end(util.inspect({fields: fields, files: files}));
    });
})

app.use('/', routes);

app.use('/DimReduction', DimReduction);
app.use('/tangent', tangent);
app.use('/predictor', predictor);
app.use('/raw', raw);

// app.locals.resoucePath = "http://localhost:3000/sampleEjsPre/"; 
// app.use('/users', users);

// catch 404 and forward to error handle




app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});



// http.createServer(function(req, res) {
//   if (req.url == '/upload' && req.method.toLowerCase() == 'post') {
//     // parse a file upload
//     console.log('hahaha')
//     var form = new formidable.IncomingForm();
// 	form.encoding ='utf-8';
// 	// form.uploadDir = '/data/';
// 	form.keepExtensions = true;
	

//     form.parse(req, function(err, fields, files) {
		
// 		if (err) {
// 		      res.locals.error = err;
// 		      res.render('index', { title: 'upload' });
// 		      return;		
// 		    }  
		
// //		var newPath = form.uploadDir;
	
	
// 		//写文件
// 		 fs.renameSync(files.upload.path,"./public/iris-normalization.csv"); 
         
//          res.end();
		
//         //   res.render('raw.ejs',{title:'提交表单及参数示例'});
//     });

//     return;
//   }

//   // show a file upload form
// //   res.writeHead(200, {'content-type': 'text/html'});
// //   res.end(
// //     '<form action="/upload" enctype="multipart/form-data" method="post">'+
  
// //     '<input type="file" name="upload" multiple="multiple"><br>'+
// //     '<input type="submit" value="Upload and draw RadViz">'+
// //     '</form>'
// //   );
// }).listen(8080);

module.exports = app;