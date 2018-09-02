var mongoose = require('mongoose');


var projectSchema = mongoose.Schema({
    name: String,
    id: String,
    field: String
});




module.exports = mongoose.model('Criteria', projectSchema);
