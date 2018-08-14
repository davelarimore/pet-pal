const express = require('express');
const router = express.Router();

const tasksController = require('../controllers/tasksController');

////////////////////////////////
//AUTHENTICATED PROVIDERS ONLY
////////////////////////////////

//POST: add task to the client of an authenticated provider
router.post('/clients/tasks', tasksController.tasksClientPost);

// DELETE: delete task belonging to the client of an authenticated provider
router.delete('/clients/tasks/:id', tasksController.tasksClientDelete);

////////////////////////////////
//AUTHENTICATED CLIENTS ONLY
////////////////////////////////

//GET: get all tasks belonging to the authenticated client
// router.get('/tasks', tasksController.tasksGet);

//POST: add task to the authenticated client
router.post('/tasks', tasksController.tasksPost);

// DELETE: delete task belonging to the authenticated client
router.delete('/tasks/:id', tasksController.tasksDelete);

module.exports = router;