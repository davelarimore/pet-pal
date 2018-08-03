///////////////////////////////////////////
//API
///////////////////////////////////////////
const AUTH_TOKEN = window.localStorage.getItem('AUTH_TOKEN');
const authHeaders = {
    'Authorization': 'Bearer ' + AUTH_TOKEN,
    'Content-Type': 'application/json',
}

//Users
function getMe() {
    return new Promise((resolve, reject) => {
        userData = $.ajax({
            method: 'GET',
            headers: authHeaders,
            url: `api/users/me`,
        })
        resolve(userData);
    })
}
function getMyClient(userID) {
    return new Promise((resolve, reject) => {
        userData = $.ajax({
            method: 'GET',
            headers: authHeaders,
            url: `api/users/my_clients/${userID}`,
        })
        resolve(userData);
    })
}
function getProviders() {
    return new Promise((resolve, reject) => {
        userData = $.ajax({
            method: 'GET',
            headers: authHeaders,
            url: `api/users/providers`,
        })
        resolve(providersData);
    })
}
function updateMe(userData) {
    return new Promise((resolve, reject) => {
        $.ajax({
            method: 'POST',
            headers: authHeaders,
            url: 'api/users/me',
            data: userData,
        });
        resolve(userData);
    })
}
function updateMyClient(userID, userData) {
    return new Promise((resolve, reject) => {
        $.ajax({
            method: 'POST',
            headers: authHeaders,
            url: `api/users/my_clients/${userID}`,
            data: userData,
        });
        resolve(userData);
    })
}
function getMyClients() {
    return new Promise((resolve, reject) => {
        clientsData = $.ajax({
            method: 'GET',
            headers: authHeaders,
            url: `api/users/my_clients`,
        })
        resolve(clientsData);
    })
}
function getClientByName(lastName) {
    return new Promise((resolve, reject) => {
        clientData = $.ajax({
            method: 'GET',
            headers: authHeaders,
            url: `api/users/my_clients/${lastName}`,
        })
        resolve(clientData);
    })
}
function addUser(userData) {
    return new Promise((resolve, reject) => {
        $.ajax({
            method: 'POST',
            headers: authHeaders,
            url: 'api/users',
            data: userData,
        });
        resolve(userData);
    })
}

//Pets
function getMyPet(petID) {
    return new Promise((resolve, reject) => {
        petData = $.ajax({
            method: 'GET',
            headers: authHeaders,
            url: `api/pets/${petID}`,
        })
        resolve(petData);
    })
}
function getMyPets() {
    return new Promise((resolve, reject) => {
        petData = $.ajax({
            method: 'GET',
            headers: authHeaders,
            url: `api/pets`,
        })
        resolve(petData);
    })
}
function getClientsPet(petID) {
    return new Promise((resolve, reject) => {
        petData = $.ajax({
            method: 'GET',
            headers: authHeaders,
            url: `api/my_clients/pets/${petID}`,
        })
        resolve(petData);
    })
}
function getClientsPets(clientID) {
    return new Promise((resolve, reject) => {
        petData = $.ajax({
            method: 'GET',
            headers: authHeaders,
            url: `api/my_clients/${clientID}/pets`,
        })
        resolve(petData);
    })
}
function updateMyPet(petID, petData) {
    return new Promise((resolve, reject) => {
        $.ajax({
            method: 'PUT',
            headers: authHeaders,
            url: `api/pets/${petID}`,
            data: petData,
        });
        resolve(petData);
    })
}
function updateClientsPet(petID, petData) {
    return new Promise((resolve, reject) => {
        $.ajax({
            method: 'PUT',
            headers: authHeaders,
            url: `api/my_clients/pets/${petID}`,
            data: petData,
        });
        resolve(petData);
    })
}
function addMyPet(petData) {
    return new Promise((resolve, reject) => {
        $.ajax({
            method: 'POST',
            headers: authHeaders,
            url: 'api/pets',
            data: petData,
        });
        resolve(petData);
    })
}
function addClientPet(petData) {
    return new Promise((resolve, reject) => {
        $.ajax({
            method: 'POST',
            headers: authHeaders,
            url: 'api/my_clients/pets',
            data: petData,
        });
        resolve(petData);
    })
}
function deleteMyPet(petID) {
    return new Promise((resolve, reject) => {
        $.ajax({
            method: 'DELETE',
            headers: authHeaders,
            url: `api/pets/${petID}`,
        });
        resolve(response);
    })
}
function deleteClientPet(petID) {
    return new Promise((resolve, reject) => {
        $.ajax({
            method: 'DELETE',
            headers: authHeaders,
            url: `api/pets/my_clients/${petID}`,
        });
        resolve(response);
    })
}
//Visits
function getMyUpcomingVisit() {
    return new Promise((resolve, reject) => {
        visitData = $.ajax({
            method: 'GET',
            headers: authHeaders,
            url: `api/visits/my_upcoming`,
        })
        resolve(visitData);
    })
}
function getClientsUpcomingVisit(clientID) {
    return new Promise((resolve, reject) => {
        visitData = $.ajax({
            method: 'GET',
            headers: authHeaders,
            url: `api/my_clients/${clientID}/visits`,
        })
        resolve(visitData);
    })
}
function getProviderUpcomingVisits() {
    return new Promise((resolve, reject) => {
        $.ajax({
            method: 'GET',
            headers: authHeaders,
            url: `api/visits/me`,
        });
        resolve(visitsData);
    })
}
function addVisit(visitData) {
    return new Promise((resolve, reject) => {
        $.ajax({
            method: 'POST',
            headers: authHeaders,
            url: `api/my_clients/visits`,
            data: visitData,
        });
        resolve(visitData);
    })
}
function deleteVisit(visitID) {
    return new Promise((resolve, reject) => {
        $.ajax({
            method: 'DELETE',
            headers: authHeaders,
            url: `api/my_clients/visits/${visitID}`,
        });
        resolve(response);
    })
}
//Tasks
function getMyTasks() {
    return new Promise((resolve, reject) => {
        tasksData = $.ajax({
            method: 'GET',
            headers: authHeaders,
            url: `api/tasks`,
        })
        resolve(tasksData);
    })
}
function getClientsTasks() {
    return new Promise((resolve, reject) => {
        tasksData = $.ajax({
            method: 'GET',
            headers: authHeaders,
            url: `api/my_clients/:id/tasks`,
        })
        resolve(tasksData);
    })
}
function addMyTask(taskData) {
    return new Promise((resolve, reject) => {
        $.ajax({
            method: 'POST',
            headers: authHeaders,
            url: `api/tasks`,
            data: taskData,
        });
        resolve(taskData);
    })
}
function addClientTask(taskData) {
    return new Promise((resolve, reject) => {
        $.ajax({
            method: 'POST',
            headers: authHeaders,
            url: `api/my_clients/tasks`,
            data: taskData,
        });
        resolve(taskData);
    })
}
function deleteMyTask(taskID) {
    return new Promise((resolve, reject) => {
        $.ajax({
            method: 'DELETE',
            headers: authHeaders,
            url: `api/tasks/${taskID}`,
        });
        resolve(response);
    })
}
function deleteClientTask(taskID) {
    return new Promise((resolve, reject) => {
        $.ajax({
            method: 'DELETE',
            headers: authHeaders,
            url: `api/my_clients/tasks/${taskID}`,
        });
        resolve(response);
    })
}