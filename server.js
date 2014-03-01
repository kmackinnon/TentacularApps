#!/bin/env node
/*
	Testing server for rendering templates
	Will NOT run on OpenShift.
*/
var express = require('express');
var jade = require('jade');

var quiz = require('./routes/quiz.js')
var results = require('./routes/results')

/* Initialize express */
var app = express();

/* Define router before static to avoid static files overriding routes */
app.use(app.router);
/* Use static folder for static assets (css, js, img) */
app.use(express.static('static'));

/* Use Jade as templating engine */
app.engine('jade', jade.__express);

/* For all URLs, render master.jade for now */
app.get('/',quiz.get);
app.get('/results', results.get);

/* Run on port 3000 */
app.listen(8080, 'localhost');