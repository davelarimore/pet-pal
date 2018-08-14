const Pets = require('../models/petsModel');

//GET is handled by getMe()

//POST: add a pet to client or client of provider
exports.petsPost = (req, res) => {
    if (req.user._id === req.body.clientId || req.user.clients.includes(req.body.clientId)) {
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
                res.status(201).json(pet);
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ message: "Internal server error" });
            });
    }
}

//PUT: update pet belonging to client or client of provider
exports.petsUpdate = (req, res) => {
    if (req.user.pets.includes(req.body._id) || req.user.clients.filter(pets => pets.includes(req.body._id))) {
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
    if (req.user.pets.includes(req.params.id) || req.user.clients.filter(pets => pets.includes(req.params.id))) {
        Pets
            .findByIdAndRemove(req.params.id)
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