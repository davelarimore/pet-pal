const express = require('express');
const router = express.Router();

const visitsController = require('../controllers/visitsController');

////////////////////////////////
//AUTHENTICATED PROVIDERS ONLY
////////////////////////////////

//GET upcoming visit (one) for my client
router.get('/clients/:id/visits', visitsController.visitsGetClientUpcoming);

//POST: add a visit for the client of an authenticated provider (client's can't add visits)
router.post('/clients/visits', visitsController.visitsPost);

// DELETE: delete a visit for the client of an authenticated provider (client's can't delete visits)
router.delete('/clients/visits/:id', visitsController.visitsDelete);

module.exports = router;