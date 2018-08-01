const express = require('express');
const router = express.Router();

const pets_controller = require('../controllers/petsController');

////////////////////////////////
//AUTHENTICATED PROVIDERS ONLY
////////////////////////////////

//GET: get all of an authenticated provider's client's pets
router.get('/pets/my_client', pets_controller.pets_client_get_all);

// GET by ID: get one pet belonging to the client of an authenticated provider
router.get('/pets/my_client/:id', pets_controller.pets_client_get_one);

//POST: add a pet to the client of an authenticated provider
router.post('/pets/my_client', pets_controller.pets_client_post);

//PUT: update pet belonging to the client of an authenticated provider
router.put('/pets/my_client/:id', pets_controller.pets_client_update);

// DELETE: delete pet belonging to the client of an authenticated provider
router.delete('/pets/my_client/:id', pets_controller.pets_client_delete);

////////////////////////////////
//AUTHENTICATED CLIENTS ONLY
////////////////////////////////

//GET: get all 'my' pets for authenticated client
router.get('/pets', pets_controller.pets_get_all);

// GET by ID: get one pet belonging to the authenticated client
router.get('/pets/:id', pets_controller.pets_get_one);

//POST: add a pet to the authenticated client
router.post('/pets', pets_controller.pets_post);

//PUT: update pet belonging to the authenticated client
router.put('/pets/:id', pets_controller.pets_update);

// DELETE: delete pet belonging to the authenticated client
router.delete('/pets/:id', pets_controller.pets_delete);

module.exports = router;