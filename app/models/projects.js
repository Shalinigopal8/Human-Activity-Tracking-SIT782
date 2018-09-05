var mongoose = require('mongoose');


var projectSchema = mongoose.Schema({
    userId:String,
    projectId:String,
    projectName: String,
    projectDescription: String,
    startDate: String,
    endDate: String

});




module.exports = mongoose.model('Project', projectSchema);
