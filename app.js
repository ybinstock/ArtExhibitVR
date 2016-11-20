//var images = [
//  'photo1.jpg', 'photo2.jpg', 'photo3.jpg', 'photo4.jpg', 'photo5.jpg', 'photo6.jpg', 'photo7.jpg', 'photo8.jpg'
//];
//var image_index = -1;
//
//function switchPhoto() {
//  for (var i = 0; i < images.length; i++) {
//    image_index = (image_index + 1) % images.length;
//    console.log('image_index is', images[image_index]);
//    $('#interior-wall').attr('material', 'src: url(' + images[image_index] + ')');
//  }
//}
//
//switchPhoto();

'use strict';

/******************* Modules *******************/

var _          = require('lodash'),
    formidable = require('formidable'),
    fs         = require('fs'),
    express    = require('express'),
    logger     = require('morgan'),
    bodyParser = require('body-parser'),
    gm         = require('gm');

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

var app = express();
app.use(express.static('public', {extensions: ['html']}));
app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(logger('combined'));

// app.use(session({
// 	store: new redisStore({
// 		host: 'api.pureod.0001.usw2.cache.amazonaws.com',
// 		port: 6379
// 	}),
// 	secret: 'byQ5tc5hEKCFS',
// 	resave: true,
// 	saveUninitialized: false,
// 	cookie: {
// 		domain:'.medcenterdisplay.com',
// 		expires: (new Date()).setDate((new Date()).getDate() + 30),
// 		secure: false, // Set to True when Get Certificate,
// 		signed: true
// 	},
// 	proxy: true
// }));
// app.use(passport.initialize());
// app.use(passport.session());
//app.use(passport.authenticate('remember-me'));
//app.use(express.limit('25M'));
app.use(allowCrossDomain);

// CREATE: Uploads Image Files to the Server
app.post('/v1/upload/:galleryId/:imageNumber/', function(req, res) {
  // connection.logActivity(req.user.UserID, 2);
  var form   = new formidable.IncomingForm(),
      fields = {};

  form
    //for any other information besides the image
    .on('field', function(name, value) {
      fields[name] = value;
    })
    //for the image
    .on('file', function(name, file) {

      fs.rename(file.path,
        '/Users/ybinstock/Desktop/VR/artstudio/public/' + req.params.galleryId + '/' + req.params.imageNumber + ".jpg",
        function(error) {
          if (error) {
            console.log('error', error);
            res.status(500).send();
          }
          else {
            res.status(200).send();
          }
        });

      //gm isn't workign with jpg. figure out why.

      //gm(file.path).resize(500).write('/Users/ybinstock/Desktop/VR/artstudio/public/' + req.params.galleryId + '/' +
      // req.params.imageNumber + ".jpg", function(fileError) {  if (fileError) { console.log('error', fileError);
      // res.status(500).send(); } else { fs.exist(file.path, function(exist) { if (exist) { fs.unlink(file.path); }
      // }); res.status(200).send(); }
    });
//.on('end', function() {
//  redisClient.delWildcard('LIBRARY_ASSET:*', function(redisError) {
//    if (redisError) {
//      console.error('An error occured while trying to flush library asset from Redis (' + redisError + ').');
//    }
//  });
//});

  form.parse(req);
});

/*************** Error Handling ****************/

app.use('/', function(req, res) {
  res.status(404).send({
    error: true,
    errorCode: 404,
    url: req.url,
    method: req.method,
    statusCode: req.statusCode,
    statusMessage: req.statusMessage,
    body: req.body
  });
});

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
//
//function requireLogin(req, res, next) {
//  if(req.user) {
//    next();
//  } else {
//    res.status(401).send('Login to Retrieve Data');
//  }
//}

function allowCrossDomain(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://portal.medcenterdisplay.com');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header('Access-Control-Expose-Headers', 'Content-Length');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Cache-Control, X-Requested-With, Accept');
  next();
};

var server = app.listen(3000, function() {
  console.log('API server successfully started on and is listening on port ' + server.address().port + '.');
});