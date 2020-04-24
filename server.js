var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Vehicle = require('./app/models/vehicle')//importing our model

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

var port = process.env.PORT||3000;

mongoose.connect('mongodb://localhost:27017/codealong');

var router = express.Router();

app.use('/api', router);

//middleware is useful for validation. If request is not safe we can stop it from here
router.use(function(req,res,next){
	console.log('Some process in going on');
	next();
});

router.get('/', function(req, res){
	res.json({message: 'Welcome to our API'});
});

router.route('/vehicles')
.post(function(req,res){
	var vehicle = new Vehicle(); //new instance of vehicle
	vehicle.make = req.body.make;
	vehicle.model = req.body.model;
	vehicle.color = req.body.color;
	vehicle.save(function(err){
		if(err)
		{
			res.send(err);
		}
		res.json({message: 'Vehicle is manufactured successfully'});
	});
})

.get(function(req,res){
	Vehicle.find(function(err, vehicles){
		if(err)
		{
			res.send(err);
		}
		res.json(vehicles);
	});
});

router.route('/vehicle/:vehicle_id')
.get(function(req,res){
	Vehicle.findById(req.params.vehicle_id, function(err, vehicle){
		if(err)
		{
			res.send(err);
		}
		res.json(vehicle);
	});
});

router.route('/vehicle/make/:make')
.get(function(req,res){
	Vehicle.find({make:req.params.make}, function(err, vehicle){
		if(err)
		{
			res.send(err);
		}
		res.json(vehicle);
	});
});

router.route('/vehicle/color/:color')
.get(function(req,res){
	Vehicle.find({color:req.params.color}, function(err, vehicle){
		if(err)
		{
			res.send(err);
		}
		res.json(vehicle);
	});
});

app.listen(port);

console.log('Server is listening on port'+port);