///////////////////////////////////////////
//Client Routes
///////////////////////////////////////////
const router = new Navigo('localhost:8080', true, '#!');

const checkLoggedIn = function(done) {
    if (!window.localStorage.getItem('AUTH_TOKEN')) {
        window.location.replace('../');
        done(false);
    } else {
        auth.updateCurrentUser()
        .then(() => done())
    }
}

//public routes
router
    .on({
        'login': () => {
            displayFullSiteHeader();
            displayLoginForm();
        },
        'signup': () => {
            displayFullSiteHeader();
            displaySignupTypeForm();
        },
        'providerSignup': () => {
            displayFullSiteHeader();
            displayProviderSignupForm();
        },
    })
    .resolve();

//authenticated routes
router.on(
    'clientDashboard', () => {
        displayCompactSiteHeader();
        displayClientDashboard(auth.getCurrentUser());
    },
    { before: checkLoggedIn }
);
router.on(
    'providerDashboard', () => {
        displayCompactSiteHeader();
        displayProviderDashboard(auth.getCurrentUser());
    },
    { before: checkLoggedIn }
);
router.on(
    'updateClient/:userID', (params) => {
        displayCompactSiteHeader();
        getClientUserAndDisplayClientUpdateForm(params.userID);
    },
    { before: checkLoggedIn }
);
router.on(
    'updateProvider', () => {
        displayCompactSiteHeader();
        displayProviderProfileUpdateForm(auth.getCurrentUser());
    },
    { before: checkLoggedIn }
);
router.on(
    'addPet/:id', (params) => {
        displayCompactSiteHeader();
        pets.displayAndHandleAddPetForm(params.id)
    },
    { before: checkLoggedIn }
);
router.on(
    'pet/:id', (params) => {
        displayCompactSiteHeader();
        pets.displayPetDetail(params.id);
    },
    { before: checkLoggedIn }
);
router.on(
    'updatePet/:id', (params) => {
        displayCompactSiteHeader();
        pets.displayUpdatePetForm(params.id);
    },
    { before: checkLoggedIn }
);
router.on(
    'deletePet/:id', (params) => {
        pets.displayDeletePetConfirmation(params.id);
    },
    { before: checkLoggedIn }
);
router.on(
    'addTask/:id', (params) => {
        displayCompactSiteHeader();
        tasks.displayAndHandleAddTaskForm(params.id);
        // displayAndHandleAddTaskForm(params.id);
    },
    { before: checkLoggedIn }
);
router.on(
    'deleteTask/:id', (params) => {
        tasks.displayDeleteTaskConfirmation(params.id);
    },
    { before: checkLoggedIn }
);
router.on(
    'visits', () => {
        displayCompactSiteHeader();
        displayAllVisits(auth.getCurrentUser());   
    },
    { before: checkLoggedIn }
);
router.on(
    'addVisit', () => {
        displayCompactSiteHeader();
        displayAddVisitForm(auth.getCurrentUser());
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
        displayCompactSiteHeader();
        displayAllClients(auth.getCurrentUser());   
    },
    { before: checkLoggedIn }
);
router.on(
    'addClient', () => {
        displayCompactSiteHeader();
        displayAddClientForm(auth.getCurrentUser());   
    },
    { before: checkLoggedIn }
);
router.on(
    'clientDetail/:id', (params) => {
        displayCompactSiteHeader();
        displayClientDetail(auth.getCurrentUser(), params.id);  
    },
    { before: checkLoggedIn }
);
router.on(
    'deleteClient/:id', (params) => {
        displayDeleteClientConfirmation(params.id);  
    },
    { before: checkLoggedIn }
);
router.on(
    'logout', () => {
        console.log('loggin out');
        auth.logout();
        window.location.href = './';
    },
    { before: checkLoggedIn }
);