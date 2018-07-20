// Client Header
function generateClientHeaderHTML(clientData, visitData) {
    return `
    <a class="buttonSmall" href="update-client.html">Edit</a>
            <h2>${clientData.fullName}</h2>
            <p>Next Visit: ${visitData[0].startTime}</p>`;
}   

function renderClientHeader() {
    clientID = getQueryVariable("clientID");
    console.log(`Client ID for header is: ${clientID}`);
    const clientHeader = generateClientHeaderHTML(CLIENTS_STORE[0], VISITS_STORE);
    $('#js-client-header').html(clientHeader);
}

// Client Info
function generateClientInfoHTML(client) {
    return `
    <a class="boxedInfoItem" href="tel:${client.phone}">
                <img src="images/phone.svg" alt="Phone">
                <p>${client.phone}</p>
            </a>
            <a class="boxedInfoItem" href="mailto:${client.email}">
                    <img src="images/email.svg" alt="Email">
                <p>${client.email}</p>
            </a>
            <a class="boxedInfoItem" href="https://www.google.com/maps/@${client.latLon}">
                <img src="images/location.svg" alt="Address">
                <p>${client.address.addressString}</p>
            </a>
            <a class="boxedInfoItem" href="#0">
                <img src="images/house.svg" alt="Entry Note">
                <p>${client.address.entryNote}</p>
            </a>
            <a class="boxedInfoItem" href="#0">
                <img src="images/vet.svg" alt="Veterinarian">
                <p>${client.vetInfo}</p>
            </a>`;
}

function renderClientInfo() {
    const clientID = getQueryVariable("clientID");
    console.log(`Client ID for info is: ${clientID}`);
    const clientInfo = generateClientInfoHTML(CLIENTS_STORE[0]);
    $('#js-client-info').html(clientInfo);
}

  // Pets
function generatePetHTML(pet) {
    return `
    <a href="pet.html?petID=${pet.id}" id="js-pet" class="petThumbnail">
                <div>
                    <img src="images/logo.svg" alt="${pet.name}">
                    <p>${pet.name}</p>
                </div>
            </a>`;
}

function generatePetsHTML(petsList) {
    const items = petsList.map((item, index) => generatePetHTML(item, index));  
    return items.join("");
}

function renderPets() {
    console.log(`Client ID for pets is: ${clientID}`);
    const petsList = generatePetsHTML(PETS_STORE);
    $('#js-pets').html(petsList);
}

  // Tasks
function generateTaskHTML(task) {
    return `
    <a class="boxedInfoItem" href="#0">
                <img src="images/checkbox.svg" alt="Task">
                <p>${task.description}</p>
            </a>`;
}

function generateTasksHTML(tasksList) {
    const items = tasksList.map((item, index) => generateTaskHTML(item, index));  
    return items.join("");
}

function renderTasks() {
    console.log(`Client ID for tasks is: ${clientID}`);
    const tasksList = generateTasksHTML(TASKS_STORE);
    $('#js-tasks').html(tasksList);
}

function handleProviderDashboard() {
    renderClientHeader();
    renderClientInfo();
    renderPets();
    renderTasks();
  }
  
  // when the page loads, call `handleProviderDashboard`
  $(handleProviderDashboard);