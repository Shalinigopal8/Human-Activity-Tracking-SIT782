var mongoose = require('mongoose');


var projectSchema = mongoose.Schema({
    projectName: String,
    projectDescription: String,
    startDate: String,
    endDate: String

});




module.exports = mongoose.model('Project', projectSchema);
