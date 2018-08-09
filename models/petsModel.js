const mongoose = require('mongoose');

///////////////////////////
//Pet
///////////////////////////

const petSchema = mongoose.Schema({
    // client: { type: String, required: true },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    name: { type: String, required: true },
    type: { type: String, required: true },
    breed: { type: String },
    color: { type: String },
    food: { type: String }
})

module.exports = mongoose.model('Pets', petSchema, 'pets');