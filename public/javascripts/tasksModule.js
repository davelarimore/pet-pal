const tasks = (function () {

    ///////////////////////////////////////////
    //Display task
    ///////////////////////////////////////////
    function _generateTasksHTML(tasksList) {
        if (tasksList && tasksList.length > 0) {
            const items = tasksList.map((item, index) => _generateTaskHTML(item, index));
            return items.join('');
        } else {
            return `<p><span>No tasks</span></p>`
        }
    }
    function _generateTaskHTML(task) {
        return `
    <div class='boxedInfoItem'><a class='deleteTask js-delete-task' href='#' data-id='${task._id}'><img src='images/delete.svg' alt='Task'></a>
    <p>${task.description}</p></div>`;
    }
    
    ///////////////////////////////////////////
    //Add task
    ///////////////////////////////////////////
    function _displayAndHandleAddTaskForm(clientId) {
        const element = $(templates.addTaskForm);
        const cancelHref = auth.isProvider()
            ? `/#clientDetail/${clientId}`
            : `/#clientDashboard`
        element.find('#clientId').val(clientId);
        element.find('#js-add-task-cancel').attr('href', cancelHref);
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
                () => { _deleteTask(taskId, clientId) }
            )
        })
    }
    $(_handleDeleteTask)

    function _deleteTask(taskId, clientId) {
        let userData = '';
        api.deleteTask(taskId)
            .then(() => auth.updateCurrentUser())
            .then(() => {
                userData = auth.getCurrentUser().tasks;
                if (auth.isProvider()) {
                    // window.location.replace(`./#clientDetail/${clientId}`);
                    common.displayCompactSiteHeader();
                    common.displayClientDetail(clientId); 
                    common.displayAlertDialog('Task Deleted');
                } else {
                    // window.location.replace('./#clientDashboard');
                    common.displayCompactSiteHeader();
                    common.displayClientDashboard();
                    common.displayAlertDialog('Task Deleted');
                }
            }) 
    }

    return {
        generateTasksHTML: _generateTasksHTML,
        displayAndHandleAddTaskForm: _displayAndHandleAddTaskForm,
    };
})();
