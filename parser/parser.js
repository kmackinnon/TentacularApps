var loader = require('./mongoLoad')
var csv = require('csv')

var TOPIC = 3
var count = 0

function runParser(){
	console.log('parsing started')
	csv().from(__dirname+'/nhs.csv').transform(filter)
	console.log('parsing finished')
}
function filter(row, index){
	if ((row[TOPIC]=='Ethnic origin population') || (row[TOPIC]=='Religion') || (row[TOPIC]=='Language used most often at work') || (row[TOPIC]=='Industry') || (row[TOPIC]=='Mode of transportation') || (row[TOPIC]=='Shelter costs') || (row[TOPIC]=='Income of individuals in 2010')){
		loader.addCity(row)
	}
}
exports.runParser = runParser