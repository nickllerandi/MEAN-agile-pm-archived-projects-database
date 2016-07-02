var express = require('express'),
    app = express(),
    engines = require('consolidate'),
	bodyParser = require('body-parser'),
    MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

app.engine('html', engines.nunjucks);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: true })); 

MongoClient.connect('mongodb://localhost:27017/Liqui-Site', function(err, db) {

    assert.equal(null, err);
    console.log("Successfully connected to MongoDB.");

//	ALL PROJECTS SUMMARY
    app.get('/', function(req, res){
		db.collection('projects').find({}).sort({archivedDate: -1}).toArray(function(err, docs) {
			res.render('home', { 'projects' : docs } );
        });
    });
	
// QUERY BY TYPE OF PROJECT
	app.get('/type', function(req, res){
		var type = req.query.type;
		db.collection('projects').find({type: type}).sort({archivedDate: -1}).toArray(function(err, docs) {
			res.render('queries', { 'projects' : docs } );
        });
    });   
	
//	QUERY BY CLIENT
    app.get('/client', function(req, res) {
        var client = req.query.client;
        db.collection('projects').find({client: client}).sort({archivedDate: -1}).toArray(function(err, docs) {
			res.render('queries', {'projects' : docs});
        });
    });
	
//	QUERY BY Project Number
    app.get('/projectNum', function(req, res) {
        var projectNum = parseInt(req.query.projectNum);
        db.collection('projects').find({projectNum: projectNum}).sort({archivedDate: -1}).toArray(function(err, docs) {
			res.render('queries', {'projects' : docs});
        });
    });
	
//	QUERY BY ARCHIVEDYEAR
	app.get('/archivedYear', function(req, res){
		var archivedYear = parseInt(req.query.archivedYear);
		db.collection('projects').find({archivedYear: archivedYear}).sort({archivedDate: -1}).toArray(function(err, docs) {
			res.render('queries', { 'projects' : docs } );
        });
    });
	
//	QUERY BY ARCHIVEDDATE
	app.get('/archivedDate', function(req, res) {
        var archivedDate = parseInt(req.query.archivedDate);
        db.collection('projects').find({archivedDate: archivedDate}).sort({archivedDate: -1}).toArray(function(err, docs) {
			res.render('queries', {'projects' : docs});
        });
    });
    
//	ADD CLIENT TO DEV DATABASE
    app.post('/add_conf', function(req, res, next) {
		var type = req.body.type;
        var projectNum = parseInt(req.body.projectNum);
		var client = req.body.client;
		var invoiceNum = parseInt(req.body.invoiceNum);
		var invoice = parseFloat(req.body.invoice);
		var archivedYear = parseInt(req.body.archivedYear);
		var archivedDate = parseInt(req.body.archivedDate);
		var profitMargin = req.body.profitMargin;
		var hoursLogged = req.body.hoursLogged;
        var velocity = req.body.velocity;
        
        if ((type == '') || (projectNum == '') || (client == '') || (invoice == '')) {
            next("projectNum, client, and invoice are all required");
        } else {
//			profitMargin = parseFloat(req.body.profitMargin);
//			hoursLogged = parseFloat(req.body.hoursLogged);
//			velocity = parseInt(req.body.velocity);
            db.collection('projects').insertOne({ 
				'type': type, 
				'projectNum': projectNum, 
				'client': client, 
				'invoiceNum': invoiceNum,
				'invoice': invoice,
				'archivedYear': archivedYear,
				'archivedDate': archivedDate,
				'profitMargin': profitMargin, 
				'hoursLogged': hoursLogged, 
				'velocity': velocity 
			},
                function (err, r) {
                    assert.equal(null, err);
                    res.send('thnx :)');
                }
            );
        }
    });

    app.use(function(req, res){
        res.sendStatus(404);
    });
    
    var server = app.listen(666, function() {
        var port = server.address().port;
        console.log('Express server listening on port %s.', port);
    });
});






