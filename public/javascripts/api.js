///////////////////////////////////////////
//API
///////////////////////////////////////////

//AJAX helper
function ajaxCall(method, url, data) {
    return $.ajax({
        method: method,
        headers: {
            'Authorization': 'Bearer ' + window.localStorage.getItem('AUTH_TOKEN') || '',
            'Content-Type': 'application/json',
        },
        url: url,
        data: JSON.stringify(data) || "",
        // success: callback
    })
}

//Auth, public
function addUser(userData) {
    return ajaxCall('POST', 'auth/signup', userData);
}
function getProviders() {
    return ajaxCall('GET', 'auth/providers');
}
function loginUser(credentials) {
    return ajaxCall('POST', 'auth/login', credentials);
}

//Users
function getMe() {
    return ajaxCall('GET', 'api/users');
}
function updateUser(userData) {
    return ajaxCall('PUT', 'api/users', userData);
}
function deleteClient(clientId) {
    return ajaxCall('DELETE', `api/users/${clientId}`);
}

//Pets
function updatePet(petId, petData) {
    return ajaxCall('PUT', `api/pets/${petId}`, petData);
}
function addPet(petData) {
    return ajaxCall('POST', 'api/pets', petData);
}
function deletePet(petId) {
    return ajaxCall('DELETE', `api/pets/${petId}`);
}

//Visits
function addVisit(visitData) {
    return ajaxCall('POST', 'api/clients/visits', visitData);
}
function deleteVisit(visitId) {
    return ajaxCall('DELETE', `api/clients/visits/${visitId}`);
}

//Tasks
function addTask(taskData) {
    return ajaxCall('POST', 'api/tasks', taskData);
}
function deleteTask(taskId) {
    return ajaxCall('DELETE', `api/tasks/${taskId}`);
}