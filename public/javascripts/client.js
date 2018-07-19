const CLIENT_STORE = {
    user: 001, // provider who owns it
    client: "John Doe",
    email: "john@test.biz",
    phone: "555-555-5555",
    vetInfo: "City Vet",
    address: {
        addressString: "123 Main",
        latLon: "0,0",
        entryNote: "Door code: 1234"
    }
};

const VISITS_STORE = [{
    user: 001, // provider who owns it
    client: "John Doe",
    startTime: "June 29, 10:00 AM",
    endTime: "June 29, 10:30 AM",
    recurrence: null,
},
{
    user: 001, // provider who owns it
    client: "John Doe",
    startTime: "June 30, 9:00 AM",
    endTime: "June 30, 9:00 AM",
    recurrence: null,
},
{
    user: 001, // provider who owns it
    client: "John Doe",
    startTime: "June 31, 9:00 AM",
    endTime: "June 31, 9:00 AM",
    recurrence: null,
}];

const PETS_STORE = [{
    user: 001,
    name: "Fluffy",
    type: "Cat",
    breed: "Tabby",
    color: "Grey",
    photo: "",
    food: "Purina"
},
{
    user: 001,
    name: "Caramel",
    type: "Cat",
    breed: "Tabby",
    color: "Tan",
    photo: "",
    food: "Purina"
},
{
    user: 001,
    name: "Snowball",
    type: "Cat",
    breed: "Tabby",
    color: "White",
    photo: "",
    food: "Purina"
}];

const TASKS_STORE = [{
    user: 001,
    description: "Feed animals",
    completed: false,
},
{
    user: 001,
    description: "Get mail",
    completed: false,
},
{
    user: 001,
    description: "Walk dog",
    completed: false,
}];

// Client Header
function generateClientHeaderHTML(clientData, visitData) {
    return `
    <a class="buttonSmall" href="update-client.html">Edit</a>
            <h2>${clientData.client}</h2>
            <p>Next Visit: ${visitData[0].startTime}</p>`;
}   

function renderClientHeader() {
    const clientHeader = generateClientHeaderHTML(CLIENT_STORE, VISITS_STORE);
    $('#js-client-header').html(clientHeader);
}

// Client Info
function generateClientInfoHTML(item, itemIndex, template) {
    return `
    <a class="boxedInfoItem" href="tel:${item.phone}">
                <img src="images/phone.svg" alt="Phone">
                <p>${item.phone}</p>
            </a>
            <a class="boxedInfoItem" href="mailto:${item.email}">
                    <img src="images/email.svg" alt="Email">
                <p>${item.email}</p>
            </a>
            <a class="boxedInfoItem" href="https://www.google.com/maps/@${item.latLon}">
                <img src="images/location.svg" alt="Address">
                <p>${item.address.addressString}</p>
            </a>
            <a class="boxedInfoItem" href="#0">
                <img src="images/house.svg" alt="Entry Note">
                <p>${item.address.entryNote}</p>
            </a>
            <a class="boxedInfoItem" href="#0">
                <img src="images/vet.svg" alt="Veterinarian">
                <p>${item.vetInfo}</p>
            </a>`;
}

function renderClientInfo() {
    // render the list in the DOM
    const clientInfo = generateClientInfoHTML(CLIENT_STORE);
    // insert that HTML into the DOM
    $('#js-client-info').html(clientInfo);
}

  // Pets
function generatePetHTML(item, itemIndex, template) {
    return `
    <a href="#" id="js-pet" class="petThumbnail">
                <div>
                    <img src="images/logo.svg" alt="${item.name}">
                    <p>${item.name}</p>
                </div>
            </a>`;
}

function generatePetsHTML(petsList) {
    const items = petsList.map((item, index) => generatePetHTML(item, index));  
    return items.join("");
}

function renderPets() {
    // render the list in the DOM
    const petsList = generatePetsHTML(PETS_STORE);
    // insert that HTML into the DOM
    $('#js-pets').html(petsList);
}

  // Pets
function generateTaskHTML(item, itemIndex, template) {
    return `
    <a class="boxedInfoItem" href="#0">
                <img src="images/checkbox.svg" alt="Task">
                <p>${item.description}</p>
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