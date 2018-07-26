///////////////////////////////////////////
//Update Provider Info Screen
///////////////////////////////////////////
function getUserAndDisplayUpdateForm() {
    getUser(displayProviderProfileUpdateForm);
}
function getUser(callbackFn) {
    //connect to real API later
    setTimeout(function(){ callbackFn(PROVIDERS_STORE[0])}, 100);
}
function displayProviderProfileUpdateForm(provider) {
    //pre-fill form
    const element = $(providerSignupFormTemplate);
    element.find("#js-provider-signup-form").attr("id", "js-provider-update-form");
    element.find("h2").text("Update Provider Profile");
    element.find("#companyName").val(provider.companyName);
    element.find("#firstName").val(provider.firstName);
    element.find("#lastName").val(provider.lastName);
    element.find("#email").val(provider.email);
    element.find("#phone").val(provider.phone);
    element.find("#streetAddress").val(provider.address.addressString);
    //remove password fields
    element.find('label[for=password], input#password').remove();
    element.find('label[for=confirmPassword], input#confirmPassword').remove();
    $('#js-main').html(element);
}
function handleProviderProfileUpdateSubmit() {
    $('#js-main').on("submit", '#js-provider-update-form', event => {
        event.preventDefault();
        const userData = {
            companyName: $(event.currentTarget).find("#companyName").val(),
            firstName: $(event.currentTarget).find("#firstName").val(),
            lastName: $(event.currentTarget).find("#lastName").val(),
            email: $(event.currentTarget).find("#email").val(),
            address: {
                addressString: $(event.currentTarget).find("#streetAddress").val(),
            }
        };
        updateUserAndDisplayAlertDialog(userData);
    }); 
}
$(handleClientProfileUpdateSubmit);
function updateUserAndDisplayAlertDialog(data) {
    updateUser(data, displayAlertDialog);
}
function updateUser(data, callbackFn) {
    //connect to real API later
    setTimeout(function(){ callbackFn("User Updated")}, 100);
}
///////////////////////////////////////////
//Add Visit Screen
///////////////////////////////////////////
function getClientsAndDisplayAddVisitForm() {
    getClients(displayAddVisitForm);
}
function getClients(callbackFn) {
    //connect to real API later
    setTimeout(function(){ callbackFn(CLIENTS_STORE)}, 100);
}
function displayAddVisitForm(data) {
    const clientListHTML = generateClientListHTML(data);
    const element = $(addVisitFormTemplate);
    element.find("#js-client-list").append(clientListHTML);
    $('#js-main').html(element);
}
//Get list of clients for the form
function generateClientHTML(client) {
    if (!client.provider) {
        return `
        <option value="${client.fullName}">${client.fullName}</option>`
    }
} 
function generateClientListHTML(clientsList) {
    const items = clientsList.map((item, index) => generateClientHTML(item, index));  
    return items.join("");
}
//Listener
function handleAddVisitSubmit() {
    $('#js-main').on("submit", '#js-add-visit-form', event => {
        event.preventDefault();
        const visitData = {
            client: $(event.currentTarget).find("#client").val(),
            date: $(event.currentTarget).find("#date").val(),
            startTime: $(event.currentTarget).find("#startTime").val(),
            endTime: $(event.currentTarget).find("#endTime").val(),
            address: {
                addressString: $(event.currentTarget).find("#streetAddress").val()
            },
            recurrence: $(event.currentTarget).find("#recurrence").val()
        };
        addVisitAndDisplayAlertDialog(visitData);
    }); 
}
$(handleAddVisitSubmit);
function addVisitAndDisplayAlertDialog(data) {
    addVisit(data, displayAlertDialog);
}
function addVisit(data, callbackFn) {
    //connect to real API later
    setTimeout(function(){ callbackFn("Visit Added")}, 100);
}
///////////////////////////////////////////
//All Visits Screen
///////////////////////////////////////////
function getAndDisplayAllVisits() {
    getVisits(displayAllVisits);
}
function getVisits(callbackFn) {
    //connect to real API later
    setTimeout(function(){ callbackFn(VISITS_STORE)}, 100);
}
function generateVisitItemHTML(visit) {
    return `
    <div class="listItem">
                <a href="#" id="js-delete-visit"><img src="images/delete.svg" title="Delete Visit" alt="Delete Visit" /></a>
                <h3>${visit.startTime}</h3>
                <p>${visit.client}</p>
            </div>`;
}
function generateAllVisitsHTML(visitsList) {
    const items = visitsList.map((item, index) => generateVisitItemHTML(item, index));  
    return items.join("");
}
function displayAllVisits(data) {
    const visitsListHTML = generateAllVisitsHTML(data);
    $('#js-main').html(`
    <div class="boxed">
        <h2>Visits</h2>
        <div id="js-visits-list">
            ${visitsListHTML}
        </div>
        <a class="button" id="js-add-visit-button" href="#">Add Visit</a>
    </div>`);
}
///////////////////////////////////////////
//All Clients Screen
///////////////////////////////////////////
function getAndDisplayAllClients() {
    getClients(displayAllClients);
}
function getClients(callbackFn) {
    //connect to real API later
    setTimeout(function(){ callbackFn(CLIENTS_STORE)}, 100);
}
function generateClientItemHTML(client) {
    return `
    <a href="#" class="listItemLink js-client-link"><div class="listItem">
                <img src="images/arrow.svg" title="View Client" alt="View Client" />
                <h3>${client.fullName}</h3>
                <p>${client.address.addressString}</p>
            </div></a>`;
  }
function generateAllClientsHTML(clientsList) {
    const items = clientsList.map((item, index) => generateClientItemHTML(item, index));  
    return items.join("");
}
function displayAllClients(data) {
    const clientsListHTML = generateAllClientsHTML(data);
    $('#js-main').html(`
    <div class="boxed">
        <h2>Clients</h2>
        <div id="js-clients-list">
            ${clientsListHTML}
        </div>
        <a class="button" id="js-add-client-button" href="#">Add Client</a>
    </div>`);
}
function handleClientListClick() {
    $('#js-main').on("click", '.js-client-link', event => {
        displayCompactSiteHeader();
        displayClientDashboard();
        }); 
}
$(handleClientListClick);
///////////////////////////////////////////
//Add Client Screen
///////////////////////////////////////////

//re-uses client signup functions

///////////////////////////////////////////
//Provider Dashboard
///////////////////////////////////////////
function getVisitsAndDisplayProviderDashboard() {
    getUpcomingVisits(displayProviderDashboard);
}
function getUpcomingVisits(callbackFn) {
    //connect to real API later
    setTimeout(function(){ callbackFn(VISITS_STORE)}, 100);
}
function displayProviderDashboard(data) {
    const recentVisitsHTML = generateUpcomingVisitsHTML(data);
    const element = $(providerDashboardTemplate);
    element.find("#js-visits-list").html(recentVisitsHTML);
    $('#js-main').html(element);
}
function generateVisitItemHTML(visit) {
    return `
    <div class="listItem">
        <a href="#" class="js-delete-visit"><img src="images/delete.svg" title="Delete Visit" alt="Delete Visit" /></a>
        <h3>${visit.startTime}</h3>
        <p>${visit.client}</p>
    </div>`;
}
function generateUpcomingVisitsHTML(visitsList) {
    //first three items only
    const items = visitsList.slice(0, 3).map((item, index) => generateVisitItemHTML(item, index));  
    return items.join("");
}

//Visit Action Listeners
function handleDeleteVisitButton(){
    $('#js-main').on("click", ".js-delete-visit", event => {
        //modal yes/no confirm
        console.log("Handling delete visit button");
        deleteVisitAndDisplayAlertDialog();
        displayCompactSiteHeader();
        getVisitsAndDisplayProviderDashboard();
      }); 
}
$(handleDeleteVisitButton);
function deleteVisitAndDisplayAlertDialog(data) {
    if (confirm("Delete visit?")) {
        deleteVisit(data, displayAlertDialog);;
     } else {
        alert("Action Cancelled");
     } 
}
function deleteVisit(data, callbackFn) {
    //connect to real API later
    setTimeout(function(){ callbackFn("Visit Deleted")}, 100);
}
function handleViewAllVisitsButton() {
    $('#js-main').on("click", '#js-view-all-visits-button', event => {
        getAndDisplayAllVisits();
        }); 
}
$(handleViewAllVisitsButton);
function handleAddVisitButton() {
    $('#js-main').on("click", '#js-add-visit-button', event => {
        getClientsAndDisplayAddVisitForm();
        }); 
}
$(handleAddVisitButton);

//Client Action Listeners
function handleViewAllClientsButton() {
    $('#js-main').on("click", '#js-view-all-clients-button', event => {
        console.log("Handling all clients button");
        getAndDisplayAllClients();
        }); 
}
$(handleViewAllClientsButton);
function handleAddClientButton() {
    $('#js-main').on("click", '#js-add-client-button', event => {
        displayClientSignupForm();
        }); 
}
$(handleAddClientButton);
function handleSearchForClientSubmit() {
    $('#js-main').on("submit", '#js-search-client', event => {
        event.preventDefault();
        let query = $(event.currentTarget).find("#lastName").val();
        getClientByNameAndDisplayClient(data);
    }); 
}
$(handleSearchForClientSubmit);
function getClientByNameAndDisplayClient(data) {
    getCLientByName(displayClientDashboard);
}
function getClientByName(data, callbackFn) {
    //connect to real API later
    setTimeout(function(){ callbackFn(CLIENTS_STORE[0])}, 100);
}

//Provider Action Listener
function handleProviderProfileUpdateButton() {
    $('#js-main').on("click", '#js-update-provider-info-button', event => {
        getUserAndDisplayUpdateForm();
        }); 
}
$(handleProviderProfileUpdateButton);
///////////////////////////////////////////
//Update Pet Screen
///////////////////////////////////////////
function getPetAndDisplayUpdateForm() {
    getPet(displayUpdatePetForm);
}
function getPet(callbackFn) {
    //connect to real API later
    setTimeout(function(){ callbackFn(PETS_STORE[0])}, 100);
}
function displayUpdatePetForm(pet) {
    const element = $(addPetFormTemplate);
    element.find("#js-add-pet-form").attr("id", "#js-update-pet-form");
    element.find("h2").text("Update Pet");
    //pre-fill template
    element.find("#petName").val(pet.name);
    element.find("#petType").val(pet.type).change();
    element.find("#petBreed").val(pet.breed);
    element.find("#petColor").val(pet.color);
    element.find("#petFood").val(pet.food);
    $('#js-main').html(element);
}
function handleUpdatePetFormSubmit() {
    $("#js-main").on("submit", "#js-update-pet-form", event => {
        event.preventDefault();
        const petData = {
            name: $(event.currentTarget).find("#petName").val(),
            type: $(event.currentTarget).find("#petType").val(),
            breed: $(event.currentTarget).find("#petType").val(),
            color: $(event.currentTarget).find("#petColor").val(),
            food: $(event.currentTarget).find("#petFood").val(),
        };
        updatePetAndDisplayAlertDialog(petData);
        displayCompactSiteHeader();
        getPetAndDisplayPetDetail();
    });
}
$(handleUpdatePetFormSubmit);
function updatePetAndDisplayAlertDialog(data) {
    updatePet(data, displayAlertDialog);
}
function updatePet(data, callbackFn) {
    //connect to real API later
    setTimeout(function(){ callbackFn("Pet Updated")}, 100);
}
///////////////////////////////////////////
//Add Task Screen
///////////////////////////////////////////
function displayAddTaskForm() {
    $('#js-main').html(addTaskFormTemplate);
}
function handleAddTaskSubmit() {
    $("#js-main").on("submit", "#js-add-task-form", event => {
        event.preventDefault();
        const taskData = {
            description: $(event.currentTarget).find("#taskDescription").val(),
        };
        addTaskAndDisplayAlertDialog(taskData);
        displayCompactSiteHeader();
        displayClientDashboard();
    });
}
$(handleAddTaskSubmit);
function addTaskAndDisplayAlertDialog(data) {
    addTask(data, displayAlertDialog);
}
function addTask(data, callbackFn) {
    //connect to real API later
    setTimeout(function(){ callbackFn("Task Added")}, 100);
}
///////////////////////////////////////////
//Add Pet Screen
///////////////////////////////////////////
function displayAddPetForm() {
    $('#js-main').html(addPetFormTemplate);
}
function handleAddPetSubmit() {
    $("#js-main").on("submit", "#js-add-pet-form", event => {
        event.preventDefault();
        const petData = {
            name: $(event.currentTarget).find("#petName").val(),
            type: $(event.currentTarget).find("#petType").val(),
            breed: $(event.currentTarget).find("#petBreed").val(),
            color: $(event.currentTarget).find("#petColor").val(),
            food: $(event.currentTarget).find("#petFood").val(),
        };
        addPetAndDisplayAlertDialog(petData);
        displayCompactSiteHeader();
        //show detail for added pet
        getPetAndDisplayPetDetail();
    }); 
};
$(handleAddPetSubmit);
function addPetAndDisplayAlertDialog(data) {
    addPet(data, displayAlertDialog);
}
function addPet(data, callbackFn) {
    //connect to real API later
    setTimeout(function(){ callbackFn("Pet Added")}, 100);
}
///////////////////////////////////////////
//Pet Detail Screen
///////////////////////////////////////////
function getPetAndDisplayPetDetail() {
    getPet(displayPetDetail);
}
function generatePetInfoHTML(pet) {
    return `
    <div class="petsList">
            <a href="#" class="petThumbnail">
                <div>
                    <img src="images/logo.svg" alt="Fluffy">
                    <p>${pet.name}</p>
                </div>
            </a>
        </div>
        <div>
            <div class="boxedInfoItem"><p>Name: ${pet.name}</p></div>
            <div class="boxedInfoItem"><p>Type: ${pet.type}</p></div>
            <div class="boxedInfoItem"><p>Breed: ${pet.breed}</p></div>
            <div class="boxedInfoItem"><p>Color: ${pet.color}</p></div>
            <div class="boxedInfoItem"><p>Food: ${pet.food}</p></div>
        </div>`;
}
function displayPetDetail(petData) {
    const clientHeader = generateClientHeaderHTML(CLIENTS_STORE[0], VISITS_STORE);
    const petDetail = generatePetInfoHTML(petData);
    $('#js-main').html(`
        ${clientHeader}
        ${petDetail}
        <a class="button" id="js-update-pet-button" href="#">Update Pet</a>
        <a class="button" id="js-delete-pet-button" href="#">Delete Pet</a>`
    );
}
function handleUpdatePet() {
    $('#js-main').on("click", '#js-update-pet-button', event => {
        displayCompactSiteHeader();
        getPetAndDisplayUpdateForm();
      }); 
}
$(handleUpdatePet);
function handleDeletePet() {
    $('.js-main').on("click", '.js-delete-pet-button', event => {
        deletePetAndDisplayAlertDialog();
        displayCompactSiteHeader();
        displayClientDashboard();
      }); 
}
$(handleDeletePet);
function deletePetAndDisplayAlertDialog(data) {
    if (confirm("Delete pet?")) {
        deletePet(data, displayAlertDialog);;
     } else {
        alert("Action Cancelled");
     } 
}
function deletePet(data, callbackFn) {
    //connect to real API later
    setTimeout(function(){ callbackFn("Pet Deleted")}, 100);
}
///////////////////////////////////////////
//Update Client Profile Screen
///////////////////////////////////////////
function getClientUserAndDisplayClientUpdateForm() {
    getClientUser(displayClientProfileUpdateForm);
}
function getClientUser(callbackFn) {
    //connect to real API later
    setTimeout(function(){ callbackFn(CLIENTS_STORE[0])}, 100);
}
function displayClientProfileUpdateForm(client) {
    const element = $(clientSignupFormTemplate);
    element.find("#js-client-signup-form").attr("id", "#js-client-update-form");
    element.find("h2").text("Update Profile");
    //pre-fill form
    element.find("#firstName").val(client.firstName);
    element.find("#lastName").val(client.lastName);
    element.find("#email").val(client.email);
    element.find("#phone").val(client.phone);
    element.find("#streetAddress").val(client.address.addressString);
    element.find("#vetInfo").val(client.vetInfo);
    //remove password fields
    element.find('label[for=password], input#password').remove();
    element.find('label[for=confirmPassword], input#confirmPassword').remove();
    $('#js-main').html(element);
}
function handleClientProfileUpdateSubmit() {
    $('#js-main').on("submit", '#js-client-update-form', event => {
        event.preventDefault();
        const userData = {
            firstName: $(event.currentTarget).find("#firstName").val(),
            lastName: $(event.currentTarget).find("#lastName").val(),
            email: $(event.currentTarget).find("#email").val(),
            phone: $(event.currentTarget).find("#phone").val(),
            address: {
                addressString: $(event.currentTarget).find("#streetAddress").val()
            },
            vetInfo: $(event.currentTarget).find("#vetInfo").val(),
        };
        updateUserAndDisplayAlertDialog(userData);
        displayCompactSiteHeader();
        displayClientDashboard();
    }); 
}
$(handleClientProfileUpdateSubmit);
///////////////////////////////////////////
//Client Dashboard / Provider Client Detail
///////////////////////////////////////////

// Client Info
function generateClientInfoHTML(client, user) {
    const entryNoteHTML = "";
    // show additional field if current user is provider
    // if (user.provider === true) {
    //     entryNoteHTML = `
    //     <a class="boxedInfoItem" href="#">
    //     <img src="images/house.svg" alt="Entry Note">
    //     <p>${client.address.entryNote}</p>
    // </a>`;
    // }
    return `
    <div><a class="boxedInfoItem" href="tel:${client.phone}">
                <img src="images/phone.svg" alt="Phone">
                <p>${client.phone}</p>
            </a>
            <a class="boxedInfoItem" href="mailto:${client.email}">
                    <img src="images/email.svg" alt="Email">
                <p>${client.email}</p>
            </a>
            <a class="boxedInfoItem" href="https://www.google.com/maps/@${client.address.latLon}">
                <img src="images/location.svg" alt="Address">
                <p>${client.address.addressString}</p>
            </a>
            ${entryNoteHTML}
            <a class="boxedInfoItem" href="#0">
                <img src="images/vet.svg" alt="Veterinarian">
                <p>${client.vetInfo}</p>
            </a></div>`;
}
// Pets
function generatePetHTML(pet) {
    return `
    <a href="#" class="petThumbnail js-pet">
    <div><img src="images/logo.svg" alt="${pet.name}"><p>${pet.name}</p></div></a>`;
}
function generatePetsHTML(petsData) {
    const items = petsData.map((item, index) => generatePetHTML(item, index));  
    return items.join("");
}
// Tasks
function generateTaskHTML(task) {
    return `
    <a class="boxedInfoItem" href="#0"><img src="images/checkbox.svg" alt="Task">
    <p>${task.description}</p></a>`;
}
function generateTasksHTML(tasksList) {
    const items = tasksList.map((item, index) => generateTaskHTML(item, index));  
    return items.join("");
}
function displayClientDashboard() {
    const clientHeader = generateClientHeaderHTML(CLIENTS_STORE[0], VISITS_STORE);
    const clientInfo = generateClientInfoHTML(CLIENTS_STORE[0]);
    const petsList = generatePetsHTML(PETS_STORE);
    const tasksList = generateTasksHTML(TASKS_STORE);
    $('#js-main').html(`
    ${clientHeader}${clientInfo}
    <div class="petsList">${petsList}</div>
    <a class="button" id="js-add-pet-button" href="#">Add Pet</a>
    <div id="js-tasks">${tasksList}</div>
    <a class="button" id="js-add-task-button" href="#">Add Task</a>
    `);
}
function handlePetClick() {
    $('#js-main').on("click", '.js-pet', event => {
        displayCompactSiteHeader();
        getPetAndDisplayPetDetail();
      }); 
}
$(handlePetClick);
function handleAddPetClick() {
    $('#js-main').on("click", '#js-add-pet-button', event => {
        displayCompactSiteHeader();
        displayAddPetForm();
      }); 
}
$(handleAddPetClick);
function handleAddTaskClick() {
    $('#js-main').on("click", '#js-add-task-button', event => {
        displayCompactSiteHeader();
        displayAddTaskForm();
      }); 
}
$(handleAddTaskClick);
function handleUpdateClientProfileClick() {
    $('#js-main').on("click", '#js-update-client-profile', event => {
        getClientUserAndDisplayClientUpdateForm();
      }); 
}
$(handleUpdateClientProfileClick);
///////////////////////////////////////////
// Client Header (Multiple Screens)
///////////////////////////////////////////
function generateClientHeaderHTML(clientData, visitData) {
    return `
    <div class="clientHeader">
    <a class="buttonSmall" id="js-update-client-profile" href="#">Edit</a>
            <h2>${clientData.fullName}</h2>
            <p>Next Visit: ${visitData[0].startTime}</p></div>`;
}
function handleDashboardButton() {
    //conditional logic for provider/client
    $('#js-header').on("click", '#js-dashboard-button', event => {
        displayCompactSiteHeader();
        displayClientDashboard();
      }); 
}
$(handleDashboardButton);
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
    $('#js-main').on("submit", '#js-provider-signup-form', event => {
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
function handleClientSignupSubmit(){
    $('#js-main').on("submit", '#js-client-signup-form', event => {
        event.preventDefault();
        addUser(); //pass provider
        displayCompactSiteHeader();
        displayClientDashboard();
    }); 
}
$(handleClientSignupSubmit);
///////////////////////////////////////////
//Signup Type Screen
///////////////////////////////////////////
function displaySignupTypeForm() {
    const providerListHTML = generateProviderListHTML(PROVIDERS_STORE);
    const element = $(signupTypeFormTemplate);
    element.find("#js-provider-list").append(providerListHTML);
    $('#js-main').html(element);
}
function generateProviderHTML(provider) {
    if (provider.provider === true) {
        return `
        <option value="${provider.companyName}">${provider.companyName}</option>`
    }
}
function generateProviderListHTML(providersList) {
    const items = providersList.map((item, index) => generateProviderHTML(item, index));  
    return items.join("");
}
function handleSignupTypeSubmit(){
    $('#js-main').on("submit", '#js-signup-type-form', event => {
        event.preventDefault();
        displayClientSignupForm();
    }); 
}
$(handleSignupTypeSubmit);
function handleProviderSignupClick(){
    $('#js-main').on("click", '#js-provider-signup', event => {
        console.log("Provider signup link clicked");
        displayProviderSignupForm();
    }); 
}
$(handleProviderSignupClick);
///////////////////////////////////////////
//Login screen
///////////////////////////////////////////
function displayLoginForm() {
    $('#js-main').html(loginFormTemplate);
}
function handleLoginSubmit() {
    $('#js-main').on("submit", '#js-login-form', event => {
        const role = $('input[name="role"]:checked').val();
        event.preventDefault();
        console.log('`handleLogin` ran');
        if (role === "provider") {
            displayCompactSiteHeader();
            getVisitsAndDisplayProviderDashboard();
        }
        else {
            displayCompactSiteHeader();
            displayClientDashboard();
        }
    }); 
}
$(handleLoginSubmit);
///////////////////////////////////////////
//Home Screen
///////////////////////////////////////////
function handleLoginClick() {
    $('#js-main').on("click", '#js-login-button', event => {
    displayLoginForm();
    handleLoginSubmit();
    }); 
}
$(handleLoginClick);
function handleSignupClick() {
    $('#js-main').on("click", '#js-signup-button', event => {
    displaySignupTypeForm();
    }); 
}
$(handleSignupClick);