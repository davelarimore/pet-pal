const users = (function () {

    ///////////////////////////////////////////
    //Login screen
    ///////////////////////////////////////////
    function _displayLoginForm() {
        auth.logout();
        $('#js-main').html(templates.loginForm);
    }
    function _handleLoginSubmit() {
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
    $(_handleLoginSubmit);

    ///////////////////////////////////////////
    //Signup Type Screen
    ///////////////////////////////////////////
    function _displaySignupTypeForm() {
        auth.logout();
        api.getProviders()
            .then(providers => {
                const providerListHTML = _generateProviderListHTML(providers);
                const element = $(templates.signupTypeForm);
                element.find('#js-provider-list').append(providerListHTML);
                $('#js-main').html(element);
            })
    }
    function _generateProviderListHTML(providersList) {
        const items = providersList.map((item, index) => _generateProviderHTML(item, index));
        return items.join('');
    }
    function _generateProviderHTML(provider) {
        if (provider.role === 'provider') {
            return `
            <option value='${provider.companyName}' data-id='${provider._id}'>${provider.companyName}</option>`
        }
    }
    function _handleSignupTypeSubmit() {
        $('#js-main').on('submit', '#js-signup-type-form', event => {
            event.preventDefault();
            const providerID = $(event.currentTarget).find(':selected').data('id');
            _displayClientSignupForm(providerID);
        });
    }
    $(_handleSignupTypeSubmit);

    ///////////////////////////////////////////
    //Client Signup Screen
    ///////////////////////////////////////////
    function _displayClientSignupForm(providerID) {
        const element = $(templates.clientSignupForm);
        element.find('#provider').data('id', providerID);
        $('#js-main').html(element);
        new google.maps.places.Autocomplete((document.getElementById('streetAddress')), {
            types: ['geocode']
        });
    };
    function _handleClientSignupSubmit() {
        $('#js-main').on('submit', '#js-client-signup-form', event => {
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
            api.addUser(userData)
                .then(() => {
                    auth.login(userData.email, userData.password)
                    // loginUser({ email: userData.email, password: userData.password })
                .then(() => {
                        window.location.href = `./#clientDashboard`
                });
                // .then((response) => {
                //     window.localStorage.setItem('AUTH_TOKEN', response.authToken);
                // })
                // .then(() => {
                //     window.location.href = `./#clientDashboard`;
                // })
                })
        });
    }
    $(_handleClientSignupSubmit);

    ///////////////////////////////////////////
    //Provider Signup Screen
    ///////////////////////////////////////////
    function _displayProviderSignupForm() {
        $('#js-main').html(templates.providerSignupForm);
        new google.maps.places.Autocomplete((document.getElementById('streetAddress')), {
            types: ['geocode']
        });
    }
    function _handleProviderSignupSubmit() {
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
            api.addUser(userData)
                .then(() => {
                    auth.login(userData.email, userData.password)
                        .then(() => {
                            window.location.href = `./#providerDashboard`
                        });
                // .then(() => {
                //     loginUser({ email: userData.email, password: userData.password })
                //         .then((response) => {
                //             window.localStorage.setItem('AUTH_TOKEN', response.authToken);
                //             window.location.href = `./#providerDashboard`;
                //         })
                // })
            });
        })
    }
    $(_handleProviderSignupSubmit);

    ///////////////////////////////////////////
    //Client Dashboard
    ///////////////////////////////////////////
    function _displayClientDashboard(userData) {
        if (!userData) { userData = auth.getCurrentUser() };
        const clientHeader = _generateClientHeaderHTML(userData);
        const clientInfo = _generateClientInfoHTML(userData);
        const petsList = pets.generatePetsHTML(userData.pets);
        const tasksList = tasks.generateTasksHTML(userData.tasks);
        $('#js-main').html(`
        ${clientHeader}${clientInfo}
        <div class='petsList'>${petsList}</div>
        <a class='button' href='#addPet/${userData._id}'>Add Pet</a>
        <div id='js-tasks'>${tasksList}</div>
        <a class='button' href='#addTask/${userData._id}'>Add Task</a>
        `);
    }
    // Client Info
    function _generateClientInfoHTML(client) {
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
    ///////////////////////////////////////////
    // Client Header
    ///////////////////////////////////////////
    function _generateClientHeaderHTML(userData) {
        const nextVisit = userData.visits && userData.visits.length > 0
            ? `<p>Next Visit: ${visits.formatDate(userData.visits[0].startTime, userData.visits[0].endTime)}</p></div>`
            : `<p>No visits scheduled. <a href='#addVisit'>Add a visit</a></p>`;
        const clientDeleteButton = auth.isProvider()
            ? `<a class='buttonSmall' id='js-delete-client' href='#' data-id='${userData._id}'>Delete</a>`
            : '';
        return `
        <div class='clientHeader' data-id='${userData._id}'>
        ${clientDeleteButton}
        <a class='buttonSmall' href='#updateClient/${userData._id}'>Edit</a>
                <h2>${userData.firstName} ${userData.lastName}</h2>
                ${nextVisit}</div>`;
    }

    ///////////////////////////////////////////
    //Provider Dashboard
    ///////////////////////////////////////////
    function _displayProviderDashboard() {
        const providerData = auth.getCurrentUser();
        const recentVisitsHTML = providerData.visits && providerData.visits.length > 0
            ? visits.generateUpcomingVisitsHTML(providerData.visits)
            : `<p>No visits scheduled</p>`;
        const element = $(templates.providerDashboard);
        element.find('#js-visits-list').html(recentVisitsHTML);
        $('#js-main').html(element);
    }

    ///////////////////////////////////////////
    //Update Provider Screen
    ///////////////////////////////////////////
    function _displayProviderProfileUpdateForm() {
        const providerData = auth.getCurrentUser();
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
    function _handleProviderProfileUpdateSubmit() {
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
            _updateProviderAndDisplayAlertDialog(userData);
        }); 
    }
    $(_handleProviderProfileUpdateSubmit);
    function _updateProviderAndDisplayAlertDialog(userData) {
        api.updateUser(userData)
        .then(() => { window.location.href = `./#providerDashboard` })
        .catch(() => console.error('Error updating profile'));
    }

    ///////////////////////////////////////////
    //All Clients Screen
    ///////////////////////////////////////////
    function _displayAllClients() {
        providerData = auth.getCurrentUser();
        const clientsListHTML = providerData.clients && providerData.clients.length > 0
            ? _generateAllClientsHTML(providerData.clients)
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
    function _generateAllClientsHTML(clientsData) {
        const items = clientsData.map((item, index) => _generateClientItemHTML(item, index));  
        return items.join('');
    }
    function _generateClientItemHTML(client) {
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
    function _displayAddClientForm() {
        let createdClientId = '';
        const element = $(templates.clientSignupForm);
        element.find('#provider').data('id', auth.getCurrentUser()._id);
        element.find('#js-client-signup-form').attr('id', 'js-add-client-form');
        $('#js-main').html(element);
        new google.maps.places.Autocomplete((document.getElementById('streetAddress')), {
            types: ['geocode']
        });
    };
    function _handleAddClientSubmit() {
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
            api.addUser(userData)
            .then((response) => createdClientId = response._id)
            .then(() => auth.updateCurrentUser())
            .then(() => window.location.href = `./#clientDetail/${createdClientId}`)
        });
    }
    $(_handleAddClientSubmit);

    ///////////////////////////////////////////
    //Client Detail Screen
    ///////////////////////////////////////////
    function _displayClientDetail(clientId) {
        const providerData = auth.getCurrentUser();
        const clientIndex = providerData.clients.findIndex(client => client._id === clientId);
        return clientIndex >= 0
            ? _displayClientDashboard(providerData.clients[clientIndex], 'provider')
            : console.error('Client not found')
    }

    ///////////////////////////////////////////
    //Delete Client
    ///////////////////////////////////////////

    function _handleDeleteClient() {
        $('#js-main').on('click', '#js-delete-client', event => {
            event.preventDefault();
            const clientId = $(event.currentTarget).data('id');
            if (confirm('Delete client?')) {
                api.deleteClientsVisits(clientId)
                .then(() => api.deleteClient(clientId))
                .then(() => auth.updateCurrentUser())
                .then(() => _displayAlertDialog('Client Deleted'))
                .then(() => {
                    // _displayProviderDashboard();
                    _displayAllClients();
                })
            } else {
                alert('Action Cancelled');
            }
        })
    }
    $(_handleDeleteClient)
    
    ///////////////////////////////////////////
    //Update Client Profile Screen
    ///////////////////////////////////////////
    function _displayClientUpdateForm(clientId) {
        const userData = auth.getCurrentUser();
            if (auth.isProvider()) {
                const clientData = userData.clients.find(client => client._id === clientId);
                return clientData
                    ? _generateClientUpdateFormHTML(clientData)
                    : console.error('User not found')
            } else {
                return userData
                    ? _generateClientUpdateFormHTML(userData)
                    : console.error('User not found')
            }
    }
    function _generateClientUpdateFormHTML(clientData) {
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
    function _handleMyProfileUpdateSubmit() {
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
                _updateClientAndDisplayAlertDialog(userData);
            })
    }
    $(_handleMyProfileUpdateSubmit);
    function _updateClientAndDisplayAlertDialog(userData) {
        console.log('updating client');
        api.updateUser(userData)
        .then(_displayAlertDialog('Profile Updated'))
        .then(() => { window.history.back(); })
        .catch(() => console.error('Error updating profile'));
    }
    
    ///////////////////////////////////////////
    // Compact Site Header
    ///////////////////////////////////////////
    function _displayCompactSiteHeader() {
        return auth.isProvider()
            ? $('#js-header').html(templates.compactHeaderProvider)
            : $('#js-header').html(templates.compactHeaderClient);
    }

    ///////////////////////////////////////////
    // Full Site Header
    ///////////////////////////////////////////
    function _displayFullSiteHeader() {
        $('#js-header').html(templates.fullHeader);
    }
    
    ///////////////////////////////////////////
    //Dialogs
    ///////////////////////////////////////////
    function _displayAlertDialog(string) {
        alert(string);
        // window.history.back();
    }
    function _displayConfirmDialog(string) {
        confirm(string);
    }

    ///////////////////////////////////////////
    //Confirm Password
    ///////////////////////////////////////////
    function _handleConfirmPassword() {
        $('#js-main').on('keyup', '#password, #confirmPassword', function () {
            if ($('#password').val() == $('#confirmPassword').val()) {
                $('#message').html('Passwords match').css('color', 'green');
            } else
                $('#message').html('Passwords do not match').css('color', 'red');
        });
    }
    $(_handleConfirmPassword)

    return {
        displayProviderProfileUpdateForm: _displayProviderProfileUpdateForm,
        displayClientDetail: _displayClientDetail,
        displayAllClients: _displayAllClients,
        displayAddClientForm: _displayAddClientForm,
        displayProviderDashboard: _displayProviderDashboard,
        displayClientUpdateForm: _displayClientUpdateForm,
        displayClientDashboard: _displayClientDashboard,
        generateClientHeaderHTML: _generateClientHeaderHTML,
        displayCompactSiteHeader: _displayCompactSiteHeader,
        displayFullSiteHeader: _displayFullSiteHeader,
        displayAlertDialog: _displayAlertDialog,
        displayConfirmDialog: _displayConfirmDialog,
        displayProviderSignupForm: _displayProviderSignupForm,
        displayClientSignupForm: _displayClientSignupForm,
        displaySignupTypeForm: _displaySignupTypeForm,
        displayLoginForm: _displayLoginForm,
    };
})();