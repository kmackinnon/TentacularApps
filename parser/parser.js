var loader = require('./mongoLoader')
var csv = require('csv')

var TOPIC = 3

csv().from('nhs.csv').transform(filter)

var count = 0

function filter(row, index){
	if ((row[TOPIC]=='Ethnic origin population') || (row[TOPIC]=='Religion') || (row[TOPIC]=='Language used most often at work') || (row[TOPIC]=='Industry') || (row[TOPIC]=='Mode of transportation') || (row[TOPIC]=='Shelter costs') || (row[TOPIC]=='Income of individuals in 2010'))
		loader.addCity(row)
}