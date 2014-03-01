#!/bin/env node
/*
	Testing server for rendering templates
	Will NOT run on OpenShift.
*/
var express = require('express');
var jade = require('jade');

/* Initialize express */
var app = express();

/* Use static folder for static assets (css, js, img) */
app.use(express.static('static'));

/* Use Jade as templating engine */
app.engine('jade', jade.__express);

/* For all URLs, render master.jade for now */
app.all('*', function(req, res) {
	res.render('master.jade');
});

/* Run on port 3000 */
app.listen(3000, 'localhost');