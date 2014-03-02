var mongoose = require('mongoose')
var parser = require('./ridingToCityParser')

var collectionName = 'districtToCity'

var options = {
	user: 'admin',
	pass: 'dwZ63dAT_1kV'
}
var uri = 'mongodb://127.0.0.1:27017/kraken'
var db = mongoose.createConnection(uri, options)

var ridingsToCities = new mongoose.Schema({
	districtName: String,
	cityName: String
})

var collection = null
var model = null
var ran = false

db.on('error',console.error.bind(console,'connection error:'));
db.on('connected', function callback(){
	if(!ran)
		parser.runParser()
	console.log('here')
	
	collection = db.collection(collectionName)
	model = db.model('model',ridingsToCities, collection.name)
	
	
	
	console.log('connected to kraken: ' + collection.name);
	
	
})

exports.addRidingToCity = function(ridingData){	
	ran = true
	collection = db.collection(collectionName)
	model = db.model('model',ridingsToCities, collection.name)
	
	var ridingToCity = new model({
		districtName: ridingData[0],
		cityName: ridingData[1]
	})
	
	saveRidingToCity(ridingToCity)
}

function saveRidingToCity(ridingToCity){
	if(ridingToCity != null && ridingToCity != undefined){
		ridingToCity.save(function(err){console.log(err); console.log(ridingToCity)})
		console.log('saved ' + ridingToCity.ridingName + ' ' + ridingToCity.cityName)
	}
	else
		console.log('bad input')
}