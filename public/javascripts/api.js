///////////////////////////////////////////
//API
///////////////////////////////////////////
// let AUTH_TOKEN = window.localStorage.getItem('AUTH_TOKEN');

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

//Auth
function addUser(userData) {
    return new Promise((resolve, reject) => {
        resolve(ajaxCall('POST', 'auth/signup', userData))
    })
}

// function addUser(userData) {
//     return $.ajax({
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         url: 'auth/signup',
//         data: JSON.stringify(userData) || ""
//     })
// }

function getProviders() {
    return new Promise((resolve, reject) => {
        resolve(ajaxCall('GET', 'auth/providers'));
    })
}

function loginUser(credentials) {
    return new Promise((resolve, reject) => {
        resolve(ajaxCall('POST', 'auth/login', credentials));
    })
}

//Users
function getMe() {
    return new Promise((resolve, reject) => {
        resolve(ajaxCall('GET', 'api/users/me'));
    })
}

function getClient(userId) {
    return new Promise((resolve, reject) => {
        resolve(ajaxCall('GET', `api/users/clients/${userId}`));
    })
}

function updateMe(userData) {
    return new Promise((resolve, reject) => {
        resolve(ajaxCall('PUT', 'api/users/me', userData));
    })
}
function updateMyClient(userId, userData) {
    return new Promise((resolve, reject) => {
        resolve(ajaxCall('PUT', `api/users/clients/${userId}`, userData));
    })
}
// function getMyClients() {
//     return new Promise((resolve, reject) => {
//         resolve(ajaxCall('GET', 'api/users/clients'));
//     })
// }
function getClientByName(lastName) {
    return new Promise((resolve, reject) => {
        resolve(ajaxCall('GET', `api/users/clients/${lastName}`));
    })
}

//Pets
function getMyPet(petId) {
    return new Promise((resolve, reject) => {
        resolve(ajaxCall('GET', `api/pets/${petId}`))
    })
}
function getMyPets() {
    return new Promise((resolve, reject) => {
        resolve(ajaxCall('GET', 'api/pets'));
    })
}
function getClientsPet(petId) {
    return new Promise((resolve, reject) => {
        resolve(ajaxCall('GET', `api/clients/pets/${petId}`))
    })
}
function getClientsPets(clientId) {
    return new Promise((resolve, reject) => {
        resolve(ajaxCall('GET', `api/clients/${clientId}/pets`))
    })
}
function updateMyPet(petId, petData) {
    return new Promise((resolve, reject) => {
        resolve(ajaxCall('PUT', `api/pets/${petId}`, petData))
    })
}
function updateClientsPet(petId, petData) {
    return new Promise((resolve, reject) => {
        resolve(ajaxCall('PUT', `api/clients/pets/${petId}`, petData))
    })
}
function addMyPet(petData) {
    console.log("Making POST to add pet");
    console.log(petData);
    return new Promise((resolve, reject) => {
        resolve(ajaxCall('POST', 'api/pets', petData));
    })
}
function addClientPet(petData) {
    return new Promise((resolve, reject) => {
        resolve(ajaxCall('POST', 'api/clients/pets', petData))
    })
}
function deleteMyPet(petId) {
    return new Promise((resolve, reject) => {
        resolve(ajaxCall('DELETE', `api/pets/${petId}`))
    })
}
function deleteClientPet(petId) {
    return new Promise((resolve, reject) => {
        resolve(ajaxCall('DELETE', `api/pets/clients/${petId}`))
    })
}
//Visits
function getMyUpcomingVisit() {
    return new Promise((resolve, reject) => {
        resolve(ajaxCall('GET', 'api/visits/upcoming'));
    })
}
function getClientsUpcomingVisit(clientId) {
    return new Promise((resolve, reject) => {
        resolve(ajaxCall('GET', `api/clients/${clientId}/visits`))
    })
}
function getProviderUpcomingVisits() {
    return new Promise((resolve, reject) => {
        resolve(ajaxCall('GET', 'api/visits/me'))
    })
}
function addVisit(visitData) {
    return new Promise((resolve, reject) => {
        resolve(ajaxCall('POST', 'api/clients/visits', visitData))
    })
}
function deleteVisit(visitId) {
    return new Promise((resolve, reject) => {
        resolve(ajaxCall('DELETE', `api/clients/visits/${visitId}`))
    })
}
//Tasks
function getMyTasks() {
    return new Promise((resolve, reject) => {
        resolve(ajaxCall('GET', 'api/tasks'));
    })
}
function getClientsTasks() {
    return new Promise((resolve, reject) => {
        resolve(ajaxCall('GET', 'api/clients/:id/tasks'))
    })
}
function addMyTask(taskData) {
    console.log(taskData);
    return new Promise((resolve, reject) => {
        resolve(ajaxCall('POST', 'api/tasks', taskData))
    })
}
function addClientTask(taskData) {
    return new Promise((resolve, reject) => {
        resolve(ajaxCall('POST', 'api/clients/tasks', taskData))
    })
}
function deleteMyTask(taskId) {
    return new Promise((resolve, reject) => {
        resolve(ajaxCall('DELETE', `api/tasks/${taskId}`))
    })
}
function deleteClientTask(taskId) {
    return new Promise((resolve, reject) => {
        resolve(ajaxCall('DELETE', `api/clients/tasks/${taskId}`))
    })
}