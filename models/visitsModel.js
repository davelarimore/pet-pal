const mongoose = require('mongoose');

///////////////////////////
//Visit
///////////////////////////

const visitSchema = mongoose.Schema({
    provider: { type: Number, required: true },
    client: { type: String, required: true },
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
    recurrence: { type: String, default: ''}
})

module.exports = mongoose.model('Visits', visitSchema, 'visits');

