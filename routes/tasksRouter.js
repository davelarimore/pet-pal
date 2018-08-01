const express = require('express');
const router = express.Router();

const tasks_controller = require('../controllers/tasksController');

////////////////////////////////
//AUTHENTICATED PROVIDERS ONLY
////////////////////////////////

//GET: get all tasks belonging to the client of an authenticated provider
router.get('/tasks/my_client', tasks_controller.tasks_client_get_list);

//POST: add task to the client of an authenticated provider
router.post('/tasks/my_client', tasks_controller.tasks_client_post);

// DELETE: delete task belonging to the client of an authenticated provider
router.delete('/tasks/my_client/:id', tasks_controller.tasks_client_delete);

////////////////////////////////
//AUTHENTICATED CLIENTS ONLY
////////////////////////////////

//GET: get all tasks belonging to the authenticated client
router.get('/tasks', tasks_controller.tasks_get);

//POST: add task to the authenticated client
router.post('/tasks', tasks_controller.tasks_post);

// DELETE: delete task belonging to the authenticated client
router.delete('/tasks/:id', tasks_controller.tasks_delete);

module.exports = router;