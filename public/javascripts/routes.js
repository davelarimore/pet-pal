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
            users.displayFullSiteHeader();
            users.displayLoginForm();
        },
        'signup': () => {
            users.displayFullSiteHeader();
            users.displaySignupTypeForm();
        },
        'providerSignup': () => {
            users.displayFullSiteHeader();
            users.displayProviderSignupForm();
        },
    })
    .resolve();

//authenticated routes
router.on(
    'clientDashboard', () => {
        users.displayCompactSiteHeader();
        users.displayClientDashboard();
    },
    { before: checkLoggedIn }
);
router.on(
    'providerDashboard', () => {
        users.displayCompactSiteHeader();
        users.displayProviderDashboard();
    },
    { before: checkLoggedIn }
);
router.on(
    'updateClient/:userID', (params) => {
        users.displayCompactSiteHeader();
        users.displayClientUpdateForm(params.userID);
    },
    { before: checkLoggedIn }
);
router.on(
    'updateProvider', () => {
        users.displayCompactSiteHeader();
        users.displayProviderProfileUpdateForm();
    },
    { before: checkLoggedIn }
);
router.on(
    'addPet/:id', (params) => {
        users.displayCompactSiteHeader();
        pets.displayAndHandleAddPetForm(params.id)
    },
    { before: checkLoggedIn }
);
router.on(
    'pet/:id', (params) => {
        users.displayCompactSiteHeader();
        pets.displayPetDetail(params.id);
    },
    { before: checkLoggedIn }
);
router.on(
    'updatePet/:id', (params) => {
        users.displayCompactSiteHeader();
        pets.displayUpdatePetForm(params.id);
    },
    { before: checkLoggedIn }
);
router.on(
    'addTask/:id', (params) => {
        users.displayCompactSiteHeader();
        tasks.displayAndHandleAddTaskForm(params.id);
    },
    { before: checkLoggedIn }
);
router.on(
    'visits', () => {
        users.displayCompactSiteHeader();
        visits.displayAllVisits();   
    },
    { before: checkLoggedIn }
);
router.on(
    'addVisit', () => {
        users.displayCompactSiteHeader();
        visits.displayAddVisitForm();
    },
    { before: checkLoggedIn }
);
router.on(
    'clients', () => {
        users.displayCompactSiteHeader();
        users.displayAllClients();   
    },
    { before: checkLoggedIn }
);
router.on(
    'addClient', () => {
        users.displayCompactSiteHeader();
        users.displayAddClientForm();   
    },
    { before: checkLoggedIn }
);
router.on(
    'clientDetail/:id', (params) => {
        users.displayCompactSiteHeader();
        users.displayClientDetail(params.id);  
    },
    { before: checkLoggedIn }
);
router.on(
    'logout', () => {
        auth.logout();
        window.location.href = './';
    },
    { before: checkLoggedIn }
);