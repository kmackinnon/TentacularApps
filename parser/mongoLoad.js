var mongoose = require('mongoose')
var parser = require('./parser')

var collectionName = 'census'

var options = {
	user: 'admin',
	pass: 'dwZ63dAT_1kV'
}
var uri = 'mongodb://127.0.0.1:27017/kraken'
var db = mongoose.createConnection(uri, options)

var cities = new mongoose.Schema({
	geocode: Number,
	provinceName: String,
	ridingName: String,
	topic: String,
	characteristic: String,
	total: Number
})
var collection = null
var model = null
	
db.on('error',console.error.bind(console,'connection error:'));
db.on('connected', function callback(){
	collection = db.collection(collectionName)
	model = db.model('model',cities, collection.name)
	
	console.log('connected to kraken: ' + collection.name);
	
	parser.runParser()
});

// Add a city to the database, takes in a length 6 array containing [geoCode,province,city,topic,char,total]
function addCity(cityData){
	var city = new model({
		geocode: parseFloat(cityData[0]),
		provinceName: cityData[1],
		ridingName: cityData[2],
		topic: cityData[3],
		characteristic: cityData[4],
		total: parseFloat(cityData[5])
	})
	collection.count({
		geocode: city.geocode,
		provinceName: city.provinceName,
		ridingName: city.ridingName,
		topic: city.topic,
		characteristic: city.characteristic
	},function(err, count){
		if(err) 
			return console.log('whelp')
		if(count == 0)
			saveCity(city)
		else{
			console.log(city.ridingName + ' is already here ' + count + ' times')
			//updateCity(city)
		}
	})
}
exports.addCity = addCity
function saveCity(city){
	city.save(function(err){ if(err) return console.log('whoops an error')})
	console.log('saved__' + city.ridingName)
}



