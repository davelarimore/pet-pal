const mongoose = require('mongoose');

///////////////////////////
//Visit
///////////////////////////

const visitSchema = mongoose.Schema({
    provider: { type: Number, required: true },
    client: { type: Number, required: true },
    // provider: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'users'
    // },
    // client: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'users'
    // },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    recurrence: { type: String, required: true }
})

module.exports = mongoose.model('Visits', visitSchema, 'visits');

