var mongoose = require('mongoose');


var criteriaSchema = mongoose.Schema({
    name: String,
    id: String,
    userId:String,
    field: String
});




module.exports = mongoose.model('Criteria', criteriaSchema);
