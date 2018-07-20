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
            <a class="boxedInfoItem" href="https://www.google.com/maps/@${client.address.latLon}">
                <img src="images/location.svg" alt="Address">
                <p>${client.address.addressString}</p>
            </a>
            <a class="boxedInfoItem" href="#0">
                <img src="images/vet.svg" alt="Veterinarian">
                <p>${client.vetInfo}</p>
            </a>`;
}

function renderClientInfo() {
    // render the list in the DOM
    const clientInfo = generateClientInfoHTML(CLIENTS_STORE[0]);
    // insert that HTML into the DOM
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
    const petsList = generatePetsHTML(PETS_STORE);
    $('#js-pets').html(petsList);
}

  // Pets
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
    // render the list in the DOM
    const tasksList = generateTasksHTML(TASKS_STORE);
    // insert that HTML into the DOM
    $('#js-tasks').html(tasksList);
}

function handlePet(){
    $('#js-pets').on("click", "#js-pet", event => {
        event.preventDefault();
        console.log("handlePet ran");
        window.location.html = "/pet.html";
      }); 
}

function handleProviderDashboard() {
    renderClientHeader();
    renderClientInfo();
    renderPets();
    renderTasks();
    handlePet();
  }
  
  // when the page loads, call `handleProviderDashboard`
  $(handleProviderDashboard);