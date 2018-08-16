const tasks = (function () {
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
        addTask(taskData)
        .then(auth.updateCurrentUser())
        .then(() => {
            return auth.isProvider()
                ? window.location.href = './#providerDashboard'
                : window.location.href = './#clientDashboard'
        })
        .catch(() => console.error('Error adding task'));
    }

    function _displayDeleteTaskConfirmation(taskId) {
        if (confirm('Delete task?')) {
            deleteTask(taskId)
            .then(displayAlertDialog('Task Deleted'));;
        } else {
            alert('Action Cancelled');
        }
    }


    return {
        displayAndHandleAddTaskForm: _displayAndHandleAddTaskForm,
        displayDeleteTaskConfirmation: _displayDeleteTaskConfirmation
    };
})();
