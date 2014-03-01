#!/bin/env node

var express = require('express')
var jade = require('jade')


module.exports = {
	get: function (req, res){
		res.render('master.jade')
	}
	
	post: function (req, res){
		
	}
}