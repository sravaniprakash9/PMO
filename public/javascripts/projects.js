// Dependencies
var restful = require('node-restful');
var mongoose = restful.mongoose;
 
// Schema
var projectSchema = new mongoose.Schema({
    name: String,
    startDate: String,
    endDate: String
});
 
// Return model
module.exports = restful.model('Projects', projectSchema);