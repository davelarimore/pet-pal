const express = require('express');
const router = express.Router();

const visits_controller = require('../controllers/visitsController');

////////////////////////////////
//AUTHENTICATED PROVIDERS ONLY
////////////////////////////////

//GET: get all visits belonging to an authenticated provider
router.get('/visits/:id', visits_controller.visits_get_list);

//GET upcoming visit for my client
router.get('/visits/my_client/:id/upcoming', visits_controller.visits_get_client_upcoming);

//POST: add a visit for the client of an authenticated provider (client's can't add visits)
router.post('/visits/my_client/:id', visits_controller.visits_post);

// DELETE: delete a visit for the client of an authenticated provider (client's can't delete visits)
router.delete('/visits/my_client/:id', visits_controller.visits_delete);

////////////////////////////////
// AUTHENTICATED CLIENTS ONLY
////////////////////////////////

//GET my upcoming visit 
router.get('/visits/my_upcoming', visits_controller.visits_get_my_upcoming);

module.exports = router;