var express     		= require('express');
var app         		= express();
var bodyParser  		= require('body-parser');
var morgan				= require('morgan');
var tungus 				= require('tungus');
var mongoose			= require('mongoose');
var jwt					= require('jsonwebtoken');
var config				= require('./config/config');         //This is to get the config file
var User 				= require('./app/models/user'); //This is to get the mongoose model
var Administrator 		= require('./app/models/administrator');
var Instrument 			= require('./app/models/instrument'); 
var Record	 			= require('./app/models/record');

//*****************
 //Config
 //*****************

 var port = process.env.PORT || 8080; 
//This is to get the request parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('myprecious', config.secret); //Secret key to encrypt password
mongoose.connect(config.database); //This is used to connect to database
mongoose.set('debug', true);

app.use(morgan('dev')); //This is lo log requests to the console
 


//******************
//Routes
//******************

// basic Route (GET http://localhost:8080)
app.get('/', function(req, res) {
  res.send('Hi! The API is at http://localhost:' + port + '/api');
});
 
// Start the server
app.listen(port);
console.log('Starting the server on: http://localhost:' + port);

// bundle for the routes
var apiRoutes = express.Router();

// Login an user (POST http://localhost:8080/api/login)
apiRoutes.post('/login', function(req, res) {
	
	//Find for a user with the given credentials
	Administrator.findOne({
		"username": req.body.username
	}, function(err,admin){
		if (err) throw err;

		if(!admin){
			res.json({success:false, message:'Failed to login, the administrator does not exist'});
		} else if(admin){
			//If the admin is found, check if password matches.
			if(admin.pass == req.body.pass){
				//If the password is right, create a token
				var token = jwt.sign(admin, app.get('myprecious'), {
          		expiresIn: 1440 // expires in 24 hours
          		});
          		res.json({
          			success: true,
          			message: 'Authenticated',
          			token: token
          		});
			} else {
				res.json({success:false, message:'Failed to login, wrong password'});
			}
		}
	})
});


// This route is used as a middleware to verify a token
apiRoutes.use(function(req, res, next){

	//Get token
	var token = req.body.token || req.query.token || req.headers['x-access-token'];
	console.log(token);
	if(token){

		jwt.verify(token, app.get('myprecious'), function(err, decodedToken){
			if(err){
				return res.json({success: false, message: 'Failed to authenticate token'});
			} else {
				req.decodedToken= decodedToken;
				next();
			}
		});
	} else {
		//If no token was given return an error
		return res.status(403).send({
			success: false,
			message: 'You have to provide a token'
		});

	}
});
//Get monthly records of inventory.
apiRoutes.get('/record/getMonthlyRecords', function(req,res){
	var month = req.body.date.getMonth();
	var year = req.body.date.getFullYear();
	var start = new Date(year, month, 1);
	var end = new Date(year,month,31);
	Record.find({created_on: {$gte: start, $lte: end}},function(err, records){
		if(err) return console.error(err);		
		console.log(records);
		res.send(JSON.stringify(records));
	})
});

//Get all records
apiRoutes.get('/record/getAll', function(req,res){
	Record.find({}, 'userid name instrumentid instrumentname date -_id',function(err, records){
		if(err) return console.error(err);
		console.log(records);
		res.send(JSON.stringify(records));
	})
});

//Add new instrument
apiRoutes.post('/instrument/insertNew', function(req,res){
	var instrument = {
		  name: req.body.name,
  			id: req.body.id,
  	  quantity: req.body.quantity
	}
	Instrument.create(instrument);
	res.status(200).send({
		success:true
	});
});

//Add new lab user
apiRoutes.post('/user/newUser', function(req, res){
	var user = {
	id: req.body.id,
	name: req.body.name
	}
	User.create(user);
	res.status(200).send({
		success:true
	});
});

//Get stock
apiRoutes.get('/instrument/getAll', function(req, res){
	Instrument.find({}, 'id name quantity -_id', function(err, instruments){
		if(err) return console.error(err);
		console.log(instruments);
		res.send(JSON.stringify(instruments));
	})
});

//Update stock
apiRoutes.post('/instrument/update', function(req,res){
	var parameter = {id: req.body.id},
	update = { quantity: req.body.quantity};
	Instrument.findOneAndUpdate(parameter, update, {upsert:true}, function(err, doc){
    if (err) return res.send(500, { error: err });
    return res.send("succesfully updated");
	});		
});

//Add new record
apiRoutes.post('/record/newRecord', function(req, res){
	var record = {
		userid: req.body.userid,
		name: req.body.name,
		instrumentid: req.body.instrumentid,
		instrumentname: req.body.instrumentname,
		date: req.body.date
	}
	Record.create(record);
	res.status(200).send({
		success:true
	});
});

// connect the api routes under /api/*
app.use('/api', apiRoutes);

