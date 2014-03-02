var csv = require('csv')
var loader = require('./ridingToCityLoad')

var CITY = 1
var RIDING = 0
var ridingToCity = {}

function runParser(){
	console.log('parsing started')
	csv().from('ridingToCity.csv').transform(filter).on('end', function(){
		console.log('parsing finished')
	})
}

function filter(row, index){
	loader.addRidingToCity(row)
}
exports.runParser = runParser()