const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const itemModel =  new Schema({
    prod_id: { type: Number, required: true },
    prod_name: { type: String, required: true },
    Category_id: { type: Number, required: true },
    type: { type: String, required: true },
    image: { type: String, required: true },
    Price:  { type: Number, required: true }
})

module.exports = mongoose.model('itemDetails',itemModel,'itemDetails')