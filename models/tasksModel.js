const mongoose = require('mongoose');

///////////////////////////
//Task
///////////////////////////

const taskSchema = mongoose.Schema({
    client: { type: String, required: true },
    // client: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'users'
    // },
    description: { type: String, required: true },
    completed: { type: Boolean, default: false},
})

module.exports = mongoose.model('Tasks', taskSchema, 'tasks');