const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const usersController = require('../controllers/usersController');

// GET users/me: - get my client object only, accessible by any authenticated user
router.get('/users/me', usersController.usersGetMe);

//PUT ME: update authenticated user (update me)
router.put('/users/me', usersController.usersPutMe);

////////////////////////////////
// DEV TESTING ONLY
////////////////////////////////
router.get('/users', usersController.usersGetAll);

module.exports = router;
