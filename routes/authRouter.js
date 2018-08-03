const express = require('express');
const passport = require('passport');
const router = express.Router();

const authController = require('../controllers/authController');

const localAuth = passport.authenticate('local', { session: false });

// login: authenticate a user
router.post('/login', localAuth, authController.authenticate);

// signup: add a new user
router.post('/signup', authController.signup);

// refresh token: refresh the token of an authenticated user
router.get('/refresh', authController.refresh);

module.exports = router;

//from lesson

// 'use strict';
// const express = require('express');
// const passport = require('passport');
// const bodyParser = require('body-parser');
// const jwt = require('jsonwebtoken');

// const config = require('../config');
// const router = express.Router();

// const createAuthToken = function (user) {
//     return jwt.sign({ user }, config.JWT_SECRET, {
//         subject: user.username,
//         expiresIn: config.JWT_EXPIRY,
//         algorithm: 'HS256'
//     });
// };

// const localAuth = passport.authenticate('local', { session: false });
// router.use(bodyParser.json());
// // The user provides a username and password to login
// router.post('/login', localAuth, (req, res) => {
//     const authToken = createAuthToken(req.user.serialize());
//     res.json({ authToken });
// });

// const jwtAuth = passport.authenticate('jwt', { session: false });

// // The user exchanges a valid JWT for a new one with a later expiration
// router.post('/refresh', jwtAuth, (req, res) => {
//     const authToken = createAuthToken(req.user);
//     res.json({ authToken });
// });

// module.exports = { router };
