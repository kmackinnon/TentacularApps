var mongoose = require('mongoose')
var options = {
	user: 'admin',
	pass: 'dwZ63dAT_1kV'
}
var uri = 'mongodb://127.0.0.1:27017/kraken'
var db = mongoose.createConnection(uri, options)
var collection = null
var cities = []

db.on('connected', function callback(){
	collection = db.collection('census')
	console.log('connected to kraken: ' + collection.name);
});

exports.get = function (req, res){
	res.render('master.jade')
}
	
exports.post = function (req, res){
	var data = JSON.parse(req)
	var userData = {
		jobWeight: req.body.job,
		cultureWeight: req.body.culture,
		climateWeight: req.body.climate,
		lifeWeight: req.body.life,

		language: req.body.language,
		immigrating: req.body.immigrating,
		emigrating: req.body.emigrating, // boolean
		nightlife: req.body.nightlift,
		employed: req.body.employed, // boolean
		industry: req.body.industry,
		temperature: req.body.temperature,
		budget: req.body.budget,
		rain: req.body.rain,
		transit: req.body.transit
	}
	collection.find({}, {cityName: true, topic: true, characteristic: true, total: true}, function(err,data){
		data.each(function(err,row){
			if(row != null){
				//lastItem = (row.cityName == cities[cities.length-1].name)
				if(!contains(cities, row.cityName)){
					cities.push({
						name: row.cityName,
						province: row.provinceName,
						totalValue: 0,
						cultureMatch: 0,
						jobMatch: 0,
						lifeMatch: 0,
						matchValue: 0
					})
				}
				if(row.characteristic == 'Total population in private households by citizenship')
					getCity(row.cityName).totalValue = row.total
				else if(row.topic == 'Language used most often at work' && row.characteristic == userData.language) // language
					getCity(row.cityName).job += row.total
				else if(row.topic == 'Ethnic origin population' && userData.immigrating && row.characteristic == userData.emigrating) // emigration
					getCity(row.cityName).cultureMatch += row.total
				//else if(row.topic == 'City' && row.characteristic == userData.nightlife) // nightlife
					//getCity(row.cityName).cultureMatch += row.total
				else if(row.topic == 'Industry' && userData.employed && row.characteristic == userData.industry) // industry
					getCity(row.cityName).jobMatch += row.total
				//else if(row.topic == 'Temp' && row.characteristic == userData.industry) // temp
					//getCity(row.cityName).jobMatch += row.total
				else if(row.characteristic == userData.budget) // budget
					getCity(row.cityName).jobMatch += row.total
				//else if(row.topic == 'Industry' && row.characteristic == userData.industry) // rain
					//getCity(row.cityName).jobMatch += row.total
				else if(row.topic == 'Mode of transportation' && row.characteristic == userData.transit)
					getCity(row.cityName).lifeMatch += row.total
			}
			else{
				getMatchValues(userData)
			}
		})
	})
	res.send('done')
}
function getMatchValues(userData){
	for(var i=0; i<cities.length; i++){
		var city = cities[i]
		city.totalMatch = (city.jobMatch / city.totalValue) * userData.jobWeight + 
							(city.cultureMatch / city.totalValue) * userData.cultureWeight +
							(city.lifeMatch / city.totalValue) * userData.lifeWeight
		//console.log(city.name + "__" + city.totalMatch)
	}
	cities.sort(function(a,b){return b.totalMatch - a.totalMatch})
	
	console.log('best match is ' + cities[0].name + ", " + cities[0].province + " at " + cities[0].totalMatch + "% match")
	print(cities[0])
}
function getCity(cityName){
	for(var i=0; i<cities.length; i++){
		if(cities[i].name == cityName){
			return cities[i]
		}
	}
	return null
}
function contains(array, cityName){
	for(var i=0; i<array.length; i++){
		if(array[i].name == cityName){
			return true
		}
	}
	return false
}