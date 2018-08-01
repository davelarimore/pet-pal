const { Pets } = require('../models/petsModel');

//GET: get all of an authenticated provider's client's pets
exports.pets_client_get_all = (req, res) => {
    res.send('NOT IMPLEMENTED: Get all pets belonging to my client');
};

// GET by ID: get one pet belonging to the client of an authenticated provider
exports.pets_client_get_one = (req, res) => {
    res.send('NOT IMPLEMENTED: Get one pet belonging to my client');
};

//POST: add a pet to the client of an authenticated provider
exports.pets_client_post = (req, res) => {
    res.send('NOT IMPLEMENTED: Add pet to my client');
};

//PUT: update pet belonging to the client of an authenticated provider
exports.pets_client_update = (req, res) => {
    res.send('NOT IMPLEMENTED: Update pet belonging to y client');
};

// DELETE: delete pet belonging to the client of an authenticated provider
exports.pets_client_delete = (req, res) => {
    res.send('NOT IMPLEMENTED: Delete pet belonging to my client');
};

////////////////////////////////
//AUTHENTICATED CLIENTS ONLY
////////////////////////////////

//GET: get all 'my' pets for authenticated client
exports.pets_get_all = (req, res) => {
    res.send('NOT IMPLEMENTED: Get my pets');
};

// GET by ID: get one pet belonging to the authenticated client
exports.pets_get_one = (req, res) => {
    res.send('NOT IMPLEMENTED: Get one of my pets');
};

//POST: add a pet to the authenticated client
exports.pets_post = (req, res) => {
    res.send('NOT IMPLEMENTED: Add pet to my pets');
};

//PUT: update pet belonging to the authenticated client
exports.pets_update = (req, res) => {
    res.send('NOT IMPLEMENTED: Update my pet');
};

// DELETE: delete pet belonging to the authenticated client
exports.pets_delete = (req, res) => {
    res.send('NOT IMPLEMENTED: Delete my pet');
};



// //GET: get all 'my' pets for authenticated client, or all of an authenticated provider's client's pets
// router.get('/', (req, res) => {
//     Pet
//         .find()
//         .catch(err => {
//             console.error(err);
//             res.status(500).json({ message: 'Inernal server error' })
//         });
// });

// // GET by ID: get one pet belonging to the authenticated client, or belonging to the client of an authenticated provider
// router.get('/:id', (req, res) => {
//     Pet
//         .findById(req.params.id)
//         .then(post => res.json(post))
//         .catch(err => {
//             console.error(err);
//             res.status(500).json({ message: 'Internal server error' });
//         })
// })

// //POST: add a pet to the authenticated client, or to the client of an authenticated provider
// router.post('/', (req, res) => {
//     const requiredFields = ['user', 'name', 'type'];
//     for (let i = 0; i < requiredFields.length; i++) {
//         const field = requiredFields[i];
//         if (!(field in req.body)) {
//             const message = `Missing \`${field}\` in request body`;
//             console.error(message);
//             return res.status(400).send(message);
//         }
//     }
//     const item = Pet.create({
//         user: req.body.user,
//         name: req.body.name,
//         type: req.body.type,
//         breed: req.body.breed,
//         color: req.body.color,
//         food: req.body.food,
//     });
//     res.status(201).json(item);
// });

// //PUT: update pet belonging to the authenticated client, or belonging to the client of an authenticated provider
// router.put('/:id', (req, res) => {
//     const requiredFields = ['name', 'type'];
//     for (let i = 0; i < requiredFields.length; i++) {
//         const field = requiredFields[i];
//         if (!(field in req.body)) {
//             const message = `Missing \`${field}\` in request body`;
//             console.error(message);
//             return res.status(400).send(message);
//         }
//     }
//     if (req.params.id !== req.body.id) {
//         const message = `Request path id (${
//             req.params.id
//             }) and request body id ``(${req.body.id}) must match`;
//         console.error(message);
//         return res.status(400).send(message);
//     }
//     console.log(`Updating pet \`${req.params.id}\``);
//     const updatedItem = Pet.update({
//         name: req.body.name,
//         type: req.body.type,
//         breed: req.body.breed,
//         color: req.body.color,
//         food: req.body.food,
//     });
//     res.status(200).json(updatedItem);
// });

// // DELETE: delete pet belonging to the authenticated client, or belonging to the client of an authenticated provider
// router.delete('/:id', (req, res) => {
//     Pet.delete(req.params.id);
//     console.log(`Deleted pet \`${req.params.ID}\``);
//     res.status(204).end();
// });