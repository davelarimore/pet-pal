const Tasks = require('../models/tasksModel');

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

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

//GET: get all tasks belonging to the authenticated client
exports.tasksGet = (req, res) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        let authorization = req.headers.authorization.split(' ')[1],
            decoded;
        try {
            decoded = jwt.verify(authorization, JWT_SECRET);
        } catch (e) {
            res.status(401).send('unauthorized');
        }
        console.log(decoded);
        const userId = decoded.user.id;
        console.log(userId);
        // Fetch the tasks by client id 
        Tasks.find({ client: userId })
            .then(tasks => {
                res.json(tasks);
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ message: 'Internal server error' })
            })
    }
};

//POST: add task to the authenticated client
exports.tasksPost = (req, res) => {
    Tasks
        .create({
            client: req.body.client,
            description: req.body.description,
            completed: req.body.completed
        })
        .then(task => res.status(201).json(task))
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: "Internal server error" });
        });
}

// DELETE: delete task belonging to the authenticated client
exports.tasksDelete = (req, res) => {
    res.send('NOT IMPLEMENTED: Delete my task');
};


// //GET: get all tasks belonging to the authenticated client, or belonging to the client of an authenticated provider
// router.get('/', (req, res) => {
//     Task
//         .find()
//         .catch(err => {
//             console.error(err);
//             res.status(500).json({ message: 'Inernal server error' })
//         });
// });

// // GET by ID N/A

// //POST: add task to the authenticated client, or to the client of an authenticated provider
// router.post('/', (req, res) => {
//     const requiredFields = ['user', 'description'];
//     for (let i = 0; i < requiredFields.length; i++) {
//         const field = requiredFields[i];
//         if (!(field in req.body)) {
//             const message = `Missing \`${field}\` in request body`;
//             console.error(message);
//             return res.status(400).send(message);
//         }
//     }
//     const item = Task.create({
//         user: req.body.user,
//         description: req.body.description,
//         completed: false
//     });
//     res.status(201).json(item);
// });

// //PUT N/A

// // DELETE: delete task belonging to the authenticated client, or belonging to the client of an authenticated provider
// router.delete('/:id', (req, res) => {
//     Task.delete(req.params.id);
//     console.log(`Deleted task \`${req.params.ID}\``);
//     res.status(204).end();
// });

// module.exports = router;
