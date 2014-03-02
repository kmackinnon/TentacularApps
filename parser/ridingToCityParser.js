var csv = require('csv')
var loader = require('./ridingToCityLoad')

function runParser(){
	console.log('parsing started')
	csv().from(__dirname+'/ridingToCity.csv').transform(filter).on('end', function(){
		console.log('parsing finished')
	})
}

function filter(row, index){
	loader.addRidingToCity(row)
}
exports.runParser = runParser()