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
	for(var i = 0; i < row.length; i++){
		while(row[i].charAt(0)==" "){
			row[i] = row[i].substring(1)
		}
	}
	if (((row[TOPIC]=='Ethnic origin population')&& (
			(row[TOPIC+1]=='Other North American origins')
			||(row[TOPIC+1]=='European origins')
			||(row[TOPIC+1]=='Latin, Central and South American origins')
			||(row[TOPIC+1]=='African origins')
			||(row[TOPIC+1]=='Asian origins'))) 
	|| (row[TOPIC]=='Language used most often at work') 
	|| (row[TOPIC]=='Industry') 
	|| (row[TOPIC]=='Mode of transportation') 
	|| (row[TOPIC+1]=='Average monthly shelter costs for rented dwellings ($)')
	|| (row[TOPIC]=='Income of individuals in 2010')
	|| (row[TOPIC+1] == 'Total population in private households by citizenship')
	|| (row[TOPIC+1] == 'Unemployment rate')){
		loader.addCity(row)
	}
}
exports.runParser = runParser
