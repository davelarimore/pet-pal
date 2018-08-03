const Pets = require('../models/petsModel');

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

////////////////////////////////
//AUTHENTICATED PROVIDERS ONLY
////////////////////////////////

//GET: get all of an authenticated provider's client's pets
exports.petsClientGetAll = (req, res) => {
    res.send('NOT IMPLEMENTED: Get all pets belonging to my client');
};

// GET by ID: get one pet belonging to the client of an authenticated provider
exports.petsClientGetOne = (req, res) => {
    res.send('NOT IMPLEMENTED: Get one pet belonging to my client');
};

//POST: add a pet to the client of an authenticated provider
exports.petsClientPost = (req, res) => {
    res.send('NOT IMPLEMENTED: Add pet to my client');
};

//PUT: update pet belonging to the client of an authenticated provider
exports.petsClientUpdate = (req, res) => {
    res.send('NOT IMPLEMENTED: Update pet belonging to y client');
};

// DELETE: delete pet belonging to the client of an authenticated provider
exports.petsClientDelete = (req, res) => {
    res.send('NOT IMPLEMENTED: Delete pet belonging to my client');
};

////////////////////////////////
//AUTHENTICATED CLIENTS ONLY
////////////////////////////////

//GET: get all 'my' pets for authenticated client
exports.petsGetAll = (req, res) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        let authorization = req.headers.authorization.split(' ')[1],
            decoded;
        try {
            decoded = jwt.verify(authorization, JWT_SECRET);
        } catch (e) {
            res.status(401).send('unauthorized');
        }
        const userId = decoded.user.id;
        // Fetch the tasks by client id 
        Pets.find({ client: userId })
            .then(pets => {
                res.json(pets);
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ message: 'Internal server error' })
            })
    }
};

// GET by ID: get one pet belonging to the authenticated client
exports.petsGetOne = (req, res) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        let authorization = req.headers.authorization.split(' ')[1],
            decoded;
        try {
            decoded = jwt.verify(authorization, JWT_SECRET);
        } catch (e) {
            res.status(401).send('unauthorized');
        }
        // Fetch the pet by id 
        Pets.findOne({ _id: req.params.id })
            .then(pet => {
                res.json(pet);
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ message: 'Internal server error' })
            })
    }
};

//POST: add a pet to the authenticated client
exports.petsPost = (req, res) => {
    Pets
        .create({
            client: req.body.client,
            name: req.body.name,
            type: req.body.type,
            breed: req.body.breed,
            color: req.body.color,
            food: req.body.food,
        })
        .then(pet => res.status(201).json(pet))
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: "Internal server error" });
        });
}

//PUT: update pet belonging to the authenticated client
exports.petsUpdate = (req, res) => {
    res.send('NOT IMPLEMENTED: Update my pet');
};

// DELETE: delete pet belonging to the authenticated client
exports.petsDelete = (req, res) => {
    Pets
        .findByIdAndRemove(req.params.id)
        .then(() => {
            res.status(204).json({ message: 'Pet deleted' });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        });
}