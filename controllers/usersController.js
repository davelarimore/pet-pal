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
        .find({ '_id': 201 })
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
    res.send('NOT IMPLEMENTED: Get my user data');
};

//PUT ME: update authenticated user (update me)
exports.usersPutMe = (req, res) => {
    res.send('NOT IMPLEMENTED: Update my user data');
};

////////////////////////////////
// PUBLIC
////////////////////////////////

exports.usersGetProviders = (req, res) => {
    res.send('NOT IMPLEMENTED: Get all providers');
};

//POST: create a user via the signup forms
exports.usersPost = (req, res) => {

    const requiredFields = ['email', 'password'];
    const missingField = requiredFields.find(field => !(field in req.body));

    if (missingField) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Missing field',
            location: missingField
        });
    }

    const stringFields = ['email', 'password', 'firstName', 'lastName'];
    const nonStringField = stringFields.find(
        field => field in req.body && typeof req.body[field] !== 'string'
    );

    if (nonStringField) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Incorrect field type: expected string',
            location: nonStringField
        });
    }

    // If the email and password aren't trimmed we give an error.  Users might
    // expect that these will work without trimming (i.e. they want the password
    // "foobar ", including the space at the end).  We need to reject such values
    // explicitly so the users know what's happening, rather than silently
    // trimming them and expecting the user to understand.
    // We'll silently trim the other fields, because they aren't credentials used
    // to log in, so it's less of a problem.
    const explicityTrimmedFields = ['email', 'password'];
    const nonTrimmedField = explicityTrimmedFields.find(
        field => req.body[field].trim() !== req.body[field]
    );

    if (nonTrimmedField) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Cannot start or end with whitespace',
            location: nonTrimmedField
        });
    }

    const sizedFields = {
        email: {
            min: 1
        },
        password: {
            min: 10,
            // bcrypt truncates after 72 characters, so let's not give the illusion
            // of security by storing extra (unused) info
            max: 72
        }
    };
    const tooSmallField = Object.keys(sizedFields).find(
        field =>
            'min' in sizedFields[field] &&
            req.body[field].trim().length < sizedFields[field].min
    );
    const tooLargeField = Object.keys(sizedFields).find(
        field =>
            'max' in sizedFields[field] &&
            req.body[field].trim().length > sizedFields[field].max
    );

    if (tooSmallField || tooLargeField) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: tooSmallField
                ? `Must be at least ${sizedFields[tooSmallField]
                    .min} characters long`
                : `Must be at most ${sizedFields[tooLargeField]
                    .max} characters long`,
            location: tooSmallField || tooLargeField
        });
    }

    let { email, password, firstName = '', lastName = '' } = req.body;
    // Username and password come in pre-trimmed, otherwise we throw an error
    // before this
    firstName = firstName.trim();
    lastName = lastName.trim();

    return Users.find({ email })
        .count()
        .then(count => {
            if (count > 0) {
                // There is an existing user with the same email
                return Promise.reject({
                    code: 422,
                    reason: 'ValidationError',
                    message: 'Username already taken',
                    location: 'email'
                });
            }
            // If there is no existing user, hash the password
            return Users.hashPassword(password);
        })
        .then(hash => {
            return Users.create({
                email,
                password: hash,
                firstName,
                lastName
            });
        })
        .then(user => {
            return res.status(201).json(user.serialize());
        })
        .catch(err => {
            console.log(err);
            // Forward validation errors on to the client, otherwise give a 500
            // error because something unexpected has happened
            if (err.reason === 'ValidationError') {
                return res.status(err.code).json(err);
            }
            res.status(500).json({ code: 500, message: 'Internal server error' });
        });
};

// Never expose all your users like below in a prod application
// we're just doing this so we have a quick way to see
// if we're creating users. keep in mind, you can also
// verify this in the Mongo shell.
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




// //PUT: update authenticated user (update me), SEPARATE ROUTE: or update client of an authenticated provider 
// router.put('/:id', (req, res) => {
//     //replace with middleware for required fields validation
//     const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'provider'];
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
//     console.log(`Updating user \`${req.params.id}\``);
//     const updatedItem = User.update({
//         firstName: req.body.firstName,
//         lastName: req.body.lastName,
//         companyName: req.body.companyName,
//         email: req.body.email,
//         phone: req.body.lastName,
//         vetInfo: req.body.vetInfo,
//         address: {
//             addressString: req.body.phone,
//             entryNote: req.body.entryNote,
//         },
//     });
//     res.status(200).json(updatedItem);
// });
