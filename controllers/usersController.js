'use strict';

const Users = require('../models/usersModel');

////////////////////////////////
//AUTHENTICATED PROVIDERS ONLY
////////////////////////////////

// GET: all my clients, authenticated providers only
exports.usersGetClientList = (req, res) => {
    Users
        .find({ 'provider': 101 })
        .then(clients => {
            res.json(clients)
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' })
    });
}

// GET one of my clients by ID, accessible by authenticated provider only
exports.usersGetClient = (req, res) => {
    Users
        .findOne({ '_id': req.params.id })
        .then(client => {
            res.json(client)
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' })
    });
}

// GET one of my clients by ID, accessible by authenticated provider only
exports.usersGetClientByName = (req, res) => {
    Users
        .find({ 'lastName': Doe })
        .then(client => {
            res.json(client)
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' })
    });
}

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
    // console.log('Getting user: ' + req.user.id);
    Users
        .findOne({ '_id': req.user.id })
        .populate('pets')
        // .populate('visits')
        .populate({ path: 'visits', options: { sort: { startTime: -1 } } })
        .populate('tasks')
        .populate('provider')
        .populate('clients')
        .then(user => {
            res.status(200).json(user.serialize());
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' })
        });
}

//PUT ME: update authenticated user (update me)
exports.usersPutMe = (req, res) => {
    console.log('Updating User');
    console.log(req.body);
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'addressString', 'vetInfo'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }
    console.log(`Updating user item \`${req.body.id}\``);
    Users.update({
        _id: req.user.id
        },
        {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        addressString: req.body.addressString,
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

//POST: create a user via the signup forms
exports.usersPost = (req, res) => {
    res.send('NOT IMPLEMENTED: Users post');
};

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