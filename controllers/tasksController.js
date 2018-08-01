const { Tasks } = require('../models/tasksModel');

////////////////////////////////
//AUTHENTICATED PROVIDERS ONLY
////////////////////////////////

//GET: get all tasks belonging to the client of an authenticated provider
exports.tasks_client_get_list = (req, res) => {
    res.send('NOT IMPLEMENTED: Get all tasks belonging to my client');
};

//POST: add task to the client of an authenticated provider
exports.tasks_client_post = (req, res) => {
    res.send('NOT IMPLEMENTED: Add task to my client');
};

// DELETE: delete task belonging to the client of an authenticated provider
exports.tasks_client_delete = (req, res) => {
    res.send('NOT IMPLEMENTED: Delete task belonging to my client');
};

////////////////////////////////
//AUTHENTICATED CLIENTS ONLY
////////////////////////////////

//GET: get all tasks belonging to the authenticated client
exports.tasks_get = (req, res) => {
    res.send('NOT IMPLEMENTED: Get my tasks');
};

//POST: add task to the authenticated client
exports.tasks_post = (req, res) => {
    res.send('NOT IMPLEMENTED: Add task');
};

// DELETE: delete task belonging to the authenticated client
exports.tasks_delete = (req, res) => {
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
