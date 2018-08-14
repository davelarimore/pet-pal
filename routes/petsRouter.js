const express = require('express');
const router = express.Router();

const petsController = require('../controllers/petsController');

////////////////////////////////
//AUTHENTICATED PROVIDERS ONLY
////////////////////////////////

//POST: add a pet to the client of an authenticated provider
// router.post('/client/pets', petsController.petsClientPost);

//PUT: update pet belonging to the client of an authenticated provider
// router.put('/client/pets/:id', petsController.petsClientUpdate);

// DELETE: delete pet belonging to the client of an authenticated provider
// router.delete('/client/pets/:id', petsController.petsClientDelete);

////////////////////////////////
//AUTHENTICATED CLIENTS ONLY
////////////////////////////////

//POST: add a pet to the authenticated client
router.post('/pets', petsController.petsPost);

//PUT: update pet belonging to the authenticated client
router.put('/pets/:id', petsController.petsUpdate);

// DELETE: delete pet belonging to the authenticated client
router.delete('/pets/:id', petsController.petsDelete);

module.exports = router;