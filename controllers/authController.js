const jwt = require('jsonwebtoken');
const passport = require('passport');
const config = require('../config');

const createAuthToken = function (user) {
    return jwt.sign({ user }, config.JWT_SECRET, {
        subject: user.email,
        expiresIn: config.JWT_EXPIRY,
        algorithm: 'HS256'
    });
};

require('../models/petsModel');
require('../models/visitsModel');
require('../models/petsModel');
const Users = require('../models/usersModel');

const localAuth = passport.authenticate('local', { session: false });

// Authenticate
exports.authenticate = (req, res) => {
    console.log("HANDLING AUTH");
    const authToken = createAuthToken(req.user.serialize());
    const role = req.user.role;
    res.status(200).json({ authToken, role });
};

// Signup
exports.signup = (req, res) => {

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

    let {
        email,
        password,
        firstName = '',
        lastName = '',
        role,
        companyName,
        phone,
        addressString,
        vetInfo,
        entryNote,
        providerId
    } = req.body;
    // Username and password come in pre-trimmed, otherwise we throw an error
    // before this
    firstName = firstName.trim();
    lastName = lastName.trim();
    let createdUserId = '';
    let createdUserData = '';

    return Users.find({ email })
        .count()
        .then(count => {
            if (count > 0) {
                // There is an existing user with the same email
                return Promise.reject({
                    code: 422,
                    reason: 'ValidationError',
                    message: 'Email already taken',
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
                lastName,
                companyName,
                role,
                phone,
                addressString,
                vetInfo,
                entryNote,
                providerId
            });
        })
        .then(createdUser => {
            console.log(providerId);
            createdUserId = createdUser.id;
            createdUserData = createdUser;
            return Users.findOne({ _id: req.body.providerId });
        })
        .then((provider) => {
            console.log(provider);
            provider.clients.push(createdUserId);
            return provider.save();
        })
        .then(() => {
            return res.status(201).json(createdUserData.serialize());
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

// Refresh Token
exports.refresh = (req, res) => {
    res.send('NOT IMPLEMENTED: Refresh token');
//     const authToken = createAuthToken(req.user);
//     res.json({ authToken });
};


// GET providers for signup screen
exports.authGetProviders = (req, res) => {
    Users
        .find({ 'role': 'provider' })
        .then(users => {
            res.status(201).json(users);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' })
        });
}
