var BSON = require('mongodb')
var express = require('express')
var assert = require('assert')
var engines = require('consolidate');
var bodyParser = require('body-parser');

var MongoClient = require('mongodb').MongoClient
var url = 'mongodb://localhost:27017/map'

var app = express()
var router = express.Router()

app.engine('html', engines.nunjucks);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

MongoClient.connect(url, function(err, db) {
    assert.equal(null, err)
    console.log('Succesfully connected to mongodb')


    router.get('/', function(req, res) {
        db.collection('canada').find({}).sort({'city': 1}).toArray(function(err, docs) {
            res.render('index.html', {docs: docs})
        })
    })
    
    router.get('/:id', function(req, res) {
        var id = req.params.id
        db.collection('canada').findOne({'_id': new BSON.ObjectID(id)}, function(err, pos) {
            res.render('track.html', {pos: pos})
        })
    })
    
    
    
    
    
// END    
})

// Mount the router on the app
app.use('/', router)

// Create server running on port 3000
var server = app.listen(3000, function() {
    var port = server.address().port
    console.log('Express listening on port %s', port)
})
