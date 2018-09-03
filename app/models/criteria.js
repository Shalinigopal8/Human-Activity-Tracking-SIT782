var mongoose = require('mongoose');


var criteriaSchema = mongoose.Schema({
    name: String,
    id: String,
    field: String
});




module.exports = mongoose.model('Criteria', criteriaSchema);
