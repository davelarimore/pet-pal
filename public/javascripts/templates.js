const templates = {
    signupTypeForm: `
        <p>Please select your pet care provider to continue</p>
            <form id="js-signup-type-form">
                <fieldset name="chooseProvider">
                    <label for="provider" class="visuallyhidden">Pet Care Provider</label>
                    <select id="js-provider-list" name="provider" type="select" id="provider" title="Pet Care Provider" required>
                        <option value="" disabled selected hidden>Pet care provider</option>
                    </select>
                    <input type="submit" value="Continue" class="button">
                </fieldset>
            </form>
        <a href="./#providerSignup">Pet Care Provider Sign Up</a>`,
    clientSignupForm: `
        <div class="boxed">
        <h2>Create an account</h2>
        <form id="js-client-signup-form">
            <fieldset name="clientSignup">
                <input type="hidden" id="provider" title="Provider ID"></input>
                <input type="hidden" id="clientId" title="Client ID"></input> 
                <label for="firstName" class="visuallyhidden">First Name*</label>
                <input type="text" id="firstName" title="First Name" placeholder="First Name" required></input>
                <label for="lastName" class="visuallyhidden">Last Name*</label>
                <input type="text" id="lastName" title="Last Name" placeholder="Last Name" required></input>
                <label for="email" class="visuallyhidden">Email*</label>
                <input type="email" id="email" title="Email Address" placeholder="Email" required></input>
                <label for="phone" class="visuallyhidden">Phone*</label>
                <input type="text" id="phone" title="Phone Number" placeholder="Phone" required></input>
                <label for="streetAddress" class="visuallyhidden">Street Address*</label>
                <input type="text" id="streetAddress" title="Street Address" placeholder="Address" required></input>
                <label for="entryNote" class="visuallyhidden">Entry Note</label>
                <input type="text" id="entryNote" title="Entry Note" placeholder="Entry Note"></input>
                <label for="vetInfo" class="visuallyhidden">Veterinarian Name</label>
                <input type="text" id="vetInfo" title="Veterinarian Name" placeholder="Veterinarian Name"></input>
                <label for="password" class="visuallyhidden">Password*</label>
                <input type="password" pattern=".{6,10}" id="password" title="Password must be 6-10 characters" placeholder="Password" required></input>
                <label for="confirmPassword" class="visuallyhidden">Confirm Password*</label>
                <input type="password" id="confirmPassword" title="Confirm Password" placeholder="Confirm Password" required></input>
                <p id="message"></p>
                <input type="submit" value="Submit" class="button">
            </fieldset>
        </form>
        </div>`,
    providerSignupForm: `
        <div class="boxed">
        <h2>Create an account</h2>
        <form id="js-provider-signup-form">
            <fieldset name="providerSignup">
                <input type="hidden" id="providerId" title="Provider ID"></input>
                <label for="companyName" class="visuallyhidden">Company Name*</label>
                <input type="text" id="companyName" title="Company Name" placeholder="Company Name" required></input>
                <label for="firstName" class="visuallyhidden">First Name*</label>
                <input type="text" id="firstName" title="First Name" placeholder="First Name" required></input>
                <label for="lastName" class="visuallyhidden">Last Name*</label>
                <input type="text" id="lastName" title="Last Name" placeholder="Last Name" required></input>
                <label for="email" class="visuallyhidden">Email*</label>
                <input type="email" id="email" title="Email Address" placeholder="Email" required></input>
                <label for="phone" class="visuallyhidden">Phone*</label>
                <input type="text" id="phone" title="Phone Number" placeholder="Phone" required></input>
                <label for="streetAddress" class="visuallyhidden">Street Address*</label>
                <input type="text" id="streetAddress" title="Street Address" placeholder="Address" required></input>
                <label for="password" class="visuallyhidden">Password*</label>
                <input type="password" pattern=".{6,10}" id="password" title="Password must be 6-10 characters" placeholder="Password" required></input>
                <label for="confirmPassword" class="visuallyhidden">Confirm Password*</label>
                <input type="password" id="confirmPassword" title="Confirm Password" placeholder="Confirm Password" required></input>
                <p id="message"></p>
                <input type="submit" value="Submit" class="button">
            </fieldset>
        </form>
        </div>`,
    loginForm: `<div class="boxed">
        <h1>Login</h1>
        <form id="js-login-form">
            <fieldset name="login">
                <label for="email" class="visuallyhidden">Email</label>
                <input type="email" id="email" title="Email address" placeholder="Email" required></input>
                <label for="password" class="visuallyhidden">Pasword</label>
                <input type="password" id="password" title="Password" placeholder="Password" required></input>
                <input type="submit" value="Submit" class="button">
            </fieldset>
        </form>
        </div>`,
    compactHeaderClient: `
        <div class="compactHeader">
        <a href="#logout" class="navLink">Logout</a>
        <a href="#clientDashboard" class="navLink">Dashboard</a>
        <a href="#clientDashboard">
                <img src="images/logo.svg" alt="Pet Pal">
            </a>
            <h1>Pet Pal</h1>
        </div>`,
    compactHeaderProvider: `
        <div class="compactHeader">
        <a href="#logout" class="navLink">Logout</a>
        <a href="#clients" class="navLink">Clients</a>
        <a href="#visits" class="navLink">Visits</a>
        <a href="#providerDashboard" class="navLink">Dashboard</a>
        <a href="#providerDashboard">
                <img src="images/logo.svg" alt="Pet Pal">
            </a>
            <h1>Pet Pal</h1>
        </div>`,
    addPetForm: `
        <div class="boxed">
            <h2>Add a Pet</h2>
            <form id="js-add-pet-form">
                <fieldset name="addPet">
                    <input type="hidden" id="clientId" title="Client ID"></input> 
                    <input type="hidden" id="_id" title="Pet ID"></input> 
                    <label for="petName" class="visuallyhidden">Name</label>
                    <input type="text" id="petName" title="Pet Name" placeholder="Name" required></input>                  
                    <label for="petType" class="visuallyhidden">Type</label>
                        <select id="petType" title="Pet Type" required>
                            <option value="" disabled selected hidden>Type</option>
                            <option value="Dog">Dog</option>
                            <option value="Cat">Cat</option>
                            <option value="Bird">Bird</option>
                            <option value="Fish">Fish</option>
                            <option value="Reptile">Reptile</option>
                            <option value="Amphibian">Amphibian</option>
                            <option value="Rodent">Rodent</option>
                            <option value="Other">Other</option>
                        </select> 
                    <label for="petBreed" class="visuallyhidden">Breed</label>
                    <input type="text" id="petBreed" title="Breed" placeholder="Breed"></input>
                    <label for="petColor" class="visuallyhidden">Color</label>
                    <input type="text" id="petColor" title="Color" placeholder="Color"></input>
                    <label for="petFood" class="visuallyhidden">Food</label>
                    <input type="text" id="petFood" title="Food" placeholder="Food"></input>
                    <input type="submit" value="Submit" class="button" placeholder="">
                </fieldset>
            </form>
        </div>`,
    addTaskForm: `
        <div class="boxed">
        <h2>Add a Task</h2>
        <form id="js-add-task-form">
            <fieldset name="addTask">
                <input type="hidden" id="clientId" title="Client ID"></input> 
                <label for="taskDescription" class="visuallyhidden">Description</label>
                <input type="text" id="taskDescription" title="Task Description" placeholder="Description" required></input>                  
                <input type="submit" value="Submit" class="button">
            </fieldset>
        </form>
        </div>`,
    providerDashboard: `
        <div class="boxed">
        <h2>Upcoming Visits</h2>
        <div id="js-visits-list"></div>
        <a class="buttonSmall" id="js-all-visits-button" href="#visits">View All</a>
        <a class="buttonSmall" id="js-add-visit-button" href="#addVisit">Add</a>
        </div>
        <div class="boxed">
        <h2>Clients</h2>
        <a class="buttonSmall" id="js-all-clients-button" href="#clients">View All</a>
        <a class="buttonSmall" id="js-add-client-button" href="#addClient">Add</a>
        </div>`,
    addVisitForm: `
        <div class="boxed">
        <h2>Add a Visit</h2>
        <form id="js-add-visit-form">
            <fieldset name="addVisit">
                <input type="hidden" id="provider" title="Provider ID"></input> 
                <label for="client" class="visuallyhidden">Client</label>
                    <select id="js-client-list" title="Client" required>
                        <option value="" disabled selected hidden>Client</option>
                    </select>
                <label for="startTime" class="visuallyhidden">Start Time</label>
                <input type="text" id="startTime" title="Start Time" placeholder="Start Time" autocomplete="off" required></input>
                <label for="endTime" class="visuallyhidden">End Time</label>
                <input type="text" id="endTime" title="End Time" placeholder="End Time" autocomplete="off" required></input>
                <input type="submit" value="Submit" class="button" placeholder="">
            </fieldset>
        </form>
        </div>`,
    fullHeader: `<div class="fullHeader">
            <a href="index.html">
                <img src="images/logo.svg" alt="Pet Pal">
            </a>
            <h1>Pet Pal</h1>
            <p>Pet Pal allows pet care providers and their clients to share and update their information</p>
        </div>`
}