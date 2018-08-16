const pets = (function () {
    //Pet Detail Screen
    function _displayPetDetail(petId) {
        const userData = auth.getCurrentUser();
        if (auth.isProvider()) {
            let petData = [];
            const clientData = userData.clients.find(client => client.pets.find(pet => pet._id === petId));
            userData.clients.forEach(client => { client.pets.map(pet => pet._id == petId && petData.push(pet)) });
            return petData
                ? _generatePetDetail(clientData, petData[0])
                : console.error('Pet not found')
        } else {
            const petIndex = userData.pets.findIndex(pet => pet._id === petId);
            return petIndex >= 0
                ? _generatePetDetail(userData, userData.pets[petIndex])
                : console.error('Pet not found')
        }
    }
    function _generatePetInfoHTML(pet) {
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
    function _generatePetDetail(userData, petData) {
        const clientHeader = generateClientHeaderHTML(userData);
        const petDetail = _generatePetInfoHTML(petData);
        $('#js-main').html(`
        ${clientHeader}
        ${petDetail}
        <a class='button' href='#updatePet/${petData._id}'>Update Pet</a>
        <a class='button' href='#deletePet/${petData._id}'>Delete Pet</a>`
        );
    }

    //Add pet screen
    function _displayAndHandleAddPetForm(clientId) {
        const element = $(templates.addPetForm);
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
            _addPetAndDisplayAlertDialog(petData);
        });
    }
    $(handleAddMyPetSubmit);
    function _addPetAndDisplayAlertDialog(petData) {
        addPet(petData)
            .then(() => {
                window.history.back();
            })
            .catch(() => console.error('Error adding pet'));
    }

    //Update Pet Screen
    function _displayUpdatePetForm(petId) {
        const userData = auth.getCurrentUser();
        if (auth.isProvider()) {
            let petData = [];
            userData.clients.forEach(client => { client.pets.map(pet => pet._id == petId && petData.push(pet)) });
            return petData
                ? _generateUpdatePetForm(petData[0])
                : console.error('Pet not found')
        } else {
            const petIndex = userData.pets.findIndex(pet => pet._id === petId);
            return petIndex >= 0
                ? _generateUpdatePetForm(userData.pets[petIndex])
                : console.error('Pet not found')
        }
    }
    function _generateUpdatePetForm(petData) {
        const element = $(templates.addPetForm);
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
    function _handleUpdatePetFormSubmit() {
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
            _updatePetAndDisplayAlertDialog(petId, petData);
            window.history.back();
        });
    }
    $(_handleUpdatePetFormSubmit);
    function _updatePetAndDisplayAlertDialog(petId, petData) {
        updatePet(petId, petData)
            .then(displayAlertDialog('Pet Updated'));
    }

    //Delete pet
    function _displayDeletePetConfirmation(petId) {
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

    return {
        displayPetDetail: _displayPetDetail,
        displayUpdatePetForm: _displayUpdatePetForm,
        displayAndHandleAddPetForm: _displayAndHandleAddPetForm,
        displayDeletePetConfirmation: _displayDeletePetConfirmation
    };
})();
