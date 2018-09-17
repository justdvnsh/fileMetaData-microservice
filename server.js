'use strict';

var express = require('express');
var cors = require('cors');
var mongoose = require('mongoose');
var multer = require('multer');

// setup
const DB_NAME = 'db.json';
const COLLECTION_NAME = 'images';
const UPLOAD_PATH = 'uploads';
const upload = multer({ dest: `${UPLOAD_PATH}/` }); // multer configuration

mongoose.connect(process.env.MLAB_URI);
const db = mongoose.connection;
db.on('error', (err) => { console.log('Mongo DB connection error', err); });
db.once('open', () => { console.log('Mongo DB connected.'); });

// require and use "multer"...

var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
     res.sendFile(process.cwd() + '/views/index.html');
  });

app.get('/hello', function(req, res){
  res.json({greetings: "Hello, API"});
});

app.post('/api/fileanalyse', upload.any(), (req, res) => {
  console.log(req.files)
  if ( req.files.length == 0 ) {
    res.json({ error: "no file uploaded" })
  } else {
    var fileMetadata = [];
        
        for (var i = 0; i < req.files.length; i++){
            
            var resObj = {
                file_name: req.files[i].originalname,
                file_size_bytes: req.files[i].size,
                file_extension: req.files[i].originalname.split('.').pop()
            }
            
            fileMetadata.push(resObj);
        }
        
        res.send(fileMetadata);
  }
})

app.listen(process.env.PORT || 3000, function () {
  console.log('Node.js listening ...');
});
