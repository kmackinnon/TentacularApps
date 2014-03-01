var mongoose = require('mongoose')

var options = {
	user: 'admin',
	pass: 'dwZ63dAT_1kV'
}
var uri = 'mongodb://127.0.0.1:27017/kraken'
var db = mongoose.createConnection(uri, options)

db.on('error',console.error.bind(console,'connection error:'));
db.on('connected', function callback(){console.log('connected'); buildModels()});

console.log(db.collections)
console.log(db.readyState)


// This is the Load (ETL) function, should take in Transformed city data
function buildModels(){
	console.log(db.collections)
	console.log(db.readyState)

	var cities = new mongoose.Schema({
		name: String,
		precipitation: Number,
		temperature: Number,
		salary: Number
	})
	var collection = db.collection('test')
	var model = db.model('model',cities, collection.name)
	var testCity = new model({name:'Test',precipitation:10.0,temperature:-1.0,salary:80000})
	
	// pull data from csv
	// iterate through data set and add each item
	addCity(collection, testCity)
}
	
function addCity(collection, city){
	collection.count({name:city.name},function(err, count){
	console.log(city.name)
	if(err) 
		return console.log('whelp')
	if(count == 0)
		saveCity(city)
	else
		console.log(city.name + ' is already here ' + count + ' times')
	})
}
function saveCity(city){
	city.save(function(err){ if(err) return console.log('fuck this')})
	console.log('saved')
}






