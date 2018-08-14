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

//GET PROVIDERS list for signup
router.get('/providers', authController.authGetProviders);

module.exports = router;