///////////////////////////////////////////
//API
///////////////////////////////////////////

//Update Pet
function updatePet(pet) {
    console.log("Updating pet: " + pet);
    $.ajax({
      method: "PUT",
      url: PET_URL,
      data: JSON.stringify(pet),
      success: function(data) {
        displayPetDetail(data);
        handleUpdatePet();
        handleDeletePet();
      },
      dataType: "json",
      contentType: "application/json"
    });
}

//Add Task
function addTask(task) {
    console.log("Adding task: " + task);
    $.ajax({
      method: "POST",
      url: TASK_URL,
      data: JSON.stringify(task),
      success: function() {
        displayCompactSiteHeader();
        handleDashboardButton();
        displayClientDashboard();
        handlePetClick();
        handleAddPetClick();
        handleAddTaskClick();
      },
      dataType: "json",
      contentType: "application/json"
    });
}

//Get Client by ID
function getClient(id) {
    console.log("Adding task: " + id);
    $.ajax({
      method: "GET",
      url: CLIENT_URL,
      data: JSON.stringify(id),
      success: function() {
        displayCompactSiteHeader();
        handleDashboardButton();
        displayClientDashboard();
        handlePetClick();
        handleAddPetClick();
        handleAddTaskClick();
      },
      dataType: "json",
      contentType: "application/json"
    });
 
}
///////////////////////////////////////////
//Update Provider Info Screen
///////////////////////////////////////////
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
    $('#js-provider-update-form').on("submit", event => {
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
        updateUser(userData);
    }); 
}
///////////////////////////////////////////
//Add Visit Screen
///////////////////////////////////////////
function displayAddVisitForm() {
    const clientListHTML = generateClientListHTML(CLIENTS_STORE);
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
    $('#js-add-visit-form').on("submit", event => {
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
        addVisit(visitData);
    }); 
}
///////////////////////////////////////////
//All Visits Screen
///////////////////////////////////////////
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
function displayAllVisits() {
    const visitsListHTML = generateAllVisitsHTML(VISITS_STORE);
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
function generateClientItemHTML(client) {
    return `
    <a href="#" class="listItemLink js-client-link"><div class="listItem">
                <img src="images/arrow.svg" title="View Client" alt="View Client" />
                <h3>${client.fullName}</h3>
                <p>${client.address.addressString}</p>
            </div></a>`;
  }
function generateAllClientsHTML(visitsList) {
    const items = visitsList.map((item, index) => generateClientItemHTML(item, index));  
    return items.join("");
}
function displayAllClients() {
    const clientsListHTML = generateAllClientsHTML(CLIENTS_STORE);
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
    $('.js-client-link').on("click", event => {
        displayCompactSiteHeader();
        handleDashboardButton();
        displayClientDashboard();
        handleUpdateClientProfileClick();
        handlePetClick();
        handleAddPetClick();
        handleAddTaskClick();
        }); 
}
///////////////////////////////////////////
//Add Client Screen
///////////////////////////////////////////

//re-uses client signup functions

///////////////////////////////////////////
//Provider Dashboard
///////////////////////////////////////////
function displayProviderDashboard() {
    const recentVisitsHTML = generateUpcomingVisitsHTML(VISITS_STORE);
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
    //first five items only
    const items = visitsList.slice(0, 3).map((item, index) => generateVisitItemHTML(item, index));  
    return items.join("");
}

//Visit Action Listeners
function handleDeleteVisitButton(){
    $('#js-visits-list').on("click", ".js-delete-visit", event => {
        //modal yes/no confirm
        //deleteVisit(visit);
        console.log("Handling delete visit button");
        displayCompactSiteHeader();
        handleDashboardButton();
        displayProviderDashboard();
        handleViewAllVisitsButton();
        handleAddVisitButton();
        handleDeleteVisitButton();
        handleViewAllClientsButton();
        handleAddClientButton();
        handleSearchForClientSubmit();
        handleProviderProfileUpdateButton();
      }); 
}
function handleViewAllVisitsButton() {
    $('#js-view-all-visits-button').on("click", event => {
        displayAllVisits();
        handleDeleteVisitButton();
        handleAddVisitButton();
        }); 
}
function handleAddVisitButton() {
    $('#js-add-visit-button').on("click", event => {
        displayAddVisitForm();
        handleAddVisitSubmit();
        }); 
}

//Client Action Listeners
function handleViewAllClientsButton() {
    $('#js-view-all-clients-button').on("click", event => {
        displayAllClients();
        handleClientListClick();
        handleAddClientButton();
        }); 
}
function handleAddClientButton() {
    $('#js-add-client-button').on("click", event => {
        displayClientSignupForm();
        handleClientSignupSubmit();
        }); 
}
function handleSearchForClientSubmit() {
    $('#js-search-client').on("submit", event => {
        event.preventDefault();
        let query = $(event.currentTarget).find("#lastName").val();
        getClient(query);
    }); 
}

//Provider Action Listener
function handleProviderProfileUpdateButton() {
    $('#js-update-provider-info-button').on("click", event => {
        displayProviderProfileUpdateForm(PROVIDERS_STORE[0]);
        handleProviderProfileUpdateSubmit();
        }); 
}

///////////////////////////////////////////
//Update Pet Screen
///////////////////////////////////////////
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
    $("#js-update-pet-form").on("submit", event => {
        event.preventDefault();
        const petData = {
            name: $(event.currentTarget).find("#petName").val(),
            type: $(event.currentTarget).find("#petType").val(),
            breed: $(event.currentTarget).find("#petType").val(),
            color: $(event.currentTarget).find("#petColor").val(),
            food: $(event.currentTarget).find("#petFood").val(),
        };
        updatePet(petData);
        displayCompactSiteHeader();
        handleDashboardButton();
        displayPetDetail();
        handleUpdatePet();
        handleDeletePet();
    });
}
///////////////////////////////////////////
//Add Task Screen
///////////////////////////////////////////
function displayAddTaskForm() {
    $('#js-main').html(addTaskFormTemplate);
}
function handleAddTaskSubmit() {
    $("#js-add-task-form").on("submit", event => {
        event.preventDefault();
        const taskData = {
            description: $(event.currentTarget).find("#taskDescription").val(),
        };
        addTask(taskData);
        displayCompactSiteHeader();
        handleDashboardButton();
        displayClientDashboard();
        handlePetClick();
        handleAddPetClick();
        handleAddTaskClick();
    });
}
///////////////////////////////////////////
//Add Pet Screen
///////////////////////////////////////////
function displayAddPetForm() {
    $('#js-main').html(addPetFormTemplate);
}
function handleAddPetSubmit() {
    $("#js-add-pet-form").on("submit", event => {
        event.preventDefault();
        //addPet();
        displayCompactSiteHeader();
        handleDashboardButton();
        displayPetDetail();
    }); 
};
///////////////////////////////////////////
//Pet Detail Screen
///////////////////////////////////////////
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
            <div class="boxedInfoItem">
                <p>Name: ${pet.name}</p>
            </div>
            <div class="boxedInfoItem">
                <p>Type: ${pet.type}</p>
            </div>
            <div class="boxedInfoItem">
                <p>Breed: ${pet.breed}</p>
            </div>
            <div class="boxedInfoItem">
                <p>Color: ${pet.color}</p>
            </div>
            <div class="boxedInfoItem">
                <p>Food: ${pet.food}</p>
            </div>
        </div>`;
}
function displayPetDetail() {
    const clientHeader = generateClientHeaderHTML(CLIENTS_STORE[0], VISITS_STORE);
    const petDetail = generatePetInfoHTML(PETS_STORE[0]);
    $('#js-main').html(`
        ${clientHeader}
        ${petDetail}
        <a class="button" id="js-update-pet-button" href="#">Update Pet</a>
        <a class="button" id="js-delete-pet-button" href="#">Delete Pet</a>`
    );
}
function handleUpdatePet() {
    $('#js-update-pet-button').on("click", event => {
        displayCompactSiteHeader();
        handleDashboardButton();
        displayUpdatePetForm(PETS_STORE[0]);
        handleUpdatePetFormSubmit();
      }); 
}
function handleDeletePet() {
    $('.js-delete-pet-button').on("click", event => {
        //deletePet();
        displayCompactSiteHeader();
        handleDashboardButton();
        displayClientDashboard();
        handlePetClick();
        handleAddPetClick();
        handleAddTaskClick();
      }); 
}
///////////////////////////////////////////
//Update Client Profile Screen
///////////////////////////////////////////
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
    $('#js-client-update-form').on("submit", event => {
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
        updateUser(userData);
        displayCompactSiteHeader();
        handleDashboardButton();
        displayClientDashboard();
        handleUpdateClientProfileClick();
        handlePetClick();
        handleAddPetClick();
        handleAddTaskClick();
    }); 
}
///////////////////////////////////////////
//Client Dashboard / Provider Client Detail
///////////////////////////////////////////

// Client Info
function generateClientInfoHTML(client, user) {
    const entryNoteHTML = "";
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
function generatePetsHTML(petsList) {
    const items = petsList.map((item, index) => generatePetHTML(item, index));  
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
    $('.js-pet').on("click", event => {
        displayCompactSiteHeader();
        handleDashboardButton();
        displayPetDetail();
        handleUpdatePet();
        handleDeletePet();
      }); 
}
function handleAddPetClick() {
    $('#js-add-pet-button').on("click", event => {
        displayCompactSiteHeader();
        handleDashboardButton();
        displayAddPetForm();
        handleAddPetSubmit();
      }); 
}
function handleAddTaskClick() {
    $('#js-add-task-button').on("click", event => {
        displayCompactSiteHeader();
        handleDashboardButton();
        displayAddTaskForm();
        handleAddTaskSubmit();
      }); 
}

function handleUpdateClientProfileClick() {
    $('#js-update-client-profile').on("click", event => {
        displayClientProfileUpdateForm(CLIENTS_STORE[0]);
        handleClientProfileUpdateSubmit();
      }); 
}

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
    //conditional logic for provider
    $('#js-dashboard-button').on("click", event => {
        displayCompactSiteHeader();
        handleDashboardButton();
        displayClientDashboard();
        handleUpdateClientProfileClick();
        handlePetClick();
        handleAddPetClick();
        handleAddTaskClick();
      }); 
}
///////////////////////////////////////////
// Compact Site Header
///////////////////////////////////////////
function displayCompactSiteHeader() {
    $('#js-header').html(compactHeaderTemplate);
}
///////////////////////////////////////////
//Provider Signup Screen
///////////////////////////////////////////
function displayProviderSignupForm() {
    $('#js-main').html(providerSignupFormTemplate);
}
function handleProviderSignupSubmit() {
    $('#js-provider-signup-form').on("submit", event => {
        event.preventDefault();
        displayProviderDashBoard();
    }); 
}
///////////////////////////////////////////
//Client Signup Screen
///////////////////////////////////////////
function displayClientSignupForm() {
    $('#js-main').html(clientSignupFormTemplate);
};

function handleClientSignupSubmit(){
    $('#js-client-signup-form').on("submit", event => {
        event.preventDefault();
        addUser(); //pass provider
        displayCompactSiteHeader();
        handleDashboardButton();
        displayClientDashboard();
        handleUpdateClientProfileClick();
        handlePetClick();
        handleAddPetClick();
        handleAddTaskClick();
    }); 
}
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
    $('#js-signup-type-form').on("submit", event => {
        event.preventDefault();
        displayClientSignupForm();
        handleClientSignupSubmit();
    }); 
}
function handleProviderSignupClick(){
    $('#js-provider-signup').on("click", event => {
        console.log("Provider signup link clicked");
        displayProviderSignupForm();
        handleProviderSignupSubmit();
    }); 
}
///////////////////////////////////////////
//Login screen
///////////////////////////////////////////
function displayLoginForm() {
    $('#js-main').html(loginFormTemplate);
}
function handleLoginSubmit() {
    $('#js-login-form').on("submit", event => {
        const role = $('input[name="role"]:checked').val();
        event.preventDefault();
        console.log('`handleLogin` ran');
        if (role === "provider") {
            displayCompactSiteHeader();
            handleDashboardButton();
            displayProviderDashboard();
            handleViewAllVisitsButton();
            handleAddVisitButton();
            handleDeleteVisitButton();
            handleViewAllClientsButton();
            handleAddClientButton();
            handleSearchForClientSubmit();
            handleProviderProfileUpdateButton();
        }
        else {
            displayCompactSiteHeader();
            handleDashboardButton();
            displayClientDashboard();
            handleUpdateClientProfileClick();
            handlePetClick();
            handleAddPetClick();
            handleAddTaskClick();
        }
    }); 
}
///////////////////////////////////////////
//Home Screen
///////////////////////////////////////////
function handleLoginClick() {
    $('#js-login-button').on("click", event => {
    displayLoginForm();
    handleLoginSubmit();
    }); 
}
function handleSignupClick() {
    $('#js-signup-button').on("click", event => {
    displaySignupTypeForm();
    handleSignupTypeSubmit();
    handleProviderSignupClick();
    }); 
}
// when the page loads
$(handleLoginClick);
$(handleSignupClick);