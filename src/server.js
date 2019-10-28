// import necessary dependencies
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var cors = require('cors');
var env = process.env.NODE_ENV || 'development';
var path = require('path');
var serverPort = 3000;
var app = express();
var router = express.Router();

// configure application to accept json request and set the maximum size of json output
app.use(cors());
app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json({limit: '50mb', type: 'application/vnd.api + json'}));

// configure the server to listen to data requests
router.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'views/index.html'));
});

// Configure server to accept the requests for static files
app.use('/js', express.static(path.join(__dirname, 'views/js')));
app.use('/images', express.static(path.join(__dirname, 'views/images')));
app.use('/css', express.static(path.join(__dirname, 'views/css')));
app.use('/data', require('./data'));
app.use('/', router);

// start the server
app.listen(serverPort);
console.log(`Application is listening on port: ${serverPort}, environment: ${env}`);