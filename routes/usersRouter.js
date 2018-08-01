const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const users_controller = require('../controllers/usersController');

////////////////////////////////
//AUTHENTICATED PROVIDERS ONLY
////////////////////////////////

// GET: all my clients, authenticated providers only
router.get('/users/my_clients', users_controller.users_get_client_list);

// GET one of my clients by ID, accessible by authenticated provider only
router.get('/users/my_clients/:id', users_controller.users_get_client);

// POST new client accessible by authenticated provider only
router.post('/users/my_clients', users_controller.users_post_client);

//PUT MY CLIENT: update client of an authenticated provider 
router.put('/users/my_clients/:id', users_controller.users_put_client);

////////////////////////////////
// ALL AUTHENTICATED USERS
////////////////////////////////

// GET users/me: - get my client object only, accessible by any authenticated user
router.get('/users/me', users_controller.users_get_me);

//POST: create a user via the signup forms
router.post('/users', jsonParser, users_controller.users_post);

//PUT ME: update authenticated user (update me)
router.put('/users/me', users_controller.users_put_me);

////////////////////////////////
// DEV TESTING ONLY
////////////////////////////////
router.get('/users', users_controller.users_get_all);

module.exports = router;
