//Date Formatter
function formatDate(rawStartDate, rawEndDate) {
    const startDate = new Date(rawStartDate);
    const endDate = new Date(rawEndDate);
    // const monthNames = ["January", "February", "March", "April", "May", "June",
    //     "July", "August", "September", "October", "November", "December"
    // ];
    const monthNames = ["Jan.", "Feb.", "March", "April", "May", "June",
        "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."
    ];
    return (monthNames[startDate.getMonth() + 1]) +
        ' ' + startDate.getDate() +
        ', ' + startDate.toTimeString().substr(0, 5) + '-' + endDate.toTimeString().substr(0, 5);
}

//Logout
function logout() {
    window.localStorage.removeItem('AUTH_TOKEN');
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
    element.find('#providerId').val(providerData._id);
    element.find('#companyName').val(providerData.companyName);
    element.find('#firstName').val(providerData.firstName);
    element.find('#lastName').val(providerData.lastName);
    element.find('#phone').val(providerData.phone);
    element.find('#streetAddress').val(providerData.addressString);
    //remove credentials fields from template
    element.find('label[for=email], input#email').remove();
    element.find('label[for=password], input#password').remove();
    element.find('label[for=confirmPassword], input#confirmPassword').remove();
    $('#js-main').html(element);
    new google.maps.places.Autocomplete((document.getElementById('streetAddress')), {
        types: ['geocode']
    });
}
function handleProviderProfileUpdateSubmit() {
    $('#js-main').on('submit', '#js-provider-update-form', event => {
        event.preventDefault();
        const userData = {
            _id: $(event.currentTarget).find('#providerId').val(),
            companyName: $(event.currentTarget).find('#companyName').val(),
            firstName: $(event.currentTarget).find('#firstName').val(),
            lastName: $(event.currentTarget).find('#lastName').val(),
            phone: $(event.currentTarget).find('#phone').val(),
            addressString: $(event.currentTarget).find('#streetAddress').val(),
        };
        updateProviderAndDisplayAlertDialog(userData);
    }); 
}
$(handleProviderProfileUpdateSubmit);
function updateProviderAndDisplayAlertDialog(userData) {
    updateMe(userData)
        .then(() => {
            window.location.href = `./#providerDashboard`
        })
    .catch(() => console.error('Error updating profile'));
}
///////////////////////////////////////////
//Add Visit Screen
///////////////////////////////////////////
function getMyClientsAndDisplayAddVisitForm() {
    getMe()
    .then(displayAddVisitForm)
    .catch(() => console.error('Error getting clients'));
}
function displayAddVisitForm(providerData) {
    const clientListHTML = generateClientListHTML(providerData.clients);
    const element = $(addVisitFormTemplate);
    element.find('#provider').data('id', providerData._id);
    element.find('#js-client-list').append(clientListHTML);
    $('#js-main').html(element);
}
//Geenerate list of clients for the form
function generateClientHTML(client) {
    if (!client.provider) {
        return `
        <option value='${client.firstName} ${client.lastName}' data-id='${client._id}'>${client.firstName} ${client.lastName}</option>`
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
            providerId: $(event.currentTarget).find('#provider').data('id'),
            client: $(event.currentTarget).find(':selected').data('id'),
            startTime: $(event.currentTarget).find('#startTime').val(),
            endTime: $(event.currentTarget).find('#endTime').val(),
        };
        addVisitAndDisplayAlertDialog(visitData);
    }); 
}
$(handleAddVisitSubmit);
function addVisitAndDisplayAlertDialog(data) {
    addVisit(data)
    .then(window.location.href = `./#providerDashboard`);
}
///////////////////////////////////////////
//All Visits Screen
///////////////////////////////////////////
function getAndDisplayAllVisits() {
    getMe()
        .then(displayAllVisits)
        .catch(() => console.error('No visits found'));
}
// function generateVisitItemHTML(visit) {
//     return `
//     <div class='listItem'>
//                 <a href='#user/${visit.client}/visit/${visit._id}/delete'><img src='images/delete.svg' title='Delete Visit' alt='Delete Visit' /></a>
//                 <h3>${visit.startTime}</h3>
//                 <p>${visit.client}</p>
//             </div>`;
// }
function generateAllVisitsHTML(visitsData) {
    const items = visitsData.map((item, index) => generateVisitItemHTML(item, index));  
    return items.join('');
}
function displayAllVisits(providerData) {
    const visitsListHTML = generateAllVisitsHTML(providerData.visits);
    $('#js-main').html(`
    <div class='boxed'>
        <h2>Visits</h2>
        <div id='js-visits-list'>
            ${visitsListHTML}
        </div>
        <a class='button' href='#addVisit'>Add Visit</a>
    </div>`);
}
///////////////////////////////////////////
//Client Detail Screen
///////////////////////////////////////////
function getClientAndDisplayClientDetail(clientId) {
    getMe()
        .then((providerData) => {
            const clientIndex = providerData.clients.findIndex(client => client._id === clientId);
            if (clientIndex >= 0) {
                displayClientDashboard(providerData.clients[clientIndex], 'provider');
            } else {
                console.error('Client not found')
            }
        })
}

///////////////////////////////////////////
//All Clients Screen
///////////////////////////////////////////
function getAndDisplayAllClients() {
    getMe()
    .then(displayAllClients)
    .catch(() => console.error('No clients found'));
}
function generateClientItemHTML(client) {
    return `
    <a href='#clientDetail/${client._id}/' class='listItemLink'><div class='listItem'>
                <img src='images/arrow.svg' title='View Client' alt='View Client' />
                <h3>${client.firstName} ${client.lastName}</h3>
                <p>${client.addressString}</p>
            </div></a>`;
  }
function generateAllClientsHTML(clientsData) {
    const items = clientsData.map((item, index) => generateClientItemHTML(item, index));  
    return items.join('');
}
function displayAllClients(providerData) {
    const clientsListHTML = providerData.clients && providerData.clients.length > 0 ? generateAllClientsHTML(providerData.clients) : `<p>No clients found</p>`;
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
function displayAddClientForm() {
    getMe()
    .then(providerData => {
        const element = $(clientSignupFormTemplate);
        element.find('#provider').data('id', providerData._id);
        element.find('#js-client-signup-form').attr('id', 'js-add-client-form');
        $('#js-main').html(element);
        new google.maps.places.Autocomplete((document.getElementById('streetAddress')), {
            types: ['geocode']
        });
    })
};
function handleAddClientSubmit() {
    $('#js-main').on('submit', '#js-add-client-form', event => {
        event.preventDefault();
        let userData = {
            providerId: $(event.currentTarget).find('#provider').data('id'),
            firstName: $(event.currentTarget).find('#firstName').val(),
            lastName: $(event.currentTarget).find('#lastName').val(),
            email: $(event.currentTarget).find('#email').val(),
            phone: $(event.currentTarget).find('#phone').val(),
            addressString: $(event.currentTarget).find('#streetAddress').val(),
            entryNote: $(event.currentTarget).find('#entryNote').val(),
            vetInfo: $(event.currentTarget).find('#vetInfo').val(),
            password: $(event.currentTarget).find('#password').val(),
        };
        addUser(userData)
            .then((createdClient) => {
                window.location.href = `./#providerDashboard`;
            })
    });
}
$(handleAddClientSubmit);

///////////////////////////////////////////
//Provider Dashboard
///////////////////////////////////////////
function getMeAndDisplayProviderDashboard() {
    getMe().then(displayProviderDashboard);
}

function displayProviderDashboard(userData) {
    const recentVisitsHTML = userData.visits && userData.visits.length > 0 ? generateUpcomingVisitsHTML(userData.visits) : `<p>No visits scheduled</p>`;
    const element = $(providerDashboardTemplate);
    element.find('#js-visits-list').html(recentVisitsHTML);
    $('#js-main').html(element);
}
function generateVisitItemHTML(visit) {
    const formattedStartTime = formatDate(visit.startTime, visit.endTime)
    return `
    <div class='listItem'>
        <a href='#deleteVisit/${visit._id}'><img src='images/delete.svg' title='Delete Visit' alt='Delete Visit' /></a>
        <h3>${formattedStartTime}</h3>
        <p><a href='#clientDetail/${visit.client._id}/'>${visit.client.firstName} ${visit.client.lastName}</a></p>
        <p><a href='https://www.google.com/maps/search/${visit.client.addressString}'>${visit.client.addressString}</a></p>
    </div>`;
}
function generateUpcomingVisitsHTML(visitsData) {
    //first three items only
    const items = visitsData.slice(0, 3).map((item, index) => generateVisitItemHTML(item, index));  
    return items.join('');
}

//Visit Actions
function displayDeleteVisitConfirmation(visitId) {
    if (confirm('Delete visit?')) {
        deleteVisit(visitId)
        .then(displayAlertDialog('Visit Deleted'));
     } else {
        alert('Action Cancelled');
     } 
}
///////////////////////////////////////////
//Update Pet Screen
///////////////////////////////////////////
function getPetAndDisplayUpdateForm(petId) {
    getMe()
        .then((userData) => {
            if (userData.role === 'provider') {
                let petData = [];
                const clientData = userData.clients.find(client => client.pets.filter(pet => pet._id === petId));
                userData.clients.forEach(client => { client.pets.map(pet => pet._id == petId && petData.push(pet)) });
                if (petData) {
                    displayUpdatePetForm(petData[0])
                } else {
                    console.error('Pet not found')
                }
            } else {
                const petIndex = userData.pets.findIndex(pet => pet._id === petId);
                if (petIndex >= 0) {
                    displayUpdatePetForm(userData.pets[petIndex]);
                } else {
                    console.error('Pet not found')
                }
            }
        })
}
function displayUpdatePetForm(petData) {
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
function handleUpdatePetFormSubmit() {
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
        updatePetAndDisplayAlertDialog(petId, petData);
        window.history.back();
    });
}
$(handleUpdatePetFormSubmit);
function updatePetAndDisplayAlertDialog(petId, petData) {
    updatePet(petId, petData)
    .then(displayAlertDialog('Pet Updated'));
}
///////////////////////////////////////////
//Add Task Screen
///////////////////////////////////////////
function displayAndHandleAddTaskForm(clientId) {
    const element = $(addTaskFormTemplate);
    element.find('#clientId').val(clientId);
    $('#js-main').html(element);
}
function handleAddTaskSubmit() {
    $('#js-main').on('submit', '#js-add-task-form', event => {
        event.preventDefault();
        const taskData = {
            clientId: $(event.currentTarget).find('#clientId').val(),
            description: $(event.currentTarget).find('#taskDescription').val(),
        };
        addTaskAndDisplayAlertDialog(taskData);
    });
}
$(handleAddTaskSubmit)
function addTaskAndDisplayAlertDialog(taskData) {
    addTask(taskData)
        .then(() => {
            // window.location.href = `./#clientDashboard`;
            window.history.back();
        })
        .catch(() => console.error('Error adding task'));
}
///////////////////////////////////////////
//Pet Detail Screen
///////////////////////////////////////////
function getPetAndDisplayPetDetail(petId) {
    getMe()
        .then((userData) => {
            if (userData.role === 'provider') {
                let petData = [];
                const clientData = userData.clients.find(client => client.pets.find(pet => pet._id === petId));
                userData.clients.forEach(client => { client.pets.map(pet => pet._id == petId && petData.push(pet)) });
                if (petData) {
                    displayPetDetail(clientData, petData[0])
                } else {
                    console.error('Pet not found')
                }
            } else {
                const petIndex = userData.pets.findIndex(pet => pet._id === petId);
                if (petIndex >= 0) {
                    displayPetDetail(userData, userData.pets[petIndex]);
                } else {
                    console.error('Pet not found')
                }
            }
    })
}
function generatePetInfoHTML(pet) {
    return `
    <div class='petsList'>
            <a href=#user/${pet.clientId}/pet/${pet._id}/add class='petThumbnail'>
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
function displayPetDetail(userData, petData) {
    const clientHeader = generateClientHeaderHTML(userData);
    const petDetail = generatePetInfoHTML(petData);
    $('#js-main').html(`
        ${clientHeader}
        ${petDetail}
        <a class='button' href='#updatePet/${petData._id}'>Update Pet</a>
        <a class='button' href='#deletePet/${petData._id}'>Delete Pet</a>`
    );
}
function displayDeletePetConfirmation(petId) {
    if (confirm('Delete pet?')) {
        deletePet(petId)
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
function getClientUserAndDisplayClientUpdateForm(clientId) {
    getMe()
        .then((userData) => {
            if (userData.role === 'provider') {
                const clientData = userData.clients.find(client => client._id === clientId);
                if (clientData) {
                    displayClientProfileUpdateForm(clientData)
                } else {
                    console.error('User not found')
                }
            } else {
                if (userData) {
                    displayClientProfileUpdateForm(userData);
                } else {
                    console.error('User not found')
                }
            }
        })
}
function displayClientProfileUpdateForm(clientData) {
    const element = $(clientSignupFormTemplate);
    element.find('#js-client-signup-form').attr('id', 'js-client-update-form');
    element.find('h2').text('Update Profile');
    //pre-fill form
    element.find('#clientId').val(clientData._id);
    element.find('#firstName').val(clientData.firstName);
    element.find('#lastName').val(clientData.lastName);
    element.find('#email').val(clientData.email);
    element.find('#phone').val(clientData.phone);
    element.find('#streetAddress').val(clientData.addressString);
    element.find('#entryNote').val(clientData.entryNote);
    element.find('#vetInfo').val(clientData.vetInfo);
    //remove password and provider fields
    element.find('label[for=provider], input#provider').remove();
    element.find('label[for=password], input#password').remove();
    element.find('label[for=confirmPassword], input#confirmPassword').remove();
    $('#js-main').html(element);
    new google.maps.places.Autocomplete((document.getElementById('streetAddress')), {
        types: ['geocode']
    });
}
function handleMyProfileUpdateSubmit() {
    $('#js-main').on('submit', '#js-client-update-form', event => {
        event.preventDefault();
        return getMe()
            .then(currentUserData => {
                const userData = {
                    _id: $(event.currentTarget).find('#clientId').val(),
                    firstName: $(event.currentTarget).find('#firstName').val(),
                    lastName: $(event.currentTarget).find('#lastName').val(),
                    email: $(event.currentTarget).find('#email').val(),
                    phone: $(event.currentTarget).find('#phone').val(),
                    addressString: $(event.currentTarget).find('#streetAddress').val(),
                    entryNote: $(event.currentTarget).find('#entryNote').val(),
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
            window.history.back();
        })
    .catch(() => console.error('Error updating profile'));
}
///////////////////////////////////////////
//Add Pet Screen
///////////////////////////////////////////
function displayAndHandleAddPetForm(clientId) {
    const element = $(addPetFormTemplate);
    element.find('#clientId').val(clientId);
    $('#js-main').html(element);
}
function handleAddMyPetSubmit() {
    $('#js-main').on('submit', '#js-add-pet-form', event => {
        event.preventDefault();
        const petData = {
            clientId: $(event.currentTarget).find('#clientId').val(),
            name: $(event.currentTarget).find('#petName').val(),
            type: $(event.currentTarget).find('#petType').val(),
            breed: $(event.currentTarget).find('#petBreed').val(),
            color: $(event.currentTarget).find('#petColor').val(),
            food: $(event.currentTarget).find('#petFood').val()
        };
        console.log(petData);
        addPetAndDisplayAlertDialog(petData);
    });
}
$(handleAddMyPetSubmit);
function addPetAndDisplayAlertDialog(petData) {
    addPet(petData)
        .then(() => {
            window.history.back();
        })
        .catch(() => console.error('Error adding pet'));
}
///////////////////////////////////////////
//Client Dashboard
///////////////////////////////////////////
function getMeAndDisplayClientDashboard() {
    getMe().then(displayClientDashboard);
}

function displayClientDashboard(userData, role) {
    const clientHeader = generateClientHeaderHTML(userData);
    const clientInfo = generateClientInfoHTML(userData);
    const petsList = generatePetsHTML(userData.pets);
    const tasksList = generateTasksHTML(userData.tasks);
    $('#js-main').html(`
    ${clientHeader}${clientInfo}
    <div class='petsList'>${petsList}</div>
    <a class='button' href='#addPet/${userData._id}'>Add Pet</a>
    <div id='js-tasks'>${tasksList}</div>
    <a class='button' href='#addTask/${userData._id}'>Add Task</a>
    `);
}
// Client Info
function generateClientInfoHTML(client) {
    return `
    <div><a class='boxedInfoItem' href='tel:${client.phone}'>
                <img src='images/phone.svg' alt='Phone'>
                <p>${client.phone}</p>
            </a>
            <a class='boxedInfoItem' href='mailto:${client.email}'>
                    <img src='images/email.svg' alt='Email'>
                <p>${client.email}</p>
            </a>
            <a class='boxedInfoItem' target='_blank' href='https://www.google.com/maps/search/${client.addressString}'>
                <img src='images/location.svg' alt='Address'>
                <p>${client.addressString}</p>
            </a>
            <a class='boxedInfoItem' href='#0'>
                <img src='images/house.svg' alt='Entry Note'>
                <p>${client.entryNote}</p>
            </a>           
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
    <div class='boxedInfoItem'><a href='#deleteTask/${task._id}'><img src='images/delete.svg' alt='Task'></a>
    <p>${task.description}</p></div>`;
}
function generateTasksHTML(tasksList) {
    const items = tasksList.map((item, index) => generateTaskHTML(item, index));  
    return items.join('');
}
function displayDeleteTaskConfirmation(taskId) {
    if (confirm('Delete task?')) {
        deleteTask(taskId)
            .then(displayAlertDialog('Task Deleted'));;
    } else {
        alert('Action Cancelled');
    }
}
///////////////////////////////////////////
// Client Header (Multiple Screens)
///////////////////////////////////////////
function generateClientHeaderHTML(userData) {
    const nextVisit = userData.visits && userData.visits.length > 0 ? `<p>Next Visit: ${formatDate(userData.visits[0].startTime, userData.visits[0].endTime)}</p></div>` : `<p>No visits scheduled. <a href='#addVisit'>Add a visit</a></p>`;
    return `
    <div class='clientHeader'>
    <a class='buttonSmall' href='#updateClient/${userData._id}'>Edit</a>
            <h2>${userData.firstName} ${userData.lastName}</h2>
            ${nextVisit}</div>`;
}

///////////////////////////////////////////
// Compact Site Header
///////////////////////////////////////////
function displayCompactSiteHeader(role) {
    if (role === 'provider') {
        $('#js-header').html(compactHeaderProviderTemplate);
    } else {
        $('#js-header').html(compactHeaderClientTemplate);
    }
}
///////////////////////////////////////////
//Dialogs
///////////////////////////////////////////
function displayAlertDialog(string) {
    alert(string);
    window.history.back();
}
function displayConfirmDialog(string) {
    confirm(string);
}
///////////////////////////////////////////
//Provider Signup Screen
///////////////////////////////////////////
function displayProviderSignupForm() {
    $('#js-main').html(providerSignupFormTemplate);
    new google.maps.places.Autocomplete((document.getElementById('streetAddress')), {
        types: ['geocode']
    });
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
    new google.maps.places.Autocomplete((document.getElementById('streetAddress')), {
            types: ['geocode']
        });
};
function handleClientSignupSubmit() {
    $('#js-main').on('submit', '#js-client-signup-form', event => {
        console.log('Handling client signup');
        event.preventDefault();
        let userData = {
            providerId: $(event.currentTarget).find('#provider').data('id'),
            firstName: $(event.currentTarget).find('#firstName').val(),
            lastName: $(event.currentTarget).find('#lastName').val(),
            email: $(event.currentTarget).find('#email').val(),
            phone: $(event.currentTarget).find('#phone').val(),
            addressString: $(event.currentTarget).find('#streetAddress').val(),
            vetInfo: $(event.currentTarget).find('#vetInfo').val(),
            password: $(event.currentTarget).find('#password').val(),
        };
        console.log(userData);
        addUser(userData)
        .then(() => {
            loginUser({ email: userData.email, password: userData.password })
            .then((response) => {
                window.localStorage.setItem('AUTH_TOKEN', response.authToken);
            })
            .then(() => {
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
        // auth.login(email, password)
        .then(response => {
            console.log('Auth response: ', response);
            window.localStorage.setItem('AUTH_TOKEN', response.authToken);
            // if (auth.isProvider()) {
            if (response.role === 'provider') {
                window.location.href = `./#providerDashboard`;
            } else {
                window.location.href = `./#clientDashboard`;
            }
        });
    })
}
$(handleLoginSubmit);