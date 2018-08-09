const Users = require('../models/usersModel');
const Tasks = require('../models/tasksModel');

////////////////////////////////
//AUTHENTICATED PROVIDERS ONLY
////////////////////////////////

//GET: get all tasks belonging to the client of an authenticated provider
exports.tasksClientGetList = (req, res) => {
    res.send('NOT IMPLEMENTED: Get all tasks belonging to my client');
};

//POST: add task to the client of an authenticated provider
exports.tasksClientPost = (req, res) => {
    res.send('NOT IMPLEMENTED: Add task to my client');
};

// DELETE: delete task belonging to the client of an authenticated provider
exports.tasksClientDelete = (req, res) => {
    res.send('NOT IMPLEMENTED: Delete task belonging to my client');
};

////////////////////////////////
//AUTHENTICATED CLIENTS ONLY
////////////////////////////////

//GET is handled by getMe

//POST: add task to the authenticated client
exports.tasksPost = (req, res) => {
    let createdTaskId = '';
    Tasks
        .create({
            clientId: req.body.clientId,
            description: req.body.description,
            // completed: req.body.completed
        })
        .then(task => {
            createdTaskId = task.id;
            return Users.findOne({ _id: req.body.clientId })
        })
        .then((user) => {
            user.tasks.push(createdTaskId);
            return user.save()
        })
        .then(() => {
            return Users.findOne({ '_id': req.body.clientId })
                .populate('pets')
                .populate({ path: 'visits', options: { sort: { startTime: -1 } } })
                .populate('tasks')
                .populate('provider')
                .populate('clients')
        })
        .then(user => {
            res.status(201).json(user.serialize());
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: "Internal server error" });
        });
}

// DELETE: delete task belonging to the authenticated client
exports.tasksDelete = (req, res) => {
    res.send('NOT IMPLEMENTED: Delete my task');
};

