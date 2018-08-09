const express = require('express');
const router = express.Router();

const petsController = require('../controllers/petsController');

////////////////////////////////
//AUTHENTICATED PROVIDERS ONLY
////////////////////////////////

//GET: get all of an authenticated provider's client's pets
router.get('/client/:id/pets', petsController.petsClientGetAll);

// GET by ID: get one pet belonging to the client of an authenticated provider
router.get('/client/pets/:id', petsController.petsClientGetOne);

//POST: add a pet to the client of an authenticated provider
router.post('/client/pets', petsController.petsClientPost);

//PUT: update pet belonging to the client of an authenticated provider
router.put('/client/pets/:id', petsController.petsClientUpdate);

// DELETE: delete pet belonging to the client of an authenticated provider
router.delete('/client/pets/:id', petsController.petsClientDelete);

////////////////////////////////
//AUTHENTICATED CLIENTS ONLY
////////////////////////////////

//GET: get all 'my' pets for authenticated client
router.get('/pets', petsController.petsGetAll);

// GET by ID: get one pet belonging to the authenticated client
router.get('/pets/:id', petsController.petsGetOne);

//POST: add a pet to the authenticated client
router.post('/pets', petsController.petsPost);

//PUT: update pet belonging to the authenticated client
router.put('/pets/:id', petsController.petsUpdate);

// DELETE: delete pet belonging to the authenticated client
router.delete('/pets/:id', petsController.petsDelete);

module.exports = router;