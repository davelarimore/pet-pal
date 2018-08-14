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
        data: JSON.stringify(data) || ""
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
    return ajaxCall('GET', 'api/users/me');
}
function getClient(userId) {
    return ajaxCall('GET', `api/users/clients/${userId}`);
}
function updateMe(userData) {
    return ajaxCall('PUT', 'api/users/me', userData);
}
function updateMyClient(userId, userData) {
    return ajaxCall('PUT', `api/users/clients/${userId}`, userData);
}
function getClientByName(lastName) {
    return ajaxCall('GET', `api/users/clients/${lastName}`);
}

//Pets
// function getMyPet(petId) {
//     return ajaxCall('GET', `api/pets/${petId}`);
// }
// function getMyPets() {
//     return ajaxCall('GET', 'api/pets');
// }
// function getClientsPet(petId) {
//     return ajaxCall('GET', `api/clients/pets/${petId}`);
// }
// function getClientsPets(clientId) {
//     return ajaxCall('GET', `api/clients/${clientId}/pets`);
// }
function updatePet(petId, petData) {
    return ajaxCall('PUT', `api/pets/${petId}`, petData);
}
// function updateClientsPet(petId, petData) {
//     return ajaxCall('PUT', `api/clients/pets/${petId}`, petData);
// }
function addPet(petData) {
    return ajaxCall('POST', 'api/pets', petData);
}
// function addClientPet(petData) {
//     return ajaxCall('POST', 'api/clients/pets', petData);
// }
function deletePet(petId) {
    return ajaxCall('DELETE', `api/pets/${petId}`);
}
// function deleteClientPet(petId) {
//     return ajaxCall('DELETE', `api/pets/clients/${petId}`);
// }
//Visits
// function getMyUpcomingVisit() {
//     return ajaxCall('GET', 'api/visits/upcoming');
// }
// function getClientsUpcomingVisit(clientId) {
//     return ajaxCall('GET', `api/clients/${clientId}/visits`);
// }
// function getProviderUpcomingVisits() {
//     return ajaxCall('GET', 'api/visits/me');
// }
function addVisit(visitData) {
    return ajaxCall('POST', 'api/clients/visits', visitData);
}
function deleteVisit(visitId) {
    return ajaxCall('DELETE', `api/clients/visits/${visitId}`);
}
//Tasks
// function getMyTasks() {
//     return ajaxCall('GET', 'api/tasks');
// }
// function getClientsTasks() {
//     return ajaxCall('GET', 'api/clients/:id/tasks');
// }
function addTask(taskData) {
    return ajaxCall('POST', 'api/tasks', taskData);
}
// function addClientTask(taskData) {
//     return ajaxCall('POST', 'api/clients/tasks', taskData);
// }
function deleteTask(taskId) {
    return ajaxCall('DELETE', `api/tasks/${taskId}`);
}
// function deleteClientTask(taskId) {
//     return ajaxCall('DELETE', `api/clients/tasks/${taskId}`);
// }