//Created by manzumbado 
//Last edited: November 21, 2016

var child_p             = require('child_process');
var fs 			        = require('fs');
var tungus 				= require('tungus');
var mongoose			= require('mongoose');
var config				= require('./config/config');         //This is to get the config file
var User 				= require('./app/models/user'); //This is to get the mongoose model
var Administrator 		= require('./app/models/administrator');
var Instrument 			= require('./app/models/instrument'); 
var Record	 			= require('./app/models/record');


mongoose.connect(config.database); //This is used to connect to database
mongoose.set('debug', true);

child_p.execSync('echo 22 > /sys/class/gpio/export', { encoding: 'utf8' });

child_p.execSync('echo out > /sys/class/gpio/gpio22/direction', { encoding: 'utf8' });






while (true) {
    var userid = child_p.execSync('app/bin/Read', { encoding: 'utf8' });
    var userid2 = userid.substring(0,userid.length-1);

    child_p.execSync('echo 1 > /sys/class/gpio/gpio22/value', { encoding: 'utf8' });

    var instrumentid = child_p.execSync('app/bin/zocv', { encoding: 'utf8' });

    child_p.execSync('echo 0 > /sys/class/gpio/gpio22/value', { encoding: 'utf8' });


    var date = new Date()
	var dateF = date.toString('dd-MM-yyyy')
	var username;
	var instname;
	console.log(instrumentid);
	Instrument.findOne({ 'id': instrumentid }, 'name', function(err1, inst){
		instname=inst.name;
    	if (err1) return res.send(500, { error: err1 })})
	console.log(userid);
    User.findOne({ 'id': userid2 }, 'name', function(err1, user){
    	username=user.name;
    if (err1) return res.send(500, { error: err1 })})

	var record = {
		userid: userid,
		instrumentid: instrumentid,
		date: dateF
	}
	console.log(record);
	Record.create(record)

}