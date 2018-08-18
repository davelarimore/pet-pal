const api = (function () {

    ///////////////////////////////////////////
    //AJAX helper
    ///////////////////////////////////////////
    function _ajaxCall(method, url, data) {
        return $.ajax({
            method: method,
            headers: {
                'Authorization': 'Bearer ' + auth.getToken() || '',
                'Content-Type': 'application/json',
            },
            url: url,
            data: JSON.stringify(data) || "",
        })
    }
    ///////////////////////////////////////////
    //Auth, public
    ///////////////////////////////////////////
    function _addUser(userData) {
        return _ajaxCall('POST', 'auth/signup', userData);
    }
    function _getProviders() {
        return _ajaxCall('GET', 'auth/providers');
    }
    // function _loginUser(credentials) {
    //     return _ajaxCall('POST', 'auth/login', credentials);
    // }

    ///////////////////////////////////////////
    //Users
    ///////////////////////////////////////////
    function _getMe() {
        return _ajaxCall('GET', 'api/users');
    }
    function _updateUser(userData) {
        return _ajaxCall('PUT', 'api/users', userData);
    }
    function _deleteClient(clientId) {
        return _ajaxCall('DELETE', `api/users/${clientId}`);
    }

    ///////////////////////////////////////////
    //Pets
    ///////////////////////////////////////////
    function _updatePet(petId, petData) {
        return _ajaxCall('PUT', `api/pets/${petId}`, petData);
    }
    function _addPet(petData) {
        return _ajaxCall('POST', 'api/pets', petData);
    }
    function _deletePet(petId) {
        return _ajaxCall('DELETE', `api/pets/${petId}`);
    }

    ///////////////////////////////////////////
    //Visits
    ///////////////////////////////////////////
    function _addVisit(visitData) {
        return _ajaxCall('POST', 'api/clients/visits', visitData);
    }
    function _deleteVisit(visitId) {
        return _ajaxCall('DELETE', `api/clients/visits/${visitId}`);
    }
    function _deleteClientsVisits(clientId) {
        return _ajaxCall('DELETE', `api/clients/${clientId}/visits`);
    }

    ///////////////////////////////////////////
    //Tasks
    ///////////////////////////////////////////
    function _addTask(taskData) {
        return _ajaxCall('POST', 'api/tasks', taskData);
    }
    function _deleteTask(taskId) {
        return _ajaxCall('DELETE', `api/tasks/${taskId}`);
    }

    return {
        addUser: _addUser,
        getProviders: _getProviders,
        // loginUser: _loginUser,
        getMe: _getMe,
        updateUser: _updateUser,
        deleteClient: _deleteClient,
        updatePet: _updatePet,
        addPet: _addPet,
        deletePet: _deletePet,
        addVisit: _addVisit,
        deleteVisit: _deleteVisit,
        deleteClientsVisits: _deleteClientsVisits,
        addTask: _addTask,
        deleteTask: _deleteTask
        }
})();