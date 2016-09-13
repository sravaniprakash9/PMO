
// Dependencies
var express = require('express');
var router = express.Router();
 
//Product
var Project = require('../public/javascripts/projects');
Project.methods(['get', 'put', 'post', 'delete']);
Project.register(router, '/projects');
 
// Return router
module.exports = router;