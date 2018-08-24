///////////////////////////////////////////
//Client Routes
///////////////////////////////////////////
const router = new Navigo(null, false);

const checkLoggedIn = function(done) {
    console.log('checking logged in');
    console.log(window.localStorage.getItem('AUTH_TOKEN'));
    if (!window.localStorage.getItem('AUTH_TOKEN')) {
        // window.location.replace('./login');
        router.navigate('./login');
        // window.location.href = '../';
        done(false);
    } else {
        return auth.updateCurrentUser()
        .then(() => done())
    }
}

//public routes
router
    .on({
        'login': () => {
            common.displayFullSiteHeader();
            common.displayLoginForm();
        },
        'signup': () => {
            common.displayFullSiteHeader();
            common.displaySignupTypeForm();
        },
        'providerSignup': () => {
            common.displayFullSiteHeader();
            common.displayProviderSignupForm();
        },
    })

//authenticated routes
router.on(
    'clientDashboard', () => {
        common.displayCompactSiteHeader();
        common.displayClientDashboard();
    },
    { before: checkLoggedIn }
);
router.on(
    'providerDashboard', () => {
        common.displayCompactSiteHeader();
        common.displayProviderDashboard();
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
        router.navigate('./login');
        // window.location.href = './';
    },
    { before: checkLoggedIn }
)
// .resolve();

router.on(function () {
    console.log('root route');
        if (auth.isProvider()) {
            console.log('getting prov dash');
            router.navigate('./providerDashboard');
            // window.location.replace('../providerDashboard');
        } else {
            router.navigate('./clientDashboard');
            // window.location.replace('../clientDashboard');
        }
},
    { before: checkLoggedIn }
)
.resolve();