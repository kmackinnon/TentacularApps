var mongoose = require('mongoose')
var options = {
	user: 'admin',
	pass: 'dwZ63dAT_1kV'
}
var ip_addr = process.env.OPENSHIFT_MONGODB_DB_HOST   || '127.0.0.1';
var port    = process.env.OPENSHIFT_MONGODB_DB_PORT || '27017';

var uri = ip_addr + ':' + port + '/kraken'
var db = mongoose.createConnection(uri, options)
var censusData = null
var cityRef = null
var ridingToCity = {}
var cities = []
var ridingPop = {}
var ridingUnemploy = {}

var userData = null

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
var languageRef = {
	en: 'English',
	fr: 'French',
	de: 'German',
	es: 'Spanish',
	mn: 'Mandarin'
}
var citySizeRef = [
	100000,
	500000,
	9999999
]
var incomeRef = [
	10000,
	30000,
	50000,
	70000,
	90000,
	150000
]
db.on('connected', function callback(){
	censusData = db.collection('census')
	cityRef = db.collection('districtToCity')
	console.log('connected to kraken: ' + censusData.name + ' and ' + cityRef.name);
});

exports.get = function (req, res){
	res.render('master.jade')
}
	
exports.post = function (req, res){
	console.log('quiz submitted')
	console.log(req.body)
	userData = req.body
	
	loadRidingToCity(res);
}
function loadRidingToCity(res){
	cityRef.find({}, {districtName: true, cityName: true}, function(err,data){
		data.each(function(err,row){
			if(row != null){
				ridingToCity[row.districtName] = row.cityName
			}
			else{
				analyseCities(res)
			}
		})
	})
}
function analyseCities(res){
	censusData.find({}, {ridingName: true, provinceName: true, topic: true, characteristic: true, total: true}, function(err,data){
		data.each(function(err,row){
			if(row != null){
				if(getCityObject(row.ridingName) == null){
					cities.push({
						name: getCityName(row.ridingName),
						province: row.provinceName,
						totalResponders: 0,
						unemployment: 0,
						avgIncome: 0,
						cultureMatch: 0,
						jobMatch: 0,
						lifeMatch: 0,
						totalMatch: 0
					})
					console.log("Analysing " + getCityName(row.ridingName))
				}
				if(row.characteristic == 'Total population in private households by citizenship'){
					getCityObject(row.ridingName).totalResponders += row.total
					ridingPop[row.ridingName] = row.total
				}
				/* career impacts */
				else if(row.topic == 'Language used most often at work' && contains(userData.languages,row.characteristic)){
					getCityObject(row.ridingName).jobMatch += row.total
					getCityObject(row.ridingName).cultureMatch += row.total
				}
				else if(row.topic == 'Industry' && row.characteristic == industryRef[userData.industry])
					getCityObject(row.ridingName).jobMatch += row.total
				else if(row.characteristic == 'Average income ($)')
					getCityObject(row.ridingName).avgIncome += (row.total / userData.income)
				else if(row.characteristic == 'Unemployment rate')
					ridingUnemploy[row.ridingName] = row.total / 100
					//getCityObject(row.ridingName).unemployment += (row.total * ridingPop[row.ridingName])
				/* cultural impacts */
				else if(row.topic == 'Ethnic origin population' && row.characteristic == ethnicRef[userData.emigratingfrom])
					getCityObject(row.ridingName).cultureMatch += row.total
				/* climate impacts 
				else if(row.topic == 'Temp' && row.characteristic == userData.industry)
					getCityObject(row.ridingName).lifeMatch += row.total
				else if(row.topic == 'Industry' && row.characteristic == userData.industry)
					getCityObject(row.ridingName).lifeMatch += row.total
				*/
				/* lifestlye impacts */
				else if(row.topic == 'Mode of transportation' && row.characteristic == transitRef[userData.transit])
					getCityObject(row.ridingName).lifeMatch += row.total		
			}
			else{
				for( var i in ridingUnemploy){
					getCityObject(i).unemployment += (ridingUnemploy[i] * ridingPop[i])
				}
				getMatchValues(res)
			}
		})
	})
}
function getMatchValues(res){
	for(var i=0; i<cities.length; i++){
		var city = cities[i]
		var popLimit = citySizeRef[userData.population] * userData.priorities[2] * 10;

		var incomeVal = city.avgIncome
		if(incomeVal > 1)
			incomeVal = 1
			
		city.totalMatch = 	((city.jobMatch / city.totalResponders) * incomeVal * ( 1 - (city.unemployment / city.totalResponders))  * (5-userData.priorities[0]) * 10 + 
							 (city.cultureMatch / city.totalResponders) * (5-userData.priorities[2]) * 10 +
							 (city.lifeMatch / city.totalResponders) * (5-userData.priorities[3]) * 10)  + (city.totalResponders / 50000)
							 
							 
		if(city.totalResponders > popLimit)
			cities.splice(i,1)
		
		if(city.province == 'British Columbia')
			city.totalMatch += (userData.rain-1) * 20 * userData.priorities[1]
	}
	cities.sort(function(a,b){return b.totalMatch - a.totalMatch})

	console.log('the top five cities for you are')
	console.log('1: ' + cities[0].name + ", " + cities[0].province + " at " + cities[0].totalMatch + "% match")
	console.log('2: ' + cities[1].name + ", " + cities[1].province + " at " + cities[1].totalMatch + "% match")
	console.log('3: ' + cities[2].name + ", " + cities[2].province + " at " + cities[2].totalMatch + "% match")
		
	var cityList = {
		first: {city: cities[0].name, prov: cities[0].province},
		second: {city: cities[1].name, prov: cities[1].province},
		third: {city: cities[2].name, prov: cities[2].province}
	}
	res.writeHead(200, {'Content-Type': 'application/json'})
	res.write(JSON.stringify(cityList))
	res.end()
	
}
function getCityName(ridingName){
	return ridingToCity[ridingName]
}
function getCityObject(ridingName){
	for(var i=0; i<cities.length; i++){
		if(cities[i].name == getCityName(ridingName)){
			return cities[i]
		}
	}
	return null
}
function contains(array, languageId){
	for(var i=0; i<array.length; i++){
		if(languageRef[array[i]] == languageId){
			return true
		}
	}
	return false
}