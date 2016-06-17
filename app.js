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
		db.collection('dev_projects').find({}).sort({archivedDate: -1}).toArray(function(err, docs) {
			res.render('home', { 'dev_projects': docs } );
        });

    });
	
//	SPECIFIC CLIENT SUMMARY
    app.get('/dev', function(req, res) {
        var client = req.query.client;
        db.collection('dev_projects').find({client: client}).sort({archivedDate: -1}).toArray(function(err, docs) {
			res.render('dev_client', {'dev_projects' : docs});
        });
    });
    
//	ADD CLIENT TO DEV DATABASE
    app.post('/add_conf', function(req, res, next) {
        var projectNum = req.body.projectNum;
		var client = req.body.client;
		var invoice = req.body.invoice;
		var profitMargin = parseFloat(req.body.profitMargin);
		var hoursLogged = parseFloat(req.body.hoursLogged);
		var archivedDate = parseInt(req.body.archivedDate);
        var velocity = parseInt(req.body.velocity);
        
        if ((projectNum == '') || (client == '') || (invoice == '')) {
            next("projectNum, client, and invoice are all required");
        } else {
			projectNum = parseInt(projectNum);
			invoice = parseInt(invoice);
            db.collection('dev_projects').insertOne(
                { 'projectNum': projectNum, 'client': client, 'invoice': invoice, 'profitMargin': profitMargin, 'hoursLogged': hoursLogged, 'archivedDate': archivedDate, 'velocity': velocity },
                function (err, r) {
                    assert.equal(null, err);
                    res.send("Document inserted with _id: " + r.insertedId);
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




