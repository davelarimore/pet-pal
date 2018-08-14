const Tasks = require('../models/tasksModel');

//GET is handled by getMe

//POST: add task to the authenticated client or client of provider
exports.tasksPost = (req, res) => {
    let createdTaskId = '';
    Tasks
        .create({
            clientId: req.body.clientId,
            description: req.body.description,
        })
        .then(task => {
            res.status(201).json(task);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: "Internal server error" });
        });
}

// DELETE: delete task belonging to the client or client of provider
exports.tasksDelete = (req, res) => {
    if (req.user.tasks.includes(req.params.id) || req.user.clients.filter(tasks => tasks.includes(req.params.id))) {
        Tasks
            .findByIdAndRemove(req.params.id)
            .then(() => {
                res.status(204).json({ message: 'Task deleted' });
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ error: 'Internal server error' });
            });
    } else {
        res.status(403).json({ error: 'User does not own task' })
    }
}