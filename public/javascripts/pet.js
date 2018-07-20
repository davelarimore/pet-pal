// Client Header
function generateClientHeaderHTML(clientData, visitData) {
    return `
    <a class="buttonSmall" href="update-client.html">Edit</a>
            <h2>${clientData.fullName}</h2>
            <p>Next Visit: ${visitData[0].startTime}</p>`;
}   

function renderClientHeader() {
    petID = getQueryVariable("petID");
    console.log(`Pet ID for header is: ${petID}`);
    const clientHeader = generateClientHeaderHTML(CLIENTS_STORE[0], VISITS_STORE);
    $('#js-client-header').html(clientHeader);
}

// Pet Info
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

function renderPetInfo() {
    const petID = getQueryVariable("petID");
    console.log(`Pet ID for info is: ${petID}`);
    const petInfo = generatePetInfoHTML(PETS_STORE[0]);
    $('#js-pet-info').html(petInfo);
}

function handlePetDetail() {
    renderClientHeader();
    renderPetInfo();
  }
  
  // when the page loads, call `handleProviderDashboard`
  $(handlePetDetail);