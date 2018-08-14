///////////////////////////////////////////
//Client Routes
///////////////////////////////////////////
const router = new Navigo('localhost:8080', true, '#!');

const checkLoggedIn =  function(done, params) {
    if (!window.localStorage.getItem('AUTH_TOKEN')) {
        window.location.replace('../');
        done(false);
    } else {
        done()
    }
}

router.on(
    'clientDashboard', () => {
        displayCompactSiteHeader('client');
        getMeAndDisplayClientDashboard();
    },
    { before: checkLoggedIn }
);
router.on(
    'providerDashboard', () => {
        displayCompactSiteHeader('provider');
        getMeAndDisplayProviderDashboard();
    },
    { before: checkLoggedIn }
);
router.on(
    'updateClient/:userID', (params) => {
        displayCompactSiteHeader('client');
        getClientUserAndDisplayClientUpdateForm(params.userID);
    },
    { before: checkLoggedIn }
);
router.on(
    'updateProvider', () => {
        displayCompactSiteHeader('provider');
        getProviderUserAndDisplayUpdateForm();
    },
    { before: checkLoggedIn }
);
router.on(
    'addPet/:id', (params) => {
        displayAndHandleAddPetForm(params.id)
    },
    { before: checkLoggedIn }
);
router.on(
    'pet/:id', (params) => {
        getPetAndDisplayPetDetail(params.id);
    },
    { before: checkLoggedIn }
);
router.on(
    'updatePet/:id', (params) => {
        getPetAndDisplayUpdateForm(params.id);
    },
    { before: checkLoggedIn }
);
router.on(
    'deletePet/:id', (params) => {
        displayDeletePetConfirmation(params.id);
    },
    { before: checkLoggedIn }
);
router.on(
    'addTask/:id', (params) => {
        displayAndHandleAddTaskForm(params.id);
    },
    { before: checkLoggedIn }
);
router.on(
    'deleteTask/:id', (params) => {
        displayDeleteTaskConfirmation(params.id);
    },
    { before: checkLoggedIn }
);
router.on(
    'visits', () => {
        displayCompactSiteHeader('provider');
        getAndDisplayAllVisits();   
    },
    { before: checkLoggedIn }
);
router.on(
    'addVisit', (params) => {
        getMyClientsAndDisplayAddVisitForm();
    },
    { before: checkLoggedIn }
);
router.on(
    'deleteVisit/:id', (params) => {
        displayDeleteVisitConfirmation(params.id);
    },
    { before: checkLoggedIn }
);
router.on(
    'clients', () => {
        displayCompactSiteHeader('provider');
        getAndDisplayAllClients();   
    },
    { before: checkLoggedIn }
);
router.on(
    'addClient', () => {
        displayCompactSiteHeader('provider');
        displayAddClientForm();   
    },
    { before: checkLoggedIn }
);
router.on(
    'clientDetail/:id', (params) => {
        displayCompactSiteHeader('provider');
        getClientAndDisplayClientDetail(params.id);  
    },
    { before: checkLoggedIn }
);

//public routes
router
    .on({
        'login': () => {
            displayLoginForm();
            handleLoginSubmit();
        },
        'logout': () => {
            // auth.logout();
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
    })
    .resolve();