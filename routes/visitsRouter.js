const express = require('express');
const router = express.Router();

const visitsController = require('../controllers/visitsController');

////////////////////////////////
//AUTHENTICATED PROVIDERS ONLY
////////////////////////////////

//GET: get all visits belonging to an authenticated provider
router.get('/visits/me', visitsController.visitsGetList);

//GET upcoming visit (one) for my client
router.get('/my_clients/:id/visits', visitsController.visitsGetClientUpcoming);

//POST: add a visit for the client of an authenticated provider (client's can't add visits)
router.post('/my_clients/visits', visitsController.visitsPost);

// DELETE: delete a visit for the client of an authenticated provider (client's can't delete visits)
router.delete('/my_clients/visits/:id', visitsController.visitsDelete);

////////////////////////////////
// AUTHENTICATED CLIENTS ONLY
////////////////////////////////

//GET my upcoming visit 
router.get('/visits/my_upcoming', visitsController.visitsGetMyUpcoming);

module.exports = router;