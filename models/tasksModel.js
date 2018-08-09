const mongoose = require('mongoose');

///////////////////////////
//Task
///////////////////////////

const taskSchema = mongoose.Schema({
    // client: { type: String, required: true },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    description: { type: String, required: true },
    completed: { type: Boolean, default: false},
})

module.exports = mongoose.model('Tasks', taskSchema, 'tasks');