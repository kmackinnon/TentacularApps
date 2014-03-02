var mongoose = require('mongoose')
var options = {
	user: 'admin',
	pass: 'dwZ63dAT_1kV'
}
var ip_addr = process.env.OPENSHIFT_MONGODB_DB_HOST   || '127.0.0.1';
var port    = process.env.OPENSHIFT_MONGODB_DB_PORT || '27017';

var uri = ip_addr + ':' + port + '/kraken'
var db = mongoose.createConnection(uri, options)
var collection = null
var cities = []

var transitRef = [	
	'Walked',
	'Public transit',
	'Car, truck or van - as a passenger',
	'Car, truck or van - as a driver',
	'Bicycle',
	'Other methods'
]
var industryRef = [
	'11 Agriculture, forestry, fishing and hunting',
    '21 Mining, quarrying, and oil and gas extraction',
    '23 Construction',
    '31-33 Manufacturing',
    '44-45 Retail trade',
    '52 Finance and insurance',
    '54 Professional, scientific and technical services',
    '55 Management of companies and enterprises',
    '61 Educational services',
    '62 Health care and social assistance',
    '71 Arts, entertainment and recreation',
    '91 Public administration',
	'81 Other services (except public administration)'
]
var ethnicRef = [
	'',
	'Other North American origins',
	'Latin, Central and South American origins',
	'European origins',
	'African origins',
	'Asian origins'
]
var languageRef = [
	'English',
	'French',
	'German',
	'Spanish',
	'Mandarin'
]
db.on('connected', function callback(){
	collection = db.collection('census')
	console.log('connected to kraken: ' + collection.name);
});

exports.get = function (req, res){
	res.render('master.jade')
}
	
exports.post = function (req, res){
	console.log('quiz submitted')
	console.log(req.body)
	var userData = req.body
	
	collection.find({}, {cityName: true, provinceName: true, topic: true, characteristic: true, total: true}, function(err,data){
		data.each(function(err,row){
			if(row != null){
				//lastItem = (row.cityName == cities[cities.length-1].name)
				if(getCity(row.cityName) == null){
					cities.push({
						name: row.cityName,
						province: row.provinceName,
						totalValue: 0,
						cultureMatch: 0,
						jobMatch: 0,
						lifeMatch: 0,
						totalMatch: 0
					})
				}
				if(row.characteristic == 'Total population in private households by citizenship')
					getCity(row.cityName).totalValue = row.total
				else if(row.topic == 'Language used most often at work' && contains(userData.languages,row.characteristic)) // language
					getCity(row.cityName).job += row.total
				else if(row.topic == 'Ethnic origin population' && row.characteristic == ethnicRef[userData.emigratingfrom]) // emigration
					getCity(row.cityName).cultureMatch += row.total
				//else if(row.topic == 'City' && row.characteristic == userData.nightlife) // nightlife
					//getCity(row.cityName).cultureMatch += row.total
				else if(row.topic == 'Industry' && row.characteristic == industryRef[userData.industry]) // industry
					getCity(row.cityName).jobMatch += row.total
				//else if(row.topic == 'Temp' && row.characteristic == userData.industry) // temp
					//getCity(row.cityName).jobMatch += row.total
				else if(row.characteristic == userData.budget) // budget
					getCity(row.cityName).jobMatch += row.total
				//else if(row.topic == 'Industry' && row.characteristic == userData.industry) // rain
					//getCity(row.cityName).jobMatch += row.total
				else if(row.topic == 'Mode of transportation' && row.characteristic == transitRef[userData.transit])
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
		city.totalMatch = (city.jobMatch / city.totalValue) * userData.priorities[0] * 10 + 
							(city.cultureMatch / city.totalValue) * userData.priorities[2] * 10 +
							(city.lifeMatch / city.totalValue) * userData.priorities[3] * 10
		//console.log(city.name + "__" + city.totalMatch)
	}
	cities.sort(function(a,b){return b.totalMatch - a.totalMatch})
	console.log(cities[0])
	console.log('the top five cities for you are')
	console.log('1: ' + cities[0].name + ", " + cities[0].province + " at " + cities[0].totalMatch + "% match")
	console.log('2: ' + cities[1].name + ", " + cities[1].province + " at " + cities[1].totalMatch + "% match")
	console.log('3: ' + cities[2].name + ", " + cities[2].province + " at " + cities[2].totalMatch + "% match")
	console.log('4: ' + cities[3].name + ", " + cities[3].province + " at " + cities[3].totalMatch + "% match")
	console.log('5: ' + cities[2].name + ", " + cities[4].province + " at " + cities[4].totalMatch + "% match")
}
function getCity(cityName){
	for(var i=0; i<cities.length; i++){
		if(cities[i].name == cityName){
			return cities[i]
		}
	}
	return null
}
function contains(array, languageId){
	for(var i=0; i<array.length; i++){
		if(array[i] == languageRef[languageId]){
			return true
		}
	}
	return false
}