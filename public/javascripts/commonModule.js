const common = (function () {

    ///////////////////////////////////////////
    //Login screen
    ///////////////////////////////////////////
    function _displayLoginForm() {
        auth.logout();
        $('#js-main').removeClass('dark');
        $('#js-header').find('h1').remove();
        $('#js-main').html(templates.loginForm);
    }
    function _handleLoginSubmit() {
        $('#js-main').on('submit', '#js-login-form', event => {
            event.preventDefault();
            const email = $(event.currentTarget).find('#email').val();
            const password = $(event.currentTarget).find('#password').val();
            auth.login(email, password)
                .then(() => {
                    window.location.replace('/#dashboard');
                })
                .catch(() => {
                    _displayAlertDialog('Login Error', 'Incorrect email or password.')
                })
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
                $('#js-header').find('h1').remove();
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
                        .then(() => {
                            window.location.href = `./#dashboard`
                        })
                })
                // .catch(() => {
                //     _displayAlertDialog('Sign Up Error', `There is already an account for ${userData.email}`)
                // });
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
                            window.location.href = `./#dashboard`
                        })
                })
                // .catch(() => {
                //     _displayAlertDialog('Sign Up Error', `There is already an account for ${userData.email}`)
                // });
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
        $('#js-main').addClass('dark');
        $('#js-main').html(`
        ${clientHeader}${clientInfo}
        <div class='boxed'><div class='petsList'>${petsList}</div></div>
        <a class='button' href='#addPet/${userData._id}'>Add Pet</a>
        <div class='boxed' id='js-tasks'>${tasksList}</div>
        <a class='button' href='#addTask/${userData._id}'>Add Task</a>
        `);
    }
    // Client Info
    function _generateClientInfoHTML(client) {
        let entryNote = '';
        let vetInfo = '';
        if (client.entryNote) { entryNote = `<p>${client.entryNote}</p>` }
        else { entryNote = `<p class='notFound'><span>No special entry notes</span></p>` };
        if (client.vetInfo) { vetInfo = `<p>${client.vetInfo}</p>` }
        else { vetInfo = `<p class='notFound'><span>No veterinarian specified</span></p>` };
        return `
        <div class='boxed'><a class='boxedInfoItem' href='tel:${client.phone}'>
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
                <div class='boxedInfoItem'>
                    <img src='images/house.svg' alt='Entry Note'>
                    ${entryNote}
                </div>           
                <div class='boxedInfoItem'>
                    <img src='images/vet.svg' alt='Veterinarian'>
                    ${vetInfo}
                </div></div>`;
    }
    ///////////////////////////////////////////
    // Client Header
    ///////////////////////////////////////////
    function _generateClientHeaderHTML(userData) {
        if (auth.isProvider()) {
            const nextVisit = userData.visits && userData.visits.length > 0
                ? `<p>Next Visit: ${visits.formatDate(userData.visits[0].startTime, userData.visits[0].endTime)}</p>`
                : `<p><span>No visits scheduled.</span>&nbsp;&nbsp;<a href='#addVisit'>Add a visit</a></p>`;
            return `<div class='myClientHeader' data-id='${userData._id}'>
                <div class='myClientHeaderInfo'>
                <h1><a href='#clientDetail/${userData._id}'>${userData.firstName} ${userData.lastName}</a></h1>
                ${nextVisit}
                </div>
                <div class='myClientHeaderButtons'>
                <a class='button' href='#updateClient/${userData._id}'>Edit</a>
                <a class='buttonGhost' id='js-delete-client' href='#' data-id='${userData._id}'>Delete</a>  
                </div>
                </div>`;
        } else {
            const nextVisit = userData.visits && userData.visits.length > 0
                ? `<p>Next Visit: ${visits.formatDate(userData.visits[0].startTime, userData.visits[0].endTime)}</p>`
                : `<p><span>No visits scheduled.</span></p>`;
            return `<div class='clientHeader' data-id='${userData._id}'>
                <div class='clientHeaderInfo'>
                <h1>${userData.firstName} ${userData.lastName}</h1>
                ${nextVisit}
                </div>
                <div class='clientHeaderButtons'>
                <a class='button' href='#updateClient/${userData._id}'>Edit</a>
                </div>
                </div>`;
        }
    }

    ///////////////////////////////////////////
    // Provider Header
    ///////////////////////////////////////////
    function _generateProviderHeaderHTML(userData) {
        return `
        <div class='providerHeader'>
            <div class='providerHeaderInfo'>
                <h1>${userData.companyName}</h1>
                <p>${userData.firstName} ${userData.lastName}</p>
            </div>
            <div class='providerHeaderButtons'>
                <a class='button' id='js-update-profile-button' href='#updateProvider'>Edit</a>
            </div>
        </div>`;
    }

    ///////////////////////////////////////////
    //Provider Dashboard
    ///////////////////////////////////////////
    function _displayProviderDashboard() {
        let upcomingVisitsHTML = '';
        const providerData = auth.getCurrentUser();
        const providerHeader = _generateProviderHeaderHTML(providerData);
        $('#js-main').html(providerHeader);
        $('#js-main').addClass('dark');
        const element = $(templates.providerDashboard);
        $('#js-main').append(element);
        if (providerData.visits && providerData.visits.length > 0) {
            const nextVisitDate = visits.formatNextDate(providerData.visits[0].startTime);
            $('#js-main').find('h2').html(`Visits for ${nextVisitDate}:`);
            visits.getNextDaysLocations(providerData)
                .then((upcomingVisitLocations) => {
                    upcomingVisitsHTML = visits.generateUpcomingVisitsHTML(providerData.visits);
                    $('#js-visits-list').html(upcomingVisitsHTML)
                    visits.mapUpcomingVisits(upcomingVisitLocations)
                });
        } else {
            $('#js-visits-list').html(`<p class='noVisit'>No visits scheduled</p>`);
        }
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
        element.find('fieldset').append(`<a class='buttonGhost' href='#/dashboard'>Cancel</a>`);
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
            .then(() => {
                window.location.href = `./#dashboard`;
                common.displayAlertDialog('Profile updated');
            })
            // .catch(() => console.error('Error updating profile'));
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
                <div class='listItemInfo'>
                    <h3>${client.firstName} ${client.lastName}</h3>
                    <p>${client.addressString}</p>
                </div>
                    <img src='images/arrow.svg' title='View Client' alt='View Client' />
                </div></a>`;
    }

    ///////////////////////////////////////////
    //Add Client Screen
    ///////////////////////////////////////////
    function _displayAddClientForm() {
        const element = $(templates.clientSignupForm);
        element.find('h2').text('Add Client');
        element.find('#provider').data('id', auth.getCurrentUser()._id);
        element.find('#js-client-signup-form').attr('id', 'js-add-client-form');
        element.find('#firstName').attr('placeholder', 'Client first name');
        element.find('#lastName').attr('placeholder', 'Client last name');
        element.find('#email').attr('placeholder', 'Client email');
        element.find('#phone').attr('placeholder', 'Client phone');
        element.find('#streetAddress').attr('placeholder', 'Client street address');
        element.find('#vetInfo').attr('placeholder', "Client's veterinarian");
        element.find('#confirmPassword').attr('placeholder', 'Confirm client password');
        element.find('fieldset').append(`
            <a class='buttonGhost' href='./#clients'>Cancel</a>`
        )
        $('#js-main').html(element);
        new google.maps.places.Autocomplete((document.getElementById('streetAddress')), {
            types: ['geocode']
        });
    };
    function _handleAddClientSubmit() {
        let createdClientId = '';
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
            common.displayConfirmDialog('Delete client?',
                () => { _deleteClient(clientId) }
            )
        })
    }
    $(_handleDeleteClient)

    function _deleteClient(clientId) {
        api.deleteClientsVisits(clientId)
            .then(() => api.deleteClient(clientId))
            .then(() => auth.updateCurrentUser())
            .then(() => {
                _displayAllClients();
                _displayAlertDialog('Client Deleted');
            })
    }

    ///////////////////////////////////////////
    //Update Client Profile Screen
    ///////////////////////////////////////////
    function _displayClientUpdateForm(clientId) {
        const userData = auth.getCurrentUser();
        let cancelURL = '';
        if (auth.isProvider()) {
            const clientData = userData.clients.find(client => client._id === clientId);
            cancelURL = `/#clientDetail/${clientId}`
            return clientData
                ? _generateClientUpdateFormHTML(clientData, cancelURL)
                : console.error('User not found')
        } else {
            cancelURL = `/#dashboard`;
            return userData
                ? _generateClientUpdateFormHTML(userData, cancelURL)
                : console.error('User not found')
        }
    }
    function _generateClientUpdateFormHTML(clientData, cancelURL) {
        const element = $(templates.clientSignupForm);
        element.find('#js-client-signup-form').attr('id', 'js-client-update-form');
        element.find('h2').text('Update Client Profile');
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
        element.find('fieldset').append(`<a class='buttonGhost' href='${cancelURL}'>Cancel</a>`);
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
        api.updateUser(userData)
            .then(() => auth.updateCurrentUser())
            .then(() => {
                if (auth.isProvider()) {
                    window.location.href = `./#clientDetail/${userData._id}`;
                    common.displayAlertDialog('User updated');
                } else {
                    window.location.href = `./#dashboard`;
                    common.displayAlertDialog('Profile updated');
                }
            })
            // .catch(() => console.error('Error updating profile'));
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
    function _displayConfirmDialog(message, yesCallback, noCallback) {
        const confirmHTML = `
            <h2>${message}</h2>
            <button class='button confirm'>OK</button>
            <button class='buttonGhost cancel'>Cancel</button>`
        $('.md-content').html(confirmHTML);
        $('.md-modal').addClass('md-show');
        $('.confirm').on('click', function () {
            $('.md-modal').removeClass('md-show');
            $('.md-content').html('');
            yesCallback();
        });
        $('.cancel').on('click', function () {
            $('.md-modal').removeClass('md-show');
            $('.md-content').html('');
            if (typeof noCallback === 'function' && noCallback()) {
                noCallback();
            }
        });
    }

    function _displayAlertDialog(title, message, button) {
        let messageHTML = '';
        if (message) { messageHTML = `<p>${message}</p>` };
        const alertHTML = `
            <h2>${title}</h2>
            ${messageHTML}
            <button class='button close'>${button || 'OK'}</button>`
        $('.md-content').html(alertHTML);
        $('.md-modal').addClass('md-show');
        $('.close').on('click', function () {
            $('.md-modal').removeClass('md-show');
            $('.md-content').html('');
        });
    }

    ///////////////////////////////////////////
    //Confirm Password
    ///////////////////////////////////////////
    function _handleConfirmPassword() {
        $('#js-main').on('keyup', '#password, #confirmPassword', function () {
            if ($('#password').val() == $('#confirmPassword').val()) {
                $('#message').html('Passwords match').css('color', 'rgb(100, 200, 100)');
            } else
                $('#message').html('Passwords do not match').css('color', 'rgb(255, 80, 80)');
        });
    }
    $(_handleConfirmPassword)

    return {
        displayProviderProfileUpdateForm: _displayProviderProfileUpdateForm,
        displayClientDetail: _displayClientDetail,
        displayAllClients: _displayAllClients,
        displayAddClientForm: _displayAddClientForm,
        generateProviderHeaderHTML: _generateProviderHeaderHTML,
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