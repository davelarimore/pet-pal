///////////////////////////////////////////
//Client Routes
///////////////////////////////////////////
const router = new Navigo('localhost:8080', true, '#!');

// For all routes
// router.hooks({
//     before: function (done, params) {
//         if (!window.localStorage.getItem('AUTH_TOKEN')) {
//             console.log('Not logged in');
//             window.location.replace('../');
//             done(false);
//         }
//         else {
//             done();
//         }
//     },
// });

router.on(
    'clientDashboard',
    function () {
        displayCompactSiteHeader('client');
        getMeAndDisplayClientDashboard();
    },
    {
        before: function (done, params) {
            if (!window.localStorage.getItem('AUTH_TOKEN')) {
                window.location.replace('../');
                done(false);
            } else {
                done()
            }
        }
    }
);

router
    .on({
        'login': () => {
            displayLoginForm();
            handleLoginSubmit();
        },
        'logout': () => {
            logout();
            window.location.replace('../');
        },
        'signup': () => {
            displaySignupTypeForm();
            handleSignupTypeSubmit();
        },
        'providerSignup': () => {
            displayProviderSignupForm();
            handleProviderSignupSubmit();
        },
        // 'clientDashboard': () => {
        //     // checkForToken(); if exists and isn't expired, use navigo hooks
        //     displayCompactSiteHeader('client');
        //     getMeAndDisplayClientDashboard();
        // },
        'providerDashboard': () => {
            displayCompactSiteHeader('provider');
            getMeAndDisplayProviderDashboard();
        },
        'addClient': () => {
            displayClientSignupForm();
        },
        'updateClient/:userID': (params) => {
            displayCompactSiteHeader('client');
            getClientUserAndDisplayClientUpdateForm(params.userID);
        },
        'updateProvider': () => {
            displayCompactSiteHeader('provider');
            getProviderUserAndDisplayUpdateForm();
        },
        'pet/add': () => {
            console.log("Getting update my pet form");
            displayAndHandleAddMyPetForm();
            },
        'pet/:id': (params) => {
            getMyPetAndDisplayPetDetail(params.id);
        },
        'pet/:petID/:action': (params) => {
            if (params.action === 'delete') {
                displayDeleteMyPetConfirmation(params.petID);
            }
            else if (params.action === 'update') {
                getMyPetAndDisplayUpdateForm(params.petID);
            }
        },
        'user/:userID/pet/:petID/:action': (params) => {
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
            if (params.action === 'add') {
                displayAddClientTaskForm(params.userID);
            }
            else if (params.action === 'delete') {
                displayDeleteMyTaskConfirmation(params.taskID);
            }
        },
        'visits': () => {
            displayCompactSiteHeader('provider');
            getAndDisplayAllVisits();
        },
        'visits/add': () => {
            getMyClientsAndDisplayAddVisitForm();
        },
        'visits/:id/delete': (params) => {
                displayDeleteVisitConfirmation(params.id);
        },
        'clients': () => {
            displayCompactSiteHeader('provider');
            getAndDisplayAllClients();
        },
        'clients/add': () => {
            displayCompactSiteHeader('provider');
            displayAddClientForm();
        },
        //click from client list
        'user/:userID/clientDetail': (params) => {
            displayCompactSiteHeader('provider');
            getClientUserAndDisplayClientDashboard(params.userID);
        },
    })
    .resolve();