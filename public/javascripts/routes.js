///////////////////////////////////////////
//Client Routes
///////////////////////////////////////////
const router = new Navigo('localhost:8080', true, '#!');

router
    .on({
        'login': () => {
            displayLoginForm();
            handleLoginSubmit();
        },
        'signup': () => {
            displaySignupTypeForm();
            handleSignupTypeSubmit();
        },
        'providerSignup': () => {
            console.log('Handling provider signup button');
            displayProviderSignupForm();
            handleProviderSignupSubmit();
        },
        'clientDashboard': () => {
            // checkForToken(); if exists and isn't expired, use navigo hooks
            displayCompactSiteHeader();
            getMeAndDisplayClientDashboard();
        },
        'providerDashboard': () => {
            displayCompactSiteHeader();
            getVisitsAndDisplayProviderDashboard();
        },
        'addClient': () => {
            displayClientSignupForm();
        },
        'updateClient/:userID': (params) => {
            displayCompactSiteHeader();
            getClientUserAndDisplayClientUpdateForm(params.userID);
        },
        'updateProvider/:userID': (params) => {
            displayCompactSiteHeader();
            getProviderUserAndDisplayUpdateForm(params.userID);
        },
        'pet/add': () => {
            console.log("Getting update my pet form");
            displayAndHandleAddMyPetForm();
            },
        'pet/:id': (params) => {
            getMyPetAndDisplayPetDetail(params.id);
        },
        'pet/:petID/:action': (params) => {
            displayCompactSiteHeader();
            if (params.action === 'delete') {
                displayDeleteMyPetConfirmation(params.petID);
            }
            else if (params.action === 'update') {
                getMyPetAndDisplayUpdateForm(params.petID);
            }
        },
        'user/:userID/pet/:petID/:action': (params) => {
            displayCompactSiteHeader();
            if (params.action === 'add') {
                displayAndHandleAddClientPetForm(params.userID);
            }
            else if (params.action === 'delete') {
                displayDeleteClientPetConfirmation(params.petID);
            }
            else if (params.action === 'update') {
                getClientsPetAndDisplayUpdateForm(params.petID);
            }
            else {
                getClientsPetAndDisplayPetDetail(params.petID);
            }
        },
        'task/add': () => {
            displayAndHandleAddMyTaskForm();
        },
        'user/:userID/task/:taskID/:action': (params) => {
            displayCompactSiteHeader();
            if (params.action === 'add') {
                displayAddClientTaskForm(params.userID);
            }
            else if (params.action === 'delete') {
                displayDeleteMyTaskConfirmation(params.taskID);
            }
        },
        'user/:userID/visit/:visitID/:action': (params) => {
            displayCompactSiteHeader();
            if (params.action === 'add') {
                getMyClientsAndDisplayAddVisitForm(params.userID);
            }
            else if (params.action === 'delete') {
                displayDeleteVisitConfirmation(params.visitID);
            }
        },
        'user/:userID/visits': (params) => {
            displayCompactSiteHeader();
            getAndDisplayAllVisits(params.userID);
        },
        'user/:userID/clients': (params) => {
            displayCompactSiteHeader();
            getAndDisplayAllClients(params.userID);
        },
        //click from client list
        'user/:userID/clientDetail': (params) => {
            displayCompactSiteHeader();
            getClientUserAndDisplayClientDashboard(params.userID);
        },
    })
    .resolve();