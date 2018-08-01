const mongoose = require('mongoose');

///////////////////////////
//Task
///////////////////////////

const taskSchema = mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    description: { type: String, required: true },
    completed: { type: Boolean },
})

module.exports = mongoose.model('Tasks', taskSchema, 'tasks');