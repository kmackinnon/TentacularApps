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

db.on('error',console.error.bind(console,'connection error:'));
db.on('connected', function callback(){
	collection = db.collection(collectionName)
	model = db.model('model',ridingsToCities, collection.name)
	
	console.log('connected to kraken: ' + collection.name);
	
	parser.runParser()
})

exports.addRidingToCity = function(ridingData){
	console.log(db)
	var ridingToCity = new model({
		districtName: ridingData[0],
		cityName: ridingData[1]
	})
	
	collection.count({
		ridingName: ridingToCity.riding,
		cityName: ridingToCity.city
	},function(err, count){
		if(err) 
			return console.log('whelp')
		if(count == 0)
			saveRidingToCity(ridingToCity)
		else{
			console.log(ridingToCity.ridingName + ' is already here ' + count + ' times')
		}
	})
}

function saveRidingToCity(ridingToCity){
	city.save(function(err){console.log('there was an error')})
	console.log('saved ' + ridingToCity.ridingName + ' ' + ridingToCity.cityName)
}