//Date Formatter

function formatDate(rawDate) {
    const date = new Date(rawDate);
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    return (monthNames[date.getMonth() + 1]) +
        ' ' + date.getDate() +
        ' at ' + date.toTimeString().substr(0, 5);
}

function logout() {
    window.localStorage.removeItem('AUTH_TOKEN');
    console.log('Stored token is now: ', window.localStorage.getItem('AUTH_TOKEN'))
}

///////////////////////////////////////////
//Update Provider Info Screen
///////////////////////////////////////////
// function getProviderUserAndDisplayUpdateForm() {
//     getMe()
//     .then(displayProviderProfileUpdateForm)
//     .catch (() => console.log('not found'));
// }
// function displayProviderProfileUpdateForm(providerData) {
//     //pre-fill form
//     const element = $(providerSignupFormTemplate);
//     element.find('#js-provider-signup-form').attr('id', 'js-provider-update-form');
//     element.find('h2').text('Update Provider Profile');
//     element.find('#companyName').val(providerData.companyName);
//     element.find('#firstName').val(providerData.firstName);
//     element.find('#lastName').val(providerData.lastName);
//     element.find('#email').val(providerData.email);
//     element.find('#phone').val(providerData.phone);
//     element.find('#streetAddress').val(providerData.address.addressString);
//     //remove password fields from template
//     element.find('label[for=password], input#password').remove();
//     element.find('label[for=confirmPassword], input#confirmPassword').remove();
//     $('#js-main').html(element);
// }
// function handleProviderProfileUpdateSubmit() {
//     console.log('Handling user update');
//     $('#js-main').on('submit', '#js-provider-update-form', event => {
//         event.preventDefault();
//         const userData = {
//             companyName: $(event.currentTarget).find('#companyName').val(),
//             firstName: $(event.currentTarget).find('#firstName').val(),
//             lastName: $(event.currentTarget).find('#lastName').val(),
//             email: $(event.currentTarget).find('#email').val(),
//             address: {
//                 addressString: $(event.currentTarget).find('#streetAddress').val(),
//             }
//         };
//         updateMeAndDisplayAlertDialog(userData);
//     }); 
// }
// $(handleClientProfileUpdateSubmit);
// function updateMeAndDisplayAlertDialog(userData) {
//     updateMe(userData)
//         .then(() => {
//             window.location.href = `./#clientDashboard`
//         })
//     .catch(() => console.log('error'));
// }
///////////////////////////////////////////
//Add Visit Screen
///////////////////////////////////////////
function getMyClientsAndDisplayAddVisitForm(providerID) {
    getMyClients()
    .then(displayAddVisitForm)
    .catch(() => console.log('not found'));
}
function displayAddVisitForm(clientsData) {
    const clientListHTML = generateClientListHTML(clientsData);
    const element = $(addVisitFormTemplate);
    element.find('#js-client-list').append(clientListHTML);
    $('#js-main').html(element);
}
//Get list of clients for the form
function generateClientHTML(client) {
    if (!client.provider) {
        return `
        <option value='${client.fullName}'>${client.fullName}</option>`
    }
} 
function generateClientListHTML(clientsData) {
    const items = clientsData.map((item, index) => generateClientHTML(item, index));  
    return items.join('');
}
//Listener
function handleAddVisitSubmit() {
    $('#js-main').on('submit', '#js-add-visit-form', event => {
        event.preventDefault();
        const visitData = {
            clientId: $(event.currentTarget).find('#client').val(),
            date: $(event.currentTarget).find('#date').val(),
            startTime: $(event.currentTarget).find('#startTime').val(),
            endTime: $(event.currentTarget).find('#endTime').val(),
            address: {
                addressString: $(event.currentTarget).find('#streetAddress').val()
            },
            recurrence: $(event.currentTarget).find('#recurrence').val()
        };
        addVisitAndDisplayAlertDialog(visitData);
    }); 
}
$(handleAddVisitSubmit);
function addVisitAndDisplayAlertDialog(data) {
    addVisit(data)
    .then(displayAlertDialog('Visit Added'));
}
///////////////////////////////////////////
//All Visits Screen
///////////////////////////////////////////
function getAndDisplayAllVisits(providerID) {
    getProviderUpcomingVisits(providerID)
        .then(displayAllVisits)
        .catch(() => console.log('not found'));
}
function generateVisitItemHTML(visit) {
    return `
    <div class='listItem'>
                <a href='#user/${visit.client}/visit/${visit.id}/delete'><img src='images/delete.svg' title='Delete Visit' alt='Delete Visit' /></a>
                <h3>${visit.startTime}</h3>
                <p>${visit.client}</p>
            </div>`;
}
function generateAllVisitsHTML(visitsData) {
    const items = visitsData.map((item, index) => generateVisitItemHTML(item, index));  
    return items.join('');
}
function displayAllVisits(visitsData) {
    const visitsListHTML = generateAllVisitsHTML(visitsData);
    $('#js-main').html(`
    <div class='boxed'>
        <h2>Visits</h2>
        <div id='js-visits-list'>
            ${visitsListHTML}
        </div>
        <a class='button' href='#user/${visitsData.id}/visit/add'>Add Visit</a>
    </div>`);
}
///////////////////////////////////////////
//All Clients Screen
///////////////////////////////////////////
function getAndDisplayAllClients(providerID) {
    getMyClients(providerID)
    .then(displayAllClients)
    .catch(() => console.log('not found'));
}
function generateClientItemHTML(client) {
    return `
    <a href='#user/${client.id}/' class='listItemLink'><div class='listItem'>
                <img src='images/arrow.svg' title='View Client' alt='View Client' />
                <h3>${client.fullName}</h3>
                <p>${client.address.addressString}</p>
            </div></a>`;
  }
function generateAllClientsHTML(clientsData) {
    const items = clientsData.map((item, index) => generateClientItemHTML(item, index));  
    return items.join('');
}
function displayAllClients(clientsData) {
    const clientsListHTML = generateAllClientsHTML(clientsData);
    $('#js-main').html(`
    <div class='boxed'>
        <h2>Clients</h2>
        <div id='js-clients-list'>
            ${clientsListHTML}
        </div>
        <a class='button' href='#addClient'>Add Client</a>
    </div>`);
}
///////////////////////////////////////////
//Add Client Screen
///////////////////////////////////////////

//re-uses client signup functions

///////////////////////////////////////////
//Provider Dashboard
///////////////////////////////////////////
function getVisitsAndDisplayProviderDashboard() {
    const STORE = { visitsData: [], userData: [] };
    return getProviderUpcomingVisits()
    .then(visitsData => {
        STORE.visitsData = visitsData;
        return getMe();
    })
    .then(userData => {
        STORE.userData = userData;
    })
    .then(displayProviderDashboard(STORE.userData, STORE.visitsData))
    .catch(() => console.log('not found'));
}
function displayProviderDashboard(userData, visitsData) {
    const recentVisitsHTML = generateUpcomingVisitsHTML(visitsData);
    const element = $(providerDashboardTemplate);
    element.find('#js-visits-list').html(recentVisitsHTML);
    //For some reason this doesn't work, used vanilla JS below instead
    //element.find('#js-update-profile-button').attr('href', `#updateClient/${userData.id}`);
    $('#js-main').html(element);
    document.querySelector('#js-all-visits-button').setAttribute('href', `#user/${userData._id}/visits`);
    document.querySelector('#js-add-visit-button').setAttribute('href', `#user/${userData._id}/visit/add`);
    document.querySelector('#js-all-clients-button').setAttribute('href', `#user/${userData._id}/clients`);
    document.querySelector('#js-add-client-button').setAttribute('href', `#user/${userData._id}`);
    document.querySelector('#js-update-profile-button').setAttribute('href', `#updateClient/${userData._id}`);
}
function generateVisitItemHTML(visit) {
    return `
    <div class='listItem'>
        <a href='#user/${visit.client}/visit/${visit.id}/delete'><img src='images/delete.svg' title='Delete Visit' alt='Delete Visit' /></a>
        <h3>${visit.startTime}</h3>
        <p>${visit.client}</p>
    </div>`;
}
function generateUpcomingVisitsHTML(visitsData) {
    //first three items only
    const items = visitsData.slice(0, 3).map((item, index) => generateVisitItemHTML(item, index));  
    return items.join('');
}

//Visit Actions
//rewrite
function displayDeleteVisitConfirmation(visitId) {
    if (confirm('Delete visit?')) {
        deleteVisit(visitId)
        .then(displayAlertDialog('Visit Deleted'));;
     } else {
        alert('Action Cancelled');
     } 
}
//Client Actions
function handleSearchForClientSubmit() {
    $('#js-main').on('submit', '#js-search-client', event => {
        event.preventDefault();
        let query = $(event.currentTarget).find('#lastName').val();
        getClientByNameAndDisplayClient(lastName);
    }); 
}
$(handleSearchForClientSubmit);
function getClientByNameAndDisplayClient(lastName) {
    getClientByName(lastName)
    .then(redirectToClientDetail);
}
function redirectToClientDetail(userId) {
        window.location.href = `./#user/${userId}/clientDetail`;
}

///////////////////////////////////////////
//Update Pet Screen - Client
///////////////////////////////////////////
function getMyPetAndDisplayUpdateForm(petId) {
    getMyPet(petId)
    .then(displayUpdateMyPetForm);
}
function displayUpdateMyPetForm(petData) {
    const element = $(addPetFormTemplate);
    element.find('#js-add-pet-form').attr('id', 'js-update-pet-form');
    element.find('h2').text('Update Pet');
    //pre-fill template
    element.find('#_id').val(petData._id);
    element.find('#petName').val(petData.name);
    element.find('#petType').val(petData.type).change();
    element.find('#petBreed').val(petData.breed);
    element.find('#petColor').val(petData.color);
    element.find('#petFood').val(petData.food);
    $('#js-main').html(element);
}
function handleUpdateMyPetFormSubmit() {
    $('#js-main').on('submit', '#js-update-pet-form', event => {
        event.preventDefault();
        const petId = $(event.currentTarget).find('#_id').val();
        const petData = {
            _id: petId,
            name: $(event.currentTarget).find('#petName').val(),
            type: $(event.currentTarget).find('#petType').val(),
            breed: $(event.currentTarget).find('#petType').val(),
            color: $(event.currentTarget).find('#petColor').val(),
            food: $(event.currentTarget).find('#petFood').val(),
        };
        updateMyPetAndDisplayAlertDialog(petId, petData);
        window.location.href = `./#pet/:petId`;
        //displayCompactSiteHeader();
        //getClientsPetAndDisplayPetDetail();
    });
}
$(handleUpdateMyPetFormSubmit);


function handleMyProfileUpdateSubmit() {
    $('#js-main').on('submit', '#js-client-update-form', event => {
        event.preventDefault();
        return getMe()
            .then(currentUserData => {
                const userData = {
                    id: currentUserData.id,
                    firstName: $(event.currentTarget).find('#firstName').val(),
                    lastName: $(event.currentTarget).find('#lastName').val(),
                    email: $(event.currentTarget).find('#email').val(),
                    phone: $(event.currentTarget).find('#phone').val(),
                    addressString: $(event.currentTarget).find('#streetAddress').val(),
                    vetInfo: $(event.currentTarget).find('#vetInfo').val(),
                };
                updateMeAndDisplayAlertDialog(userData);
            });
    })
}

function updateMyPetAndDisplayAlertDialog(petId, petData) {
    updateMyPet(petId, petData)
    .then(displayAlertDialog('Pet Updated'));
}
///////////////////////////////////////////
//Add Task Screen - Client
///////////////////////////////////////////
function displayAndHandleAddMyTaskForm() {
    $('#js-main').html(addTaskFormTemplate);
}
function handleAddMyTaskSubmit() {
    $('#js-main').on('submit', '#js-add-task-form', event => {
        event.preventDefault();
        return getMe()
            .then(userData => {
                const taskData = {
                    clientId: userData.id,
                    description: $(event.currentTarget).find('#taskDescription').val(),
                };
                addMyTaskAndDisplayAlertDialog(taskData);
            })
    });
}
$(handleAddMyTaskSubmit)
function addMyTaskAndDisplayAlertDialog(taskData) {
    addMyTask(taskData)
        .then(() => {
            window.location.href = `./#clientDashboard`;
        })
        .catch(() => console.log('Error adding task'));
}
///////////////////////////////////////////
//Add Task Screen - Provider
///////////////////////////////////////////
// function displayAndHandleAddClientTaskForm() {
//     $('#js-main').html(addTaskFormTemplate);
// }
// function handleAddClientTaskSubmit() {
//     $('#js-main').on('submit', '#js-add-task-form', event => {
//         return getMe()
//             .then(userData => {
//                 event.preventDefault();
//                 const taskData = {
//                     user: userData.id,
//                     description: $(event.currentTarget).find('#taskDescription').val(),
//                 };
//                 addClientTaskAndDisplayAlertDialog(taskData);
//                 displayCompactSiteHeader();
//                 getClientUserAndDisplayClientDashboard(userId);
//             })
//     });
// }
// $(handleAddClientTaskSubmit)
// function addClientTaskAndDisplayAlertDialog(taskData) {
//     addClientTask(taskData)
//         .then(displayAlertDialog('Task Added'));
// }
///////////////////////////////////////////
//Add Pet Screen - Provider
///////////////////////////////////////////
function displayAndHandleAddClientPetForm(userId) {
    $('#js-main').html(addPetFormTemplate);
    $(handleAddClientPetSubmit(userId));
}
function handleAddClientPetSubmit(userId) {
    $('#js-main').on('submit', '#js-add-pet-form', event => {
        event.preventDefault();
        const petData = {
            user: userId,
            name: $(event.currentTarget).find('#petName').val(),
            type: $(event.currentTarget).find('#petType').val(),
            breed: $(event.currentTarget).find('#petBreed').val(),
            color: $(event.currentTarget).find('#petColor').val(),
            food: $(event.currentTarget).find('#petFood').val(),
        };
        addClientPetAndDisplayAlertDialog(petData);
        displayCompactSiteHeader();
        //show detail for added pet
        //getClientsPetAndDisplayPetDetail();
    }); 
}
function addClientPetAndDisplayAlertDialog(petData) {
    addClientPet(petData)
    .then(displayAlertDialog('Pet Added'));
}
///////////////////////////////////////////
//Pet Detail Screen - Provider View
///////////////////////////////////////////
function getClientsPetAndDisplayPetDetail(petId) {
    getClientsPetDetail(petId)
    .then(displayPetDetail);
}
function getClientsPetDetail(petId) {
    const STORE = { petData: [], userData: [], visitData: [] };
    return getClientsPet(petId)
        .then(petData => {
            STORE.petData = petData;
            return getClient(petData.client);
        })
        .then(userData => {
            STORE.userData = userData;
            return getClientsUpcomingVisit(petData.client);
        })
        .then(visitData => {
            STORE.visitData = visitData;
        })
        .then(() => {
            return STORE;
        })
        .catch(() => console.log('error'));
}
function generatePetInfoHTML(pet) {
    return `
    <div class='petsList'>
            <a href=#user/${pet.user}/pet/${pet.id}/add class='petThumbnail'>
                <div>
                    <img src='images/logo.svg' alt='Fluffy'>
                    <p>${pet.name}</p>
                </div>
            </a>
        </div>
        <div>
            <div class='boxedInfoItem'><p>Name: ${pet.name}</p></div>
            <div class='boxedInfoItem'><p>Type: ${pet.type}</p></div>
            <div class='boxedInfoItem'><p>Breed: ${pet.breed}</p></div>
            <div class='boxedInfoItem'><p>Color: ${pet.color}</p></div>
            <div class='boxedInfoItem'><p>Food: ${pet.food}</p></div>
        </div>`;
}
function displayPetDetail(STORE) {
    const clientHeader = generateClientHeaderHTML(STORE.userData, STORE.visitData);
    const petDetail = generatePetInfoHTML(STORE.petData);
    $('#js-main').html(`
        ${clientHeader}
        ${petDetail}
        <a class='button' href='#user/${STORE.userData.id}/pet/${STORE.petData.id}/update'>Update Pet</a>
        <a class='button' href='#user/${STORE.userData.id}/pet/${STORE.petData.id}/delete'>Delete Pet</a>`
    );
}
//rewrite delete pet
function displayDeleteClientPetConfirmation(petId) {
    if (confirm('Delete pet?')) {
        deleteClientPet(petId)
        .then(displayAlertDialog('Pet Deleted'));;
     } else {
        alert('Action Cancelled');
     } 
}

///////////////////////////////////////////
//Pet Detail Screen - Client
///////////////////////////////////////////
function getMyPetAndDisplayPetDetail(petId) {
    getMe()
        .then((userData) => {
            if (userData.pets.includes(petId)) {
                const petData = userData.pets.find(function (pet) { return pet.id === petId; });
                displayMyPetDetail(userData, petData);
            } else {
                console.log('Pet not found')
            }
    })
}
function displayMyPetDetail(userData, petData) {
    console.log(petData);
    const clientHeader = generateClientHeaderHTML(userData);
    const petDetail = generatePetInfoHTML(petData);
    $('#js-main').html(`
        ${clientHeader}
        ${petDetail}
        <a class='button' href='#pet/${petData._id}/update'>Update Pet</a>
        <a class='button' href='#pet/${petData._id}/delete'>Delete Pet</a>`
    );
}
function displayDeleteMyPetConfirmation(petId) {
    if (confirm('Delete pet?')) {
        deleteMyPet(petId)
            .then(
                window.location.href = `./#clientDashboard`
            );
    } else {
        alert('Action Cancelled');
        window.location.href = `./#pet/${petId}`;
    }
}
///////////////////////////////////////////
//Update Client Profile Screen
///////////////////////////////////////////
function getClientUserAndDisplayClientUpdateForm(userId) {
    getClient(userId)
    .then(displayClientProfileUpdateForm);
}
function displayClientProfileUpdateForm(clientData) {
    const element = $(clientSignupFormTemplate);
    element.find('#js-client-signup-form').attr('id', 'js-client-update-form');
    element.find('h2').text('Update Profile');
    //pre-fill form
    element.find('#firstName').val(clientData.firstName);
    element.find('#lastName').val(clientData.lastName);
    element.find('#email').val(clientData.email);
    element.find('#phone').val(clientData.phone);
    element.find('#streetAddress').val(clientData.addressString);
    element.find('#vetInfo').val(clientData.vetInfo);
    //remove password fields
    element.find('label[for=password], input#password').remove();
    element.find('label[for=confirmPassword], input#confirmPassword').remove();
    $('#js-main').html(element);
}
function handleMyProfileUpdateSubmit() {
    $('#js-main').on('submit', '#js-client-update-form', event => {
        event.preventDefault();
        return getMe()
            .then(currentUserData => {
                const userData = {
                    id: currentUserData.id,
                    firstName: $(event.currentTarget).find('#firstName').val(),
                    lastName: $(event.currentTarget).find('#lastName').val(),
                    email: $(event.currentTarget).find('#email').val(),
                    phone: $(event.currentTarget).find('#phone').val(),
                    addressString: $(event.currentTarget).find('#streetAddress').val(),
                    vetInfo: $(event.currentTarget).find('#vetInfo').val(),
                };
                updateMeAndDisplayAlertDialog(userData);
            }); 
        })
}
$(handleMyProfileUpdateSubmit);
function updateMeAndDisplayAlertDialog(userData) {
    updateMe(userData)
        .then(() => {
            window.location.href = `./#clientDashboard`
        })
    .catch(() => console.log('Error updating profile'));
}
///////////////////////////////////////////
//Add Pet Screen - Client
///////////////////////////////////////////
function displayAndHandleAddMyPetForm() {
    $('#js-main').html(addPetFormTemplate);
}

function handleAddMyPetSubmit() {
    $('#js-main').on('submit', '#js-add-my-pet-form', event => {
        event.preventDefault();
        return getMe()
            .then(userData => {
                console.log(userData.id);
                const petData = {
                    clientId: userData.id,
                    name: $(event.currentTarget).find('#petName').val(),
                    type: $(event.currentTarget).find('#petType').val(),
                    breed: $(event.currentTarget).find('#petBreed').val(),
                    color: $(event.currentTarget).find('#petColor').val(),
                    food: $(event.currentTarget).find('#petFood').val()
                };
                console.log(petData);
                addMyPetAndDisplayAlertDialog(petData);
            })
    });
}
$(handleAddMyPetSubmit);
function addMyPetAndDisplayAlertDialog(petData) {
    addMyPet(petData)
        .then(() => {
            window.location.href = `./#clientDashboard`
        })
        .catch(() => console.log('Error adding pet'));
}
///////////////////////////////////////////
//Client Dashboard - NOT Provider Client Detail
///////////////////////////////////////////
function getMeAndDisplayClientDashboard() {
    getMe().then(displayClientDashboard);
}

function displayClientDashboard(userData) {
    const clientHeader = generateClientHeaderHTML(userData);
    const clientInfo = generateClientInfoHTML(userData);
    const petsList = generatePetsHTML(userData.pets);
    const tasksList = generateTasksHTML(userData.tasks);
    $('#js-main').html(`
    ${clientHeader}${clientInfo}
    <div class='petsList'>${petsList}</div>
    <a class='button' href='#pet/add'>Add Pet</a>
    <div id='js-tasks'>${tasksList}</div>
    <a class='button' href='#task/add'>Add Task</a>
    `);
}
// Client Info
function generateClientInfoHTML(client, user) {
    const entryNoteHTML = '';
    // show additional field if current user is provider
    // if (user.provider === true) {
    //     entryNoteHTML = `
    //     <a class='boxedInfoItem' href='#0'>
    //     <img src='images/house.svg' alt='Entry Note'>
    //     <p>${client.entryNote}</p>
    // </a>`;
    // }
    return `
    <div><a class='boxedInfoItem' href='tel:${client.phone}'>
                <img src='images/phone.svg' alt='Phone'>
                <p>${client.phone}</p>
            </a>
            <a class='boxedInfoItem' href='mailto:${client.email}'>
                    <img src='images/email.svg' alt='Email'>
                <p>${client.email}</p>
            </a>
            <a class='boxedInfoItem' href='https://www.google.com/maps/@${client.latLon}'>
                <img src='images/location.svg' alt='Address'>
                <p>${client.addressString}</p>
            </a>
            ${entryNoteHTML}
            <a class='boxedInfoItem' href='#0'>
                <img src='images/vet.svg' alt='Veterinarian'>
                <p>${client.vetInfo}</p>
            </a></div>`;
}
// Pets
function generatePetHTML(pet) {
    return `
    <a href='#pet/${pet._id}/' class='petThumbnail'>
    <div><img src='images/logo.svg' alt='${pet.name}'><p>${pet.name}</p></div></a>`;
}
function generatePetsHTML(petsData) {
    const items = petsData.map((item, index) => generatePetHTML(item, index));  
    return items.join('');
}
// Tasks
function generateTaskHTML(task) {
    return `
    <a class='boxedInfoItem' href='#0'><img src='images/checkbox.svg' alt='Task'>
    <p>${task.description}</p></a>`;
}
function generateTasksHTML(tasksList) {
    const items = tasksList.map((item, index) => generateTaskHTML(item, index));  
    return items.join('');
}
//rewrite delete task
function displayDeleteMyTaskConfirmation(taskId) {
    if (confirm('Delete task?')) {
        deleteMyTask(taskId)
            .then(displayAlertDialog('Task Deleted'));;
    } else {
        alert('Action Cancelled');
    }
}
///////////////////////////////////////////
// Client Header (Multiple Screens)
///////////////////////////////////////////
function generateClientHeaderHTML(userData) {
    const nextVisit = userData.visits && userData.visits.length > 0 ? `<p>Next Visit: ${formatDate(userData.visits[0].startTime)}</p></div>` : `<p>No visits scheduled</p>`;
    return `
    <div class='clientHeader'>
    <a class='buttonSmall' href='#updateClient/${userData.id}'>Edit</a>
            <h2>${userData.firstName} ${userData.lastName}</h2>
            ${nextVisit}</div>`;
}

///////////////////////////////////////////
// Compact Site Header
///////////////////////////////////////////
function displayCompactSiteHeader() {
    $('#js-header').html(compactHeaderTemplate);
}
///////////////////////////////////////////
//Dialogs
///////////////////////////////////////////
function displayAlertDialog(string) {
    alert(string);
}
function displayConfirmDialog(string) {
    confirm(string);
}
///////////////////////////////////////////
//Provider Signup Screen
///////////////////////////////////////////
function displayProviderSignupForm() {
    $('#js-main').html(providerSignupFormTemplate);
}
function handleProviderSignupSubmit() {
    $('#js-main').on('submit', '#js-provider-signup-form', event => {
        event.preventDefault();
        let userData = {
            companyName: $(event.currentTarget).find('#companyName').val(),
            firstName: $(event.currentTarget).find('#firstName').val(),
            lastName: $(event.currentTarget).find('#lastName').val(),
            email: $(event.currentTarget).find('#email').val(),
            phone: $(event.currentTarget).find('#phone').val(),
            addressString: $(event.currentTarget).find('#streetAddress').val(),
            password: $(event.currentTarget).find('#password').val(),
            role: 'provider'
        };
        addUser(userData)
        .then(() => {
            loginUser({ email: userData.email, password: userData.password })
            .then((response) => {
                window.localStorage.setItem('AUTH_TOKEN', response.authToken);
                console.log("provider user added")
                window.location.href = `./#providerDashboard`;
            })
        })
    });
}
$(handleProviderSignupSubmit);
///////////////////////////////////////////
//Client Signup Screen
///////////////////////////////////////////
function displayClientSignupForm(providerID) {
    const element = $(clientSignupFormTemplate);
    element.find('#provider').data('id', providerID);
    $('#js-main').html(element);
};
function handleClientSignupSubmit() {
    $('#js-main').on('submit', '#js-client-signup-form', event => {
        event.preventDefault();
        let userData = {
            provider: $(event.currentTarget).find('#provider').data('id'),
            firstName: $(event.currentTarget).find('#firstName').val(),
            lastName: $(event.currentTarget).find('#lastName').val(),
            email: $(event.currentTarget).find('#email').val(),
            phone: $(event.currentTarget).find('#phone').val(),
            addressString: $(event.currentTarget).find('#streetAddress').val(),
            vetInfo: $(event.currentTarget).find('#vetInfo').val(),
            password: $(event.currentTarget).find('#password').val(),
        };
        addUser(userData)
        .then(() => {
            loginUser({ email: userData.email, password: userData.password })
            .then((response) => {
                window.localStorage.setItem('AUTH_TOKEN', response.authToken);
                console.log("client user added")
                window.location.href = `./#clientDashboard`;
            })
    })
    }); 
}
$(handleClientSignupSubmit);
///////////////////////////////////////////
//Signup Type Screen
///////////////////////////////////////////
function displaySignupTypeForm() {
    logout();
    getProviders()
    .then(providers => {
        const providerListHTML = generateProviderListHTML(providers);
        console.log(providers);
        const element = $(signupTypeFormTemplate);
        element.find('#js-provider-list').append(providerListHTML);
        $('#js-main').html(element);
    })
}
function generateProviderHTML(provider) {
    if (provider.role === 'provider') {
        return `
        <option value='${provider.companyName}' data-id='${provider._id}'>${provider.companyName}</option>`
    }
}
function generateProviderListHTML(providersList) {
    const items = providersList.map((item, index) => generateProviderHTML(item, index));  
    return items.join('');
}
function handleSignupTypeSubmit() {
    $('#js-main').on('submit', '#js-signup-type-form', event => {
        event.preventDefault();
        // const providerID = $(event.currentTarget).find('#js-provider-list').data('id').change();
        const providerID = $(event.currentTarget).find(':selected').data('id');
        displayClientSignupForm(providerID);
    }); 
}
$(handleSignupTypeSubmit);

///////////////////////////////////////////
//Login screen
///////////////////////////////////////////
function displayLoginForm() {
    logout();
    $('#js-main').html(loginFormTemplate);
}
function handleLoginSubmit() {
    $('#js-main').on('submit', '#js-login-form', event => {
        event.preventDefault();
        const email = $(event.currentTarget).find('#email').val();
        const password = $(event.currentTarget).find('#password').val();
        loginUser({ email: email, password: password })
        .then(response => {
            console.log('Auth response: ', response);
            window.localStorage.setItem('AUTH_TOKEN', response.authToken);
            if (response.role === 'provider') {
                window.location.href = `./#providerDashboard`;
            } else {
                window.location.href = `./#clientDashboard`;
            }
        });
    })
}
$(handleLoginSubmit);