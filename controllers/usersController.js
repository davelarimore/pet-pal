'use strict';

const Users = require('../models/usersModel');

////////////////////////////////
//AUTHENTICATED PROVIDERS ONLY
////////////////////////////////

// GET handled by getMe()

// POST new client accessible by authenticated provider only
exports.usersPostClient = (req, res) => {
    res.send('NOT IMPLEMENTED: Add a client');
};

//PUT MY CLIENT: update client of an authenticated provider 
exports.usersPutClient = (req, res) => {
    res.send('NOT IMPLEMENTED: Update a client');
};


////////////////////////////////
// ALL AUTHENTICATED USERS
////////////////////////////////

// GET users/me: - get my client object only, accessible by any authenticated user
exports.usersGetMe = (req, res) => {
    Users
        .findOne({ '_id': req.user._id })
        .populate('pets')
        // .populate('visits')
        .populate({ path: 'visits', populate: {path: 'client', model: 'Users'}, options: { sort: { startTime: -1 } } })
        .populate('tasks')
        .populate('provider')
        .populate({ path: 'clients', populate: { path: 'tasks', model: 'Tasks' } })
        .populate({ path: 'clients', populate: { path: 'pets', model: 'Pets' } })
        .populate({ path: 'clients', populate: { path: 'visits', model: 'Visits' }, options: { sort: { startTime: -1 } } })
        .then(user => {
            res.status(200).json(user.serialize());
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' })
        });
}

//PUT ME: update client or client of provider
exports.usersPutMe = (req, res) => {
    console.log(req.user);
    console.log(req.body);
    if (req.user._id === req.body._id || req.user.clients.includes(req.body._id)) {
        console.log('Updating User');
        console.log(req.body);
        const requiredFields = ['firstName', 'lastName', 'phone', 'addressString'];
        for (let i = 0; i < requiredFields.length; i++) {
            const field = requiredFields[i];
            if (!(field in req.body)) {
                const message = `Missing \`${field}\` in request body`;
                console.error(message);
                return res.status(400).send(message);
            }
        }
        console.log(`Updating user item \`${req.body._id}\``);
        Users.update({
            _id: req.body._id
            },
            {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phone: req.body.phone,
            addressString: req.body.addressString,
            entryNote: req.body.entryNote,
            vetInfo: req.body.vetInfo
            })
            .then(response => {
                res.json(response);
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ message: 'Internal server error' })
            })
    };
}

////////////////////////////////
// DEV ONLY
////////////////////////////////
exports.usersGetAll = (req, res) => {
    Users
        .find()
        .then(user => res.json(user))
        //.then(users => res.json(users.map(user => user.serialize())))
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Inernal server error' })
        });
};