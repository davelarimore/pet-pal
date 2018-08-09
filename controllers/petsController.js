const Users = require('../models/usersModel');
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
        Pets.find({ clientId: req.user.id })
            .then(pets => {
                res.json(pets);
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ message: 'Internal server error' })
            })
};

// GET by ID: get one pet belonging to the authenticated client
exports.petsGetOne = (req, res) => {
    Pets.findOne({ _id: req.params.id })
        .then(pet => {
            res.json(pet);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' })
        })
};

//POST: add a pet to the authenticated client
exports.petsPost = (req, res) => {
    let createdPetId = '';
    Pets
        .create({
            clientId: req.body.clientId,
            name: req.body.name,
            type: req.body.type,
            breed: req.body.breed,
            color: req.body.color,
            food: req.body.food,
        })
        .then(pet => {
            createdPetId = pet.id;
            return Users.findOne({ _id: req.body.clientId })
        })
        .then((user) => {
            user.pets.push(createdPetId);
            return user.save();
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

//PUT: update pet belonging to the authenticated client
exports.petsUpdate = (req, res) => {
    //if user owns pet
    if (req.user.pets.includes(req.body._id)) {
        const requiredFields = ['name', 'type', 'breed', 'color', 'food'];
        for (let i = 0; i < requiredFields.length; i++) {
            const field = requiredFields[i];
            if (!(field in req.body)) {
                const message = `Missing \`${field}\` in request body`;
                console.error(message);
                return res.status(400).send(message);
            }
        }
        Pets.update({
            _id: req.body._id
        },
            {
                name: req.body.name,
                type: req.body.type,
                breed: req.body.breed,
                color: req.body.color,
                food: req.body.food
            })
            .then(response => {
                res.json(response);
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ message: 'Internal server error' })
            })
        }
    else {
        res.status(403).json({ error: 'User does not own pet', usersPets: req.user.pets, petToDelete: req.params.id })
    }
};

// DELETE: delete pet belonging to the authenticated client
exports.petsDelete = (req, res) => {
    if (req.user.pets.includes(req.params.id)) {
        Pets
            .findByIdAndRemove(req.params.id)
            .then(() => {
                return Users.findOne({ _id: req.user.id }).populate('pets')
            })
            .then((user) => {
                user.pets.pull(req.params.id);
                return user.save();
            })
            .then(() => {
                res.status(204).json({ message: 'Pet deleted' });
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ error: 'Internal server error' });
            });
    } else {
        res.status(403).json({ error: 'User does not own pet', usersPets: req.user.pets, petToDelete: req.params.id })
    }
}