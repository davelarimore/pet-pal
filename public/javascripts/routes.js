///////////////////////////////////////////
//Client Routes
///////////////////////////////////////////
const router = new Navigo('/', true, '#!');

const checkLoggedIn = function (done) {
    if (!window.localStorage.getItem('AUTH_TOKEN')) {
        window.location.replace('./#login');
        common.displayFullSiteHeader();
        common.displayLoginForm();
        done(false);
    } else {
        return auth.updateCurrentUser()
            .then(() => done())
    }
}

//Public Routes
router
    .on({
        'signup': () => {
            common.displayFullSiteHeader();
            common.displaySignupTypeForm();
        },
        'providerSignup': () => {
            common.displayFullSiteHeader();
            common.displayProviderSignupForm();
        },
    });

//Authenticated Routes    
router.on(
    'login', () => {
        window.location.href = '/#dashboard';
    },
    { before: checkLoggedIn }
);
router.on(
    'dashboard', () => {
        if (auth.isProvider()) {
            common.displayCompactSiteHeader();
            common.displayProviderDashboard();
        } else {
            common.displayCompactSiteHeader();
            common.displayClientDashboard();
        }
    },
    { before: checkLoggedIn }
);
router.on(
    'updateClient/:userID', (params) => {
        common.displayCompactSiteHeader();
        common.displayClientUpdateForm(params.userID);
    },
    { before: checkLoggedIn }
);
router.on(
    'updateProvider', () => {
        common.displayCompactSiteHeader();
        common.displayProviderProfileUpdateForm();
    },
    { before: checkLoggedIn }
);
router.on(
    'addPet/:id', (params) => {
        common.displayCompactSiteHeader();
        pets.displayAndHandleAddPetForm(params.id)
    },
    { before: checkLoggedIn }
);
router.on(
    'pet/:id', (params) => {
        common.displayCompactSiteHeader();
        pets.displayPetDetail(params.id);
    },
    { before: checkLoggedIn }
);
router.on(
    'updatePet/:id', (params) => {
        common.displayCompactSiteHeader();
        pets.displayUpdatePetForm(params.id);
    },
    { before: checkLoggedIn }
);
router.on(
    'addTask/:id', (params) => {
        common.displayCompactSiteHeader();
        tasks.displayAndHandleAddTaskForm(params.id);
    },
    { before: checkLoggedIn }
);
router.on(
    'visits', () => {
        common.displayCompactSiteHeader();
        visits.displayAllVisits();
    },
    { before: checkLoggedIn }
);
router.on(
    'addVisit', () => {
        common.displayCompactSiteHeader();
        visits.displayAddVisitForm();
    },
    { before: checkLoggedIn }
);
router.on(
    'clients', () => {
        common.displayCompactSiteHeader();
        common.displayAllClients();
    },
    { before: checkLoggedIn }
);
router.on(
    'addClient', () => {
        common.displayCompactSiteHeader();
        common.displayAddClientForm();
    },
    { before: checkLoggedIn }
);
router.on(
    'clientDetail/:id', (params) => {
        common.displayCompactSiteHeader();
        common.displayClientDetail(params.id);
    },
    { before: checkLoggedIn }
);
router.on(
    'logout', () => {
        auth.logout();
        window.location.href = './#login';
    },
    { before: checkLoggedIn }
)
//Root Route, must be last
router.on(
    '', () => {
        window.location.href = '/#dashboard';
    },
    { before: checkLoggedIn }
)
.resolve()