const tasks = (function () {

    ///////////////////////////////////////////
    //Display task
    ///////////////////////////////////////////
    function _generateTasksHTML(tasksList) {
        const items = tasksList.map((item, index) => _generateTaskHTML(item, index));
        return items.join('');
    }
    function _generateTaskHTML(task) {
    //     return `
    // <div class='boxedInfoItem'><a href='#deleteTask/${task._id}'><img src='images/delete.svg' alt='Task'></a>
    // <p>${task.description}</p></div>`;
        return `
    <div class='boxedInfoItem'><a class='js-delete-task' href='#' data-id='${task._id}'><img src='images/delete.svg' alt='Task'></a>
    <p>${task.description}</p></div>`;
    }
    
    ///////////////////////////////////////////
    //Add task
    ///////////////////////////////////////////
    function _displayAndHandleAddTaskForm(clientId) {
        const element = $(templates.addTaskForm);
        element.find('#clientId').val(clientId);
        $('#js-main').html(element);
    }
    function _handleAddTask() {
        $('#js-main').on('submit', '#js-add-task-form', event => {
            event.preventDefault();
            const taskData = {
                clientId: $(event.currentTarget).find('#clientId').val(),
                description: $(event.currentTarget).find('#taskDescription').val(),
            };
            _addTask(taskData);
        });
    }
    $(_handleAddTask)
    function _addTask(taskData) {
        api.addTask(taskData)
        // .then(auth.updateCurrentUser())
        .then(() => {
            if (auth.isProvider()) {
                window.location.replace(`./#clientDetail/${taskData.clientId}`);
                common.displayAlertDialog('Task added')
            } else {
                window.location.replace('./#clientDashboard');
                common.displayAlertDialog('Task added')
            }
        })
        .catch(() => console.error('Error adding task'));
    }

    ///////////////////////////////////////////
    //Delete task
    ///////////////////////////////////////////
    function _handleDeleteTask() {
        $('#js-main').on('click', '.js-delete-task', event => {
            event.preventDefault();
            const taskId = $(event.currentTarget).data('id');
            const clientId = $('#js-main').find('.clientHeader').data('id');
            common.displayConfirmDialog('Delete task?',
                () => { _deleteTask(taskId, clientId) },
            )
        })
    }
    $(_handleDeleteTask)

    function _deleteTask(taskId, clientId) {
        let userData = '';
        api.deleteTask(taskId)
            .then(auth.updateCurrentUser())
            .then(() => {
                userData = auth.getCurrentUser().tasks;
                if (auth.isProvider()) {
                    window.location.replace(`./#clientDetail/${clientId}`);
                    common.displayAlertDialog('Task Deleted');
                } else {
                    window.location.replace('./#clientDashboard');
                    common.displayAlertDialog('Task Deleted');
                }
            }) 
    }

    return {
        generateTasksHTML: _generateTasksHTML,
        displayAndHandleAddTaskForm: _displayAndHandleAddTaskForm,
    };
})();
