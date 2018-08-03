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


///////////////////////////////////////////
//Update Provider Info Screen
///////////////////////////////////////////
function getProviderUserAndDisplayUpdateForm() {
    getMe()
    .then(displayProviderProfileUpdateForm)
    .catch (() => console.log('not found'));
}
function displayProviderProfileUpdateForm(providerData) {
    //pre-fill form
    const element = $(providerSignupFormTemplate);
    element.find('#js-provider-signup-form').attr('id', 'js-provider-update-form');
    element.find('h2').text('Update Provider Profile');
    element.find('#companyName').val(providerData.companyName);
    element.find('#firstName').val(providerData.firstName);
    element.find('#lastName').val(providerData.lastName);
    element.find('#email').val(providerData.email);
    element.find('#phone').val(providerData.phone);
    element.find('#streetAddress').val(providerData.address.addressString);
    //remove password fields from template
    element.find('label[for=password], input#password').remove();
    element.find('label[for=confirmPassword], input#confirmPassword').remove();
    $('#js-main').html(element);
}
function handleProviderProfileUpdateSubmit() {
    $('#js-main').on('submit', '#js-provider-update-form', event => {
        event.preventDefault();
        const userData = {
            companyName: $(event.currentTarget).find('#companyName').val(),
            firstName: $(event.currentTarget).find('#firstName').val(),
            lastName: $(event.currentTarget).find('#lastName').val(),
            email: $(event.currentTarget).find('#email').val(),
            address: {
                addressString: $(event.currentTarget).find('#streetAddress').val(),
            }
        };
        updateMeAndDisplayAlertDialog(userData);
    }); 
}
$(handleClientProfileUpdateSubmit);
function updateMeAndDisplayAlertDialog(userData) {
    updateMe(userData)
    .then(displayAlertDialog("Profile updated"))
    .catch(() => console.log('error'));
}
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
            client: $(event.currentTarget).find('#client').val(),
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
function displayDeleteVisitConfirmation(visitID) {
    if (confirm('Delete visit?')) {
        deleteVisit(visitID)
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
function redirectToClientDetail(userID) {
        window.location.href = `./#user/${userID}/clientDetail`;
}

///////////////////////////////////////////
//Update Pet Screen - Provider View
///////////////////////////////////////////
function getClientsPetAndDisplayUpdateForm(petID) {
    getClientsPet(petID)
    .then(displayUpdateClientsPetForm);
}
function displayUpdateClientsPetForm(petData) {
    const element = $(addPetFormTemplate);
    element.find('#js-add-pet-form').attr('id', '#js-update-pet-form');
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
function handleUpdateClientsPetFormSubmit() {
    $('#js-main').on('submit', '#js-update-pet-form', event => {
        event.preventDefault();
        const petID = $(event.currentTarget).find('#_id').val();
        const petData = {
            _id: petID,
            name: $(event.currentTarget).find('#petName').val(),
            type: $(event.currentTarget).find('#petType').val(),
            breed: $(event.currentTarget).find('#petType').val(),
            color: $(event.currentTarget).find('#petColor').val(),
            food: $(event.currentTarget).find('#petFood').val(),
        };
        updateClientsPetAndDisplayAlertDialog(petID, petData);
        window.location.href = `./#pet/:petID`;
        //displayCompactSiteHeader();
        //getClientsPetAndDisplayPetDetail();
    });
}
$(handleUpdateClientsPetFormSubmit);
function updateClientsPetAndDisplayAlertDialog(petID, petData) {
    updateClientsPet(petID, petData)
    .then(displayAlertDialog('Pet Updated'));
}
///////////////////////////////////////////
//Add Task Screen - Provider
///////////////////////////////////////////
function displayAndHandleAddClientTaskForm(userID) {
    $('#js-main').html(addTaskFormTemplate);
    $(handleAddClientTaskSubmit(userID));
}
function handleAddClientTaskSubmit(userID) {
    $('#js-main').on('submit', '#js-add-task-form', event => {
        event.preventDefault();
        const taskData = {
            user: userID,
            description: $(event.currentTarget).find('#taskDescription').val(),
        };
        addClientTaskAndDisplayAlertDialog(taskData);
        displayCompactSiteHeader();
        getClientUserAndDisplayClientDashboard(userID);
    });
}

function addClientTaskAndDisplayAlertDialog(taskData) {
    addClientTask(taskData)
    .then(displayAlertDialog('Task Added'));
}
///////////////////////////////////////////
//Add Pet Screen - Provider
///////////////////////////////////////////
function displayAndHandleAddClientPetForm(userID) {
    $('#js-main').html(addPetFormTemplate);
    $(handleAddClientPetSubmit(userID));
}
function handleAddClientPetSubmit(userID) {
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
function getClientsPetAndDisplayPetDetail(petID) {
    getClientsPetDetail(petID)
    .then(displayPetDetail);
}
function getClientsPetDetail(petID) {
    const STORE = { petData: [], userData: [], visitData: [] };
    return getClientsPet(petID)
        .then(petData => {
            STORE.petData = petData;
            return getMyClient(petData.client);
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
function displayDeleteClientPetConfirmation(petID) {
    if (confirm('Delete pet?')) {
        deleteClientPet(petID)
        .then(displayAlertDialog('Pet Deleted'));;
     } else {
        alert('Action Cancelled');
     } 
}
///////////////////////////////////////////
//Pet Detail Screen - Client
///////////////////////////////////////////
function getMyPetAndDisplayPetDetail(petID) {
    getMyPetDetail(petID)
        .then(displayMyPetDetail);
}
function getMyPetDetail(petID) {
    console.log("Getting my pet detail");
    const STORE = { petData: [], userData: [], visitData: [] };
    return getMyPet(petID)
        .then(petData => {
            console.log(petData);
            STORE.petData = petData;
            return getMe(petData.client);
        })
        .then(userData => {
            STORE.userData = userData;
            return getMyUpcomingVisit(petData.client);
        })
        .then(visitData => {
            STORE.visitData = visitData;
        })
        .then(() => {
            return STORE;
        })
        .catch(() => console.log('error'));
}
function displayMyPetDetail(STORE) {
    console.log(STORE);
    const clientHeader = generateClientHeaderHTML(STORE.userData, STORE.visitData);
    const petDetail = generatePetInfoHTML(STORE.petData);
    $('#js-main').html(`
        ${clientHeader}
        ${petDetail}
        <a class='button' href='#pet/${STORE.petData._id}/update'>Update Pet</a>
        <a class='button' href='#pet/${STORE.petData._id}/delete'>Delete Pet</a>`
    );
}

//rewrite delete pet
function displayDeleteMyPetConfirmation(petID) {
    if (confirm('Delete pet?')) {
        deleteMyPet(petID)
            .then(displayAlertDialog('Pet Deleted'));;
    } else {
        alert('Action Cancelled');
    }
}
///////////////////////////////////////////
//Update Client Profile Screen
///////////////////////////////////////////
function getClientUserAndDisplayClientUpdateForm() {
    getMe()
    .then(displayClientProfileUpdateForm);
}
function displayClientProfileUpdateForm(clientData) {
    const element = $(clientSignupFormTemplate);
    element.find('#js-client-signup-form').attr('id', '#js-client-update-form');
    element.find('h2').text('Update Profile');
    //pre-fill form
    element.find('#firstName').val(clientData.firstName);
    element.find('#lastName').val(clientData.lastName);
    element.find('#email').val(clientData.email);
    element.find('#phone').val(clientData.phone);
    element.find('#streetAddress').val(clientData.address.addressString);
    element.find('#vetInfo').val(clientData.vetInfo);
    //remove password fields
    element.find('label[for=password], input#password').remove();
    element.find('label[for=confirmPassword], input#confirmPassword').remove();
    $('#js-main').html(element);
}
function handleClientProfileUpdateSubmit() {
    $('#js-main').on('submit', '#js-client-update-form', event => {
        event.preventDefault();
        const userData = {
            firstName: $(event.currentTarget).find('#firstName').val(),
            lastName: $(event.currentTarget).find('#lastName').val(),
            email: $(event.currentTarget).find('#email').val(),
            phone: $(event.currentTarget).find('#phone').val(),
            address: {
                addressString: $(event.currentTarget).find('#streetAddress').val()
            },
            vetInfo: $(event.currentTarget).find('#vetInfo').val(),
        };
        updateMeAndDisplayAlertDialog(userData);
        displayCompactSiteHeader();
        getClientUserAndDisplayClientDashboard();
    }); 
}
$(handleClientProfileUpdateSubmit);
///////////////////////////////////////////
//Client Dashboard - NOT Provider Client Detail
///////////////////////////////////////////
function getClientUserAndDisplayClientDashboard() {
    getClientDashboardData()
        .then(displayClientDashboard);
}
function getClientDashboardData() {
    const STORE = { userData: [], visitData: [], petsData: [], tasksData: [] };
    return getMe()
        .then(userData => {
            STORE.userData = userData;
            return getMyUpcomingVisit();
        })
        .then(visitData => {
            STORE.visitData = visitData;
            return getMyPets();
        })
        .then(petsData => {
            STORE.petsData = petsData;
            return getMyTasks()
        })
        .then(tasksData => {
            STORE.tasksData = tasksData;
        })
        .then(() => {
            return STORE;
        })
        .catch(() => console.log('error'));
}
function displayClientDashboard(STORE) {
    const clientHeader = generateClientHeaderHTML(STORE.userData, STORE.visitData);
    const clientInfo = generateClientInfoHTML(STORE.userData);
    const petsList = generatePetsHTML(STORE.petsData);
    const tasksList = generateTasksHTML(STORE.tasksData);
    $('#js-main').html(`
    ${clientHeader}${clientInfo}
    <div class='petsList'>${petsList}</div>
    <a class='button' href='#user/${STORE.userData.id}/pet/add'>Add Pet</a>
    <div id='js-tasks'>${tasksList}</div>
    <a class='button' href='#user/${STORE.userData.id}/task/add'>Add Task</a>
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
    <a href='#pet/${pet._id}' class='petThumbnail'>
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
function displayDeleteMyTaskConfirmation(taskID) {
    if (confirm('Delete task?')) {
        deleteMyTask(taskID)
            .then(displayAlertDialog('Task Deleted'));;
    } else {
        alert('Action Cancelled');
    }
}
///////////////////////////////////////////
// Client Header (Multiple Screens)
///////////////////////////////////////////
function generateClientHeaderHTML(clientData, visitData) {
    const formattedDate = formatDate(visitData[0].startTime)
    return `
    <div class='clientHeader'>
    <a class='buttonSmall' href='#updateClient/${clientData._id}'>Edit</a>
            <h2>${clientData.firstName} ${clientData.lastName}</h2>
            <p>Next Visit: ${formattedDate}</p></div>`;
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
        getVisitsAndDisplayProviderDashboard();
    }); 
}
$(handleProviderSignupSubmit);
///////////////////////////////////////////
//Client Signup Screen
///////////////////////////////////////////
function displayClientSignupForm() {
    $('#js-main').html(clientSignupFormTemplate);
};
function handleClientSignupSubmit() {
    $('#js-main').on('submit', '#js-client-signup-form', event => {
        const userData = {
            provider: $(event.currentTarget).find(`select[name='provider']: selected`).data('id'),
            firstName: $(event.currentTarget).find('#firstName').val(),
            lastName: $(event.currentTarget).find('#lastName').val(),
            email: $(event.currentTarget).find('#email').val(),
            phone: $(event.currentTarget).find('#phone').val(),
            address: {
                addressString: $(event.currentTarget).find('#streetAddress').val()
            },
            vetInfo: $(event.currentTarget).find('#vetInfo').val(),
            password: $(event.currentTarget).find('#password').val(),
        };
        addUser(userData)
        .then(userData => {
            console.log("user added")
            //displayCompactSiteHeader();
            //getClientUserAndDisplayClientDashboard(userData.ObjectId);
        })
    }); 
}
$(handleClientSignupSubmit);
///////////////////////////////////////////
//Signup Type Screen
///////////////////////////////////////////
function displaySignupTypeForm() {
    const providerListHTML = generateProviderListHTML(PROVIDERS_STORE);
    const element = $(signupTypeFormTemplate);
    element.find('#js-provider-list').append(providerListHTML);
    $('#js-main').html(element);
    // getProviders()
    // .then(providers => {
    //     const providerListHTML = generateProviderListHTML(providers);
    //     const element = $(signupTypeFormTemplate);
    //     element.find('#js-provider-list').append(providerListHTML);
    //     $('#js-main').html(element);
    // })
}
function generateProviderHTML(provider) {
    if (provider.provider === true) {
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
        displayClientSignupForm();
    }); 
}
$(handleSignupTypeSubmit);

///////////////////////////////////////////
//Login screen
///////////////////////////////////////////
function displayLoginForm() {
    $('#js-main').html(loginFormTemplate);
}
function handleLoginSubmit() {
    $('#js-main').on('submit', '#js-login-form', event => {
        event.preventDefault();
        const email = $(event.currentTarget).find('#email').val();
        const password = $(event.currentTarget).find('#password').val();
        $.ajax({
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            url: `auth/login`,
            data: JSON.stringify({ email: email, password: password }),
        })
        .done(response => {
            console.log(response.authToken);
            window.localStorage.setItem('AUTH_TOKEN', response.authToken);
            window.location.href = `./#clientDashboard`;
            // getClientUserAndDisplayClientDashboard();
        });
    })
}
$(handleLoginSubmit);