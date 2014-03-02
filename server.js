#!/bin/env node
var ip_addr = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port    = process.env.OPENSHIFT_NODEJS_PORT || '8080';

var express = require('express');
var jade = require('jade');

var quiz = require('./routes/quiz.js')
var results = require('./routes/results')

/* Initialize express */
var app = express();

app.use(express.bodyParser())

/* Use static folder for static assets (css, js, img) */
app.use(express.static('static'));

/* Use Jade as templating engine */
app.engine('jade', jade.__express);

/* For all URLs, render master.jade for now */
app.get('/',quiz.get);
app.post('/',quiz.post);
app.get('/results', results.get);

/* Run on port 3000 */
app.listen(port, ip_addr);