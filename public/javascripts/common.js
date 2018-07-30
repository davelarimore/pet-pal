///////////////////////////////////////////
//Routes
///////////////////////////////////////////
const router = new Navigo("localhost:8080", true, "#!");

router
    .on({
        "login": () => {
            displayLoginForm();
            handleLoginSubmit();
        },
        "signup": () => {
            displaySignupTypeForm();
            handleSignupTypeSubmit();
        },
        "provider-signup": () => {
            displayProviderSignupForm();
            handleProviderSignupSubmit();
        },
        "client-dashboard": () => {
            displayCompactSiteHeader();
            getClientUserAndDisplayClientDashboard();
        },
        "provider-dashboard": () => {
            displayCompactSiteHeader();
            getVisitsAndDisplayProviderDashboard();
        },
        "add-client": () => {
            displayClientSignupForm();
        },
        "update-client/:userID": (params) => {
            displayCompactSiteHeader();
            getClientUserAndDisplayClientUpdateForm(params.userID);
        },
        "update-provider/:userID": (params) => {
            displayCompactSiteHeader();
            getProviderUserAndDisplayUpdateForm(params.userID);
        },
        "pet/:petID": (params) => {
            displayCompactSiteHeader();
            getPetAndDisplayPetDetail(params.petID);
        },
        "user/:userID/pet/:petID/:action": (params) => {
            displayCompactSiteHeader();
            if (params.action === "add") {
                displayAndHandleAddPetForm(params.userID);
            }
            else if (params.action === "delete") {
                deletePetAndDisplayAlertDialog(params.petID);
            }
            else if (params.action === "update") {
                getPetAndDisplayUpdateForm(params.petID);
            }
            else {
                getPetAndDisplayPetDetail(params.petID);
            }
        },
        "user/:userID/task/:taskID/:action": (params) => {
            displayCompactSiteHeader();
            if (params.action === "add") {
                displayAddTaskForm(params.userID);
            }
            else if (params.action === "delete") {
                deleteTaskAndDisplayAlertDialog(params.taskID);
            }
        },
        "user/:userID/visit/:visitID/:action": (params) => {
            displayCompactSiteHeader();
            if (params.action === "add") {
                getClientsAndDisplayAddVisitForm(params.userID);
            }
            else if (params.action === "delete") {
                deleteVisitAndDisplayAlertDialog(params.visitID);
            }
        },
        "user/:userID/visits": (params) => {
            displayCompactSiteHeader();
            getAndDisplayAllVisits(params.userID);
        },
        "user/:userID/clients": (params) => {
            displayCompactSiteHeader();
            getAndDisplayAllClients(params.userID);
        },
        //click from client list
        "user/:userID/client-detail": (params) => {
            displayCompactSiteHeader();
            getClientUserAndDisplayClientDashboard(params.userID);
        },
    })
    .resolve();

///////////////////////////////////////////
//Update Provider Info Screen
///////////////////////////////////////////
function getProviderUserAndDisplayUpdateForm(userID) {
    getUser(userID, displayProviderProfileUpdateForm);
}
function getUser(userID, callbackFn) {
    //connect to real API later using userID
    providerData = PROVIDERS_STORE[0];
    setTimeout(function () { callbackFn(providerData)}, 100);
}
function displayProviderProfileUpdateForm(providerData) {
    //pre-fill form
    const element = $(providerSignupFormTemplate);
    element.find("#js-provider-signup-form").attr("id", "js-provider-update-form");
    element.find("h2").text("Update Provider Profile");
    element.find("#companyName").val(providerData.companyName);
    element.find("#firstName").val(providerData.firstName);
    element.find("#lastName").val(providerData.lastName);
    element.find("#email").val(providerData.email);
    element.find("#phone").val(providerData.phone);
    element.find("#streetAddress").val(providerData.address.addressString);
    //remove password fields
    element.find("label[for=password], input#password").remove();
    element.find("label[for=confirmPassword], input#confirmPassword").remove();
    $("#js-main").html(element);
}
function handleProviderProfileUpdateSubmit() {
    $("#js-main").on("submit", "#js-provider-update-form", event => {
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
function getClientsAndDisplayAddVisitForm(userID) {
    getClients(userID, displayAddVisitForm);
}
function getClients(userID, callbackFn) {
    //connect to real API later using userID>clients
    clientsData = CLIENTS_STORE;
    setTimeout(function(){ callbackFn(clientsData)}, 100);
}
function displayAddVisitForm(clientsData) {
    const clientListHTML = generateClientListHTML(clientsData);
    const element = $(addVisitFormTemplate);
    element.find("#js-client-list").append(clientListHTML);
    $("#js-main").html(element);
}
//Get list of clients for the form
function generateClientHTML(client) {
    if (!client.provider) {
        return `
        <option value="${client.fullName}">${client.fullName}</option>`
    }
} 
function generateClientListHTML(clientsData) {
    const items = clientsData.map((item, index) => generateClientHTML(item, index));  
    return items.join("");
}
//Listener
function handleAddVisitSubmit() {
    $("#js-main").on("submit", "#js-add-visit-form", event => {
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
function getAndDisplayAllVisits(userID) {
    getVisits(userID, displayAllVisits);
}

// function getVisits(userID, callbackFn) {
//     console.log("Retrieving recipes");
//     $.getJSON("api/visits", userID, (response) => {
//         callbackFn(response);
//     });
// }

// function getAndDisplayAllVisits(userID) {
//     console.log("Getting visits for" + userID);
//     $.ajax({
//         method: "GET",
//         url: "api/visits",
//         data: JSON.stringify(userID),
//         dataType: "json",
//         contentType: "application/json"
//     })
//     .done((visitsData) => {
//         displayAllVisits(visitsData);
//     })
// }

function getVisits(userID, callbackFn) {
    //connect to real API later using userID>visits
    visitsData = VISITS_STORE;
    setTimeout(function(){ callbackFn(visitsData)}, 100);
}
function generateVisitItemHTML(visit) {
    return `
    <div class="listItem">
                <a href="#user/${visit.client}/visit/${visit.id}/delete"><img src="images/delete.svg" title="Delete Visit" alt="Delete Visit" /></a>
                <h3>${visit.startTime}</h3>
                <p>${visit.client}</p>
            </div>`;
}
function generateAllVisitsHTML(visitsData) {
    const items = visitsData.map((item, index) => generateVisitItemHTML(item, index));  
    return items.join("");
}
function displayAllVisits(visitsData) {
    const visitsListHTML = generateAllVisitsHTML(visitsData);
    $("#js-main").html(`
    <div class="boxed">
        <h2>Visits</h2>
        <div id="js-visits-list">
            ${visitsListHTML}
        </div>
        <a class="button" href="#user/${visitsData.id}/visit/add">Add Visit</a>
    </div>`);
}
///////////////////////////////////////////
//All Clients Screen
///////////////////////////////////////////
function getAndDisplayAllClients(userID) {
    getClients(userID, displayAllClients);
}
function getClients(userID, callbackFn) {
    //connect to real API later using userID>clients
    clientsData = CLIENTS_STORE;
    setTimeout(function () { callbackFn(clientsData)}, 100);
}
function generateClientItemHTML(client) {
    return `
    <a href="#user/${client.id}/" class="listItemLink"><div class="listItem">
                <img src="images/arrow.svg" title="View Client" alt="View Client" />
                <h3>${client.fullName}</h3>
                <p>${client.address.addressString}</p>
            </div></a>`;
  }
function generateAllClientsHTML(clientsData) {
    const items = clientsData.map((item, index) => generateClientItemHTML(item, index));  
    return items.join("");
}
function displayAllClients(clientsData) {
    const clientsListHTML = generateAllClientsHTML(clientsData);
    $("#js-main").html(`
    <div class="boxed">
        <h2>Clients</h2>
        <div id="js-clients-list">
            ${clientsListHTML}
        </div>
        <a class="button" href="#add-client">Add Client</a>
    </div>`);
}
///////////////////////////////////////////
//Add Client Screen
///////////////////////////////////////////

//re-uses client signup functions

///////////////////////////////////////////
//Provider Dashboard
///////////////////////////////////////////

function getVisitsAndDisplayProviderDashboard(userID) {
    getUpcomingVisits(userID, displayProviderDashboard);
}
function getUpcomingVisits(userID, callbackFn) {
    //connect to real API later
    userData = PROVIDERS_STORE[0];
    visitsData = VISITS_STORE;
    setTimeout(function(){ callbackFn(userData, visitsData)}, 100);
}
function displayProviderDashboard(userData, visitsData) {
    const recentVisitsHTML = generateUpcomingVisitsHTML(visitsData);
    const element = $(providerDashboardTemplate);
    //element.find("#js-update-profile-button").attr("href", "`#update-client/${userData.id}`");
    element.find("#js-visits-list").html(recentVisitsHTML);
    $("#js-main").html(element);
    document.querySelector("#js-all-visits-button").setAttribute("href", `#user/${userData.id}/visits`);
    document.querySelector("#js-add-visit-button").setAttribute("href", `#user/${userData.id}/visit/add`);
    document.querySelector("#js-all-clients-button").setAttribute("href", `#user/${userData.id}/clients`);
    document.querySelector("#js-add-client-button").setAttribute("href", `#user/${userData.id}`);
    document.querySelector("#js-update-profile-button").setAttribute("href", `#update-client/${userData.id}`);
}
function generateVisitItemHTML(visit) {
    return `
    <div class="listItem">
        <a href="#user/${visit.client}/visit/${visit.id}/delete"><img src="images/delete.svg" title="Delete Visit" alt="Delete Visit" /></a>
        <h3>${visit.startTime}</h3>
        <p>${visit.client}</p>
    </div>`;
}
function generateUpcomingVisitsHTML(visitsData) {
    //first three items only
    const items = visitsData.slice(0, 3).map((item, index) => generateVisitItemHTML(item, index));  
    return items.join("");
}

//Visit Actions
function deleteVisitAndDisplayAlertDialog(visitID) {
    if (confirm("Delete visit?")) {
        deleteVisit(visitID, displayAlertDialog);;
     } else {
        alert("Action Cancelled");
     } 
}
function deleteVisit(visitID, callbackFn) {
    //connect to real API later using visitID
    setTimeout(function(){ callbackFn("Visit Deleted")}, 100);
}

//Client Actions
function handleSearchForClientSubmit() {
    $("#js-main").on("submit", "#js-search-client", event => {
        event.preventDefault();
        let query = $(event.currentTarget).find("#lastName").val();
        getClientByNameAndDisplayClient(lastName);
    }); 
}
$(handleSearchForClientSubmit);
function getClientByNameAndDisplayClient(lastName) {
    getCLientByName(lastName, redirectToClientDetail);
}
function getClientByName(lastName, callbackFn) {
    //connect to real API later using lastName
    userID = CLIENTS_STORE[0];
    setTimeout(function(){ callbackFn(userID)}, 100);
}
function redirectToClientDetail(userID) {
        window.location.href = `./#user/${userID}/client-detail`;
}

///////////////////////////////////////////
//Update Pet Screen
///////////////////////////////////////////
function getPetAndDisplayUpdateForm(petID) {
    getPet(petID, displayUpdatePetForm);
}
function getPet(petID, callbackFn) {
    //connect to real API later using petID
    petData = PETS_STORE[0];
    setTimeout(function(){ callbackFn(petData)}, 100);
}
function displayUpdatePetForm(petData) {
    const element = $(addPetFormTemplate);
    element.find("#js-add-pet-form").attr("id", "#js-update-pet-form");
    element.find("h2").text("Update Pet");
    //pre-fill template
    element.find("#petName").val(petData.name);
    element.find("#petType").val(petData.type).change();
    element.find("#petBreed").val(petData.breed);
    element.find("#petColor").val(petData.color);
    element.find("#petFood").val(petData.food);
    $("#js-main").html(element);
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
        window.location.href = `./#pet/:petID`;
        //displayCompactSiteHeader();
        //getPetAndDisplayPetDetail();
    });
}
$(handleUpdatePetFormSubmit);
function updatePetAndDisplayAlertDialog(petData) {
    updatePet(petData, displayAlertDialog);
}
function updatePet(petData, callbackFn) {
    //connect to real API later
    setTimeout(function(){ callbackFn("Pet Updated")}, 100);
}
///////////////////////////////////////////
//Add Task Screen
///////////////////////////////////////////
function displayAndHandleAddTaskForm(userID) {
    $("#js-main").html(addTaskFormTemplate);
    $(handleAddTaskSubmit(userID));
}
function handleAddTaskSubmit(userID) {
    $("#js-main").on("submit", "#js-add-task-form", event => {
        event.preventDefault();
        const taskData = {
            user: userID,
            description: $(event.currentTarget).find("#taskDescription").val(),
        };
        addTaskAndDisplayAlertDialog(taskData);
        displayCompactSiteHeader();
        getClientUserAndDisplayClientDashboard(userID);
    });
}

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
function displayAndHandleAddPetForm(userID) {
    $("#js-main").html(addPetFormTemplate);
    $(handleAddPetSubmit(userID));
}
function handleAddPetSubmit(userID) {
    $("#js-main").on("submit", "#js-add-pet-form", event => {
        event.preventDefault();
        const petData = {
            user: userId,
            name: $(event.currentTarget).find("#petName").val(),
            type: $(event.currentTarget).find("#petType").val(),
            breed: $(event.currentTarget).find("#petBreed").val(),
            color: $(event.currentTarget).find("#petColor").val(),
            food: $(event.currentTarget).find("#petFood").val(),
        };
        addPetAndDisplayAlertDialog(petData);
        displayCompactSiteHeader();
        //show detail for added pet
        //getPetAndDisplayPetDetail();
    }); 
}
function addPetAndDisplayAlertDialog(petData) {
    addPet(petData, displayAlertDialog);
}
function addPet(petData, callbackFn) {
    //connect to real API later usng petData
    setTimeout(function(){ callbackFn("Pet Added")}, 100);
}
///////////////////////////////////////////
//Pet Detail Screen
///////////////////////////////////////////

function getPetAndDisplayPetDetail(petID) {
    getPetDetail(petID, displayPetDetail);
}
function getPetDetail(petID, callbackFn) {
    //connect to real API later using petID
    petData = PETS_STORE[0];
    userData = CLIENTS_STORE[0];
    visitsData = VISITS_STORE[0];
    setTimeout(function () { callbackFn(petData, userData, visitsData) }, 100);
}

function generatePetInfoHTML(pet) {
    return `
    <div class="petsList">
            <a href=#user/${pet.user}/pet/${pet.id}/add class="petThumbnail">
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
function displayPetDetail(petData, userData, visitsData) {
    //const clientHeader = generateClientHeaderHTML(userData, visitsData);
    const petDetail = generatePetInfoHTML(petData);
    $("#js-main").html(`
        ${petDetail}
        <a class="button" href="#user/${userData.id}/pet/${petData.id}/update">Update Pet</a>
        <a class="button" href="#user/${userData.id}/pet/${petData.id}/delete">Delete Pet</a>`
    );
}
function deletePetAndDisplayAlertDialog(petID) {
    if (confirm("Delete pet?")) {
        deletePet(petID, displayAlertDialog);;
     } else {
        alert("Action Cancelled");
     } 
}
function deletePet(petID, callbackFn) {
    //connect to real API later
    setTimeout(function(){callbackFn("Pet Deleted")}, 100);
}
///////////////////////////////////////////
//Update Client Profile Screen
///////////////////////////////////////////
function getClientUserAndDisplayClientUpdateForm(userID) {
    getClientUser(userID, displayClientProfileUpdateForm);
}
function getClientUser(userID, callbackFn) {
    //connect to real API later using userID
    userData = CLIENTS_STORE[0];
    setTimeout(function(){ callbackFn(userData)}, 100);
}
function displayClientProfileUpdateForm(clientData) {
    const element = $(clientSignupFormTemplate);
    element.find("#js-client-signup-form").attr("id", "#js-client-update-form");
    element.find("h2").text("Update Profile");
    //pre-fill form
    element.find("#firstName").val(clientData.firstName);
    element.find("#lastName").val(clientData.lastName);
    element.find("#email").val(clientData.email);
    element.find("#phone").val(clientData.phone);
    element.find("#streetAddress").val(clientData.address.addressString);
    element.find("#vetInfo").val(clientData.vetInfo);
    //remove password fields
    element.find("label[for=password], input#password").remove();
    element.find("label[for=confirmPassword], input#confirmPassword").remove();
    $("#js-main").html(element);
}
function handleClientProfileUpdateSubmit() {
    $("#js-main").on("submit", "#js-client-update-form", event => {
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
        getClientUserAndDisplayClientDashboard();
    }); 
}
$(handleClientProfileUpdateSubmit);
///////////////////////////////////////////
//Client Dashboard / Provider Client Detail
///////////////////////////////////////////
function getClientUserAndDisplayClientDashboard(userID) {
    getClientDashboardData(userID, displayClientDashboard);
}
function getClientDashboardData(userID, callbackFn) {
    //connect to real API later using userID
    userData = CLIENTS_STORE[0];
    visitsData = VISITS_STORE[0];
    petsData = PETS_STORE;
    tasksData = TASKS_STORE;
    setTimeout(function () { callbackFn(userData, visitsData, petsData, tasksData) }, 100);
}
function displayClientDashboard(userData, visitsData, petsData, tasksData) {
    const clientHeader = generateClientHeaderHTML(userData, visitsData);
    const clientInfo = generateClientInfoHTML(userData);
    const petsList = generatePetsHTML(petsData);
    const tasksList = generateTasksHTML(tasksData);
    $("#js-main").html(`
    ${clientHeader}${clientInfo}
    <div class="petsList">${petsList}</div>
    <a class="button" href="#user/${userData.id}/pet/add">Add Pet</a>
    <div id="js-tasks">${tasksList}</div>
    <a class="button" href="#user/${userData.id}/task/add">Add Task</a>
    `);
}
// Client Info
function generateClientInfoHTML(client, user) {
    const entryNoteHTML = "";
    // show additional field if current user is provider
    // if (user.provider === true) {
    //     entryNoteHTML = `
    //     <a class="boxedInfoItem" href="#0">
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
    <a href="#user/${pet.client}/pet/${pet.id}" class="petThumbnail">
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
function deleteTaskAndDisplayAlertDialog(taskID) {
    if (confirm("Delete task?")) {
        deleteTask(taskID, displayAlertDialog);;
    } else {
        alert("Action Cancelled");
    }
}
function deleteTask(taskID, callbackFn) {
    //connect to real API later using taskID
    setTimeout(function () { callbackFn("Task Deleted") }, 100);
}

///////////////////////////////////////////
// Client Header (Multiple Screens)
///////////////////////////////////////////

function generateClientHeaderHTML(clientData, visitData) {
    return `
    <div class="clientHeader">
    <a class="buttonSmall" href="#update-client/${clientData.id}">Edit</a>
            <h2>${clientData.fullName}</h2>
            <p>Next Visit: ${visitData.startTime}</p></div>`;
}

///////////////////////////////////////////
// Compact Site Header
///////////////////////////////////////////
function displayCompactSiteHeader() {
    $("#js-header").html(compactHeaderTemplate);
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
    $("#js-main").html(providerSignupFormTemplate);
}
function handleProviderSignupSubmit() {
    $("#js-main").on("submit", "#js-provider-signup-form", event => {
        event.preventDefault();
        getVisitsAndDisplayProviderDashboard();
    }); 
}
$(handleProviderSignupSubmit);
///////////////////////////////////////////
//Client Signup Screen
///////////////////////////////////////////
function displayClientSignupForm() {
    $("#js-main").html(clientSignupFormTemplate);
};
function handleClientSignupSubmit(){
    $("#js-main").on("submit", "#js-client-signup-form", event => {
        event.preventDefault();
        addUser(); //pass provider
        displayCompactSiteHeader();
        getClientUserAndDisplayClientDashboard();
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
    $("#js-main").html(element);
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
    $("#js-main").on("submit", "#js-signup-type-form", event => {
        event.preventDefault();
        displayClientSignupForm();
    }); 
}
$(handleSignupTypeSubmit);

///////////////////////////////////////////
//Login screen
///////////////////////////////////////////
function displayLoginForm() {
    $("#js-main").html(loginFormTemplate);
}
function handleLoginSubmit() {
    $("#js-main").on("submit", "#js-login-form", event => {
        const role = $("input[name='role']:checked").val();
        event.preventDefault();
        console.log("`handleLogin` ran");
        if (role === "provider") {
            window.location.href = "./#provider-dashboard";
        }
        else {
            window.location.href = "./#client-dashboard";
        }
    }); 
}
$(handleLoginSubmit);