//Date Formatter
function formatDate(startIsoDate, endIsoDate) {
    const startDate = new Date(startIsoDate);
    const endDate = new Date(endIsoDate);
    const monthNames = ["Jan.", "Feb.", "March", "April", "May", "June",
        "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."
    ];
    return (monthNames[startDate.getMonth() + 1]) +
        ' ' + startDate.getDate() +
        ', ' + startDate.toTimeString().substr(0, 5) + '-' + endDate.toTimeString().substr(0, 5);
}

///////////////////////////////////////////
//Update Provider Info Screen
///////////////////////////////////////////
function displayProviderProfileUpdateForm(providerData) {
    const element = $(templates.providerSignupForm);
    //pre-fill form
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
    updateUser(userData)
    .then(() => { window.location.href = `./#providerDashboard` })
    .catch(() => console.error('Error updating profile'));
}
///////////////////////////////////////////
//Add Visit Screen
///////////////////////////////////////////
function displayAddVisitForm(providerData) {
    const clientListHTML = generateClientSelectHTML(providerData.clients);
    const element = $(templates.addVisitForm);
    element.find('#provider').data('id', providerData._id);
    element.find('#js-client-list').append(clientListHTML);
    $('#js-main').html(element);
}
function generateClientOptionHTML(client) {
    if (!client.provider) {
        return `
        <option value='${client.firstName} ${client.lastName}' data-id='${client._id}'>${client.firstName} ${client.lastName}</option>`
    }
} 
function generateClientSelectHTML(clientsData) {
    const items = clientsData.map((item, index) => generateClientOptionHTML(item, index));  
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
function generateAllVisitsHTML(visitsData) {
    const items = visitsData.map((item, index) => generateVisitItemHTML(item, index));  
    return items.join('');
}
///////////////////////////////////////////
//Client Detail Screen
///////////////////////////////////////////
function displayClientDetail(providerData, clientId) {
    const clientIndex = providerData.clients.findIndex(client => client._id === clientId);
    return clientIndex >= 0
        ? displayClientDashboard(providerData.clients[clientIndex], 'provider')
        : console.error('Client not found')
}
function displayDeleteClientConfirmation(clientId) {
    if (confirm('Delete client?')) {
        deleteClient(clientId)
        .then(displayAlertDialog('Client Deleted'));
    } else {
        alert('Action Cancelled');
    }
}

///////////////////////////////////////////
//All Clients Screen
///////////////////////////////////////////
function displayAllClients(providerData) {
    const clientsListHTML = providerData.clients && providerData.clients.length > 0
        ? generateAllClientsHTML(providerData.clients)
        : `<p>No clients found</p>`;
    $('#js-main').html(`
    <div class='boxed'>
        <h2>Clients</h2>
        <div id='js-clients-list'>
            ${clientsListHTML}
        </div>
        <a class='button' href='#addClient'>Add Client</a>
    </div>`);
}
function generateAllClientsHTML(clientsData) {
    const items = clientsData.map((item, index) => generateClientItemHTML(item, index));  
    return items.join('');
}
function generateClientItemHTML(client) {
    return `
    <a href='#clientDetail/${client._id}/' class='listItemLink'><div class='listItem'>
                <img src='images/arrow.svg' title='View Client' alt='View Client' />
                <h3>${client.firstName} ${client.lastName}</h3>
                <p>${client.addressString}</p>
            </div></a>`;
  }
///////////////////////////////////////////
//Add Client Screen
///////////////////////////////////////////
function displayAddClientForm(providerData) {
    const element = $(templates.clientSignupForm);
    element.find('#provider').data('id', providerData._id);
    element.find('#js-client-signup-form').attr('id', 'js-add-client-form');
    $('#js-main').html(element);
    new google.maps.places.Autocomplete((document.getElementById('streetAddress')), {
        types: ['geocode']
    });
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
        .then(() => {
            window.location.href = `./#providerDashboard`;
        })
    });
}
$(handleAddClientSubmit);

///////////////////////////////////////////
//Provider Dashboard
///////////////////////////////////////////
function displayProviderDashboard(userData) {
    const recentVisitsHTML = userData.visits && userData.visits.length > 0
        ? generateUpcomingVisitsHTML(userData.visits)
        : `<p>No visits scheduled</p>`;
    const element = $(templates.providerDashboard);
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
    return confirm('Delete visit?')
        ? deleteVisit(visitId).then(displayAlertDialog('Visit Deleted'))
        : alert('Action Cancelled');
}

///////////////////////////////////////////
//Update Pet Screen
///////////////////////////////////////////
// function displayUpdateForm(petId) {
//     const userData = auth.getCurrentUser();
//     if (auth.isProvider()) {
//         let petData = [];
//         userData.clients.forEach(client => { client.pets.map(pet => pet._id == petId && petData.push(pet)) });
//         return petData
//             ? displayUpdatePetForm(petData[0])
//             : console.error('Pet not found')
//     } else {
//         const petIndex = userData.pets.findIndex(pet => pet._id === petId);
//         return petIndex >= 0
//             ? displayUpdatePetForm(userData.pets[petIndex])
//             : console.error('Pet not found')
//     }
// }
// function displayUpdatePetForm(petData) {
//     const element = $(templates.addPetForm);
//     element.find('#js-add-pet-form').attr('id', 'js-update-pet-form');
//     element.find('h2').text('Update Pet');
//     //pre-fill template
//     element.find('#_id').val(petData._id);
//     element.find('#petName').val(petData.name);
//     element.find('#petType').val(petData.type).change();
//     element.find('#petBreed').val(petData.breed);
//     element.find('#petColor').val(petData.color);
//     element.find('#petFood').val(petData.food);
//     $('#js-main').html(element);
// }
// function handleUpdatePetFormSubmit() {
//     $('#js-main').on('submit', '#js-update-pet-form', event => {
//         event.preventDefault();
//         const petId = $(event.currentTarget).find('#_id').val();
//         const petData = {
//             _id: petId,
//             name: $(event.currentTarget).find('#petName').val(),
//             type: $(event.currentTarget).find('#petType').val(),
//             breed: $(event.currentTarget).find('#petType').val(),
//             color: $(event.currentTarget).find('#petColor').val(),
//             food: $(event.currentTarget).find('#petFood').val(),
//         };
//         updatePetAndDisplayAlertDialog(petId, petData);
//         window.history.back();
//     });
// }
// $(handleUpdatePetFormSubmit);
// function updatePetAndDisplayAlertDialog(petId, petData) {
//     updatePet(petId, petData)
//     .then(displayAlertDialog('Pet Updated'));
// }
// ///////////////////////////////////////////
// //Pet Detail Screen
// ///////////////////////////////////////////
// function displayPetDetail(petId) {
//     const userData = auth.getCurrentUser();
//         if (auth.isProvider()) {
//             let petData = [];
//             const clientData = userData.clients.find(client => client.pets.find(pet => pet._id === petId));
//             userData.clients.forEach(client => { client.pets.map(pet => pet._id == petId && petData.push(pet)) });
//             return petData
//                 ? generatePetDetail(clientData, petData[0])
//                 : console.error('Pet not found')
//         } else {
//             const petIndex = userData.pets.findIndex(pet => pet._id === petId);
//             return petIndex >= 0
//                 ? generatePetDetail(userData, userData.pets[petIndex])
//                 : console.error('Pet not found')
//         }
// }
// function generatePetInfoHTML(pet) {
//     return `
//     <div class='petsList'>
//             <a href=#user/${pet.clientId}/pet/${pet._id}/add class='petThumbnail'>
//                 <div>
//                     <img src='images/logo.svg' alt='Fluffy'>
//                     <p>${pet.name}</p>
//                 </div>
//             </a>
//         </div>
//         <div>
//             <div class='boxedInfoItem'><p>Name: ${pet.name}</p></div>
//             <div class='boxedInfoItem'><p>Type: ${pet.type}</p></div>
//             <div class='boxedInfoItem'><p>Breed: ${pet.breed}</p></div>
//             <div class='boxedInfoItem'><p>Color: ${pet.color}</p></div>
//             <div class='boxedInfoItem'><p>Food: ${pet.food}</p></div>
//         </div>`;
// }
// function generatePetDetail(userData, petData) {
//     const clientHeader = generateClientHeaderHTML(userData);
//     const petDetail = generatePetInfoHTML(petData);
//     $('#js-main').html(`
//         ${clientHeader}
//         ${petDetail}
//         <a class='button' href='#updatePet/${petData._id}'>Update Pet</a>
//         <a class='button' href='#deletePet/${petData._id}'>Delete Pet</a>`
//     );
// }
///////////////////////////////////////////
//Update Client Profile Screen
///////////////////////////////////////////
function getClientUserAndDisplayClientUpdateForm(clientId) {
    const userData = auth.getCurrentUser();
        if (auth.isProvider()) {
            const clientData = userData.clients.find(client => client._id === clientId);
            return clientData
                ? displayClientProfileUpdateForm(clientData)
                : console.error('User not found')
        } else {
            return userData
                ? displayClientProfileUpdateForm(userData)
                : console.error('User not found')
        }
}
function displayClientProfileUpdateForm(clientData) {
    const element = $(templates.clientSignupForm);
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
            updateClientAndDisplayAlertDialog(userData);
        })
}
$(handleMyProfileUpdateSubmit);
function updateClientAndDisplayAlertDialog(userData) {
    updateUser(userData)
    .then(() => { window.history.back(); })
    .catch(() => console.error('Error updating profile'));
}
///////////////////////////////////////////
//Add Pet Screen
///////////////////////////////////////////
// function displayAndHandleAddPetForm(clientId) {
//     const element = $(templates.addPetForm);
//     element.find('#clientId').val(clientId);
//     $('#js-main').html(element);
// }
// function handleAddMyPetSubmit() {
//     $('#js-main').on('submit', '#js-add-pet-form', event => {
//         event.preventDefault();
//         const petData = {
//             clientId: $(event.currentTarget).find('#clientId').val(),
//             name: $(event.currentTarget).find('#petName').val(),
//             type: $(event.currentTarget).find('#petType').val(),
//             breed: $(event.currentTarget).find('#petBreed').val(),
//             color: $(event.currentTarget).find('#petColor').val(),
//             food: $(event.currentTarget).find('#petFood').val()
//         };
//         console.log(petData);
//         addPetAndDisplayAlertDialog(petData);
//     });
// }
// $(handleAddMyPetSubmit);
// function addPetAndDisplayAlertDialog(petData) {
//     addPet(petData)
//         .then(() => {
//             window.history.back();
//         })
//         .catch(() => console.error('Error adding pet'));
// }
///////////////////////////////////////////
//Client Dashboard
///////////////////////////////////////////
function displayClientDashboard(userData) {
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

///////////////////////////////////////////
// Client Header (Multiple Screens)
///////////////////////////////////////////
function generateClientHeaderHTML(userData) {
    const nextVisit = userData.visits && userData.visits.length > 0
        ? `<p>Next Visit: ${formatDate(userData.visits[0].startTime, userData.visits[0].endTime)}</p></div>`
        : `<p>No visits scheduled. <a href='#addVisit'>Add a visit</a></p>`;
    const clientDeleteButton = auth.isProvider()
        ? `<a class='buttonSmall' href='#deleteClient/${userData._id}'>Delete</a>`
        : '';
    return `
    <div class='clientHeader'>
    ${clientDeleteButton}
    <a class='buttonSmall' href='#updateClient/${userData._id}'>Edit</a>
            <h2>${userData.firstName} ${userData.lastName}</h2>
            ${nextVisit}</div>`;
}

///////////////////////////////////////////
// Compact Site Header
///////////////////////////////////////////
function displayCompactSiteHeader() {
    return auth.isProvider()
        ? $('#js-header').html(templates.compactHeaderProvider)
        : $('#js-header').html(templates.compactHeaderClient);
}
///////////////////////////////////////////
// Full Site Header
///////////////////////////////////////////
function displayFullSiteHeader() {
    $('#js-header').html(templates.fullHeader);
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
    $('#js-main').html(templates.providerSignupForm);
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
    const element = $(templates.clientSignupForm);
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
    auth.logout();
    getProviders()
    .then(providers => {
        const providerListHTML = generateProviderListHTML(providers);
        const element = $(templates.signupTypeForm);
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
        const providerID = $(event.currentTarget).find(':selected').data('id');
        displayClientSignupForm(providerID);
    }); 
}
$(handleSignupTypeSubmit);

///////////////////////////////////////////
//Login screen
///////////////////////////////////////////
function displayLoginForm() {
    auth.logout();
    $('#js-main').html(templates.loginForm);
}
function handleLoginSubmit() {
    $('#js-main').on('submit', '#js-login-form', event => {
        event.preventDefault();
        const email = $(event.currentTarget).find('#email').val();
        const password = $(event.currentTarget).find('#password').val();
        auth.login(email, password)
        .then(() => {
            return auth.isProvider()
                ? window.location.href = `./#providerDashboard`
                : window.location.href = `./#clientDashboard`;
        });
    })
}
$(handleLoginSubmit);