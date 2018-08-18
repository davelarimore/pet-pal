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
    function _handleAddTaskSubmit() {
        $('#js-main').on('submit', '#js-add-task-form', event => {
            event.preventDefault();
            const taskData = {
                clientId: $(event.currentTarget).find('#clientId').val(),
                description: $(event.currentTarget).find('#taskDescription').val(),
            };
            _addTaskAndDisplayAlertDialog(taskData);
        });
    }
    $(_handleAddTaskSubmit)
    function _addTaskAndDisplayAlertDialog(taskData) {
        api.addTask(taskData)
        .then(auth.updateCurrentUser())
        .then(() => {
            if (auth.isProvider()) {
                window.location.replace(`./#clientDetail/${taskData.clientId}`);
            } else {
                window.location.replace(`./#clientDashboard`);
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
            if (confirm('Delete task?')) {
                api.deleteTask(taskId)
                .then(() => auth.updateCurrentUser())
                .then(() => users.displayAlertDialog('Task Deleted'))
                .then(() => {
                    if (auth.isProvider()) {
                        users.displayClientDetail(clientId);
                    } else {
                        users.displayClientDashboard();
                    }
                })  
            } else {
                alert('Action Cancelled');
            }
        })
    }
    $(_handleDeleteTask)

    return {
        generateTasksHTML: _generateTasksHTML,
        displayAndHandleAddTaskForm: _displayAndHandleAddTaskForm,
    };
})();
