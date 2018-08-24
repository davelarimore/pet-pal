const templates = {
    signupTypeForm: `
        <p class="tagline">Please select your pet care provider to continue</p>
            <form id="js-signup-type-form">
                <fieldset name="chooseProvider">
                    <label for="provider" >Pet Care Provider*</label>
                    <select id="js-provider-list" name="provider" type="select" id="provider" title="Pet Care Provider" required>
                        <option value="" disabled selected hidden>Pet care provider</option>
                    </select>
                    <input type="submit" value="Continue" class="button">
                </fieldset>
            </form>
        <p><a href="./#providerSignup">Pet Care Provider Sign Up</a></p>`,
    clientSignupForm: `
        <div class="boxed">
        <h2>Sign Up</h2>
        <form id="js-client-signup-form">
            <fieldset name="clientSignup">
                <input type="hidden" id="provider" title="Provider ID"></input>
                <input type="hidden" id="clientId" title="Client ID"></input> 
                <label for="firstName">First Name*</label>
                <input type="text" id="firstName" title="First Name" placeholder="Your first name" required></input>
                <label for="lastName">Last Name*</label>
                <input type="text" id="lastName" title="Last Name" placeholder="Your last name" required></input>
                <label for="email">Email*</label>
                <input type="email" id="email" title="Email Address" placeholder="Your email address" required></input>
                <label for="phone">Phone*</label>
                <input type="text" id="phone" title="Phone Number" placeholder="Your phone number" required></input>
                <label for="streetAddress">Street Address*</label>
                <input type="text" id="streetAddress" title="Street Address" placeholder="Your street address" required></input>
                <label for="entryNote">Entry Note</label>
                <input type="text" id="entryNote" title="Entry Note" placeholder="Special entry instructions"></input>
                <label for="vetInfo">Veterinarian Name</label>
                <input type="text" id="vetInfo" title="Veterinarian Name" placeholder="Your preferred veterinarian"></input>
                <label for="password">Password*</label>
                <input type="password" pattern=".{6,10}" id="password" title="Password must be 10 characters" placeholder="Any 10 characters, no spaces" required></input>
                <label for="confirmPassword">Confirm Password*</label>
                <input type="password" id="confirmPassword" title="Confirm Password" placeholder="Confirm your password" required></input>
                <p id="message"></p>
                <input type="submit" value="Submit" class="button">
            </fieldset>
        </form>
        </div>`,
    providerSignupForm: `
        <div class="boxed">
        <h2>Provider Sign Up</h2>
        <form id="js-provider-signup-form">
            <fieldset name="providerSignup">
                <input type="hidden" id="providerId" title="Provider ID"></input>
                <label for="companyName">Company Name*</label>
                <input type="text" id="companyName" title="Company Name" placeholder="Your company name" required></input>
                <label for="firstName">First Name*</label>
                <input type="text" id="firstName" title="First Name" placeholder="Your first name" required></input>
                <label for="lastName">Last Name*</label>
                <input type="text" id="lastName" title="Last Name" placeholder="Your last name" required></input>
                <label for="email">Email*</label>
                <input type="email" id="email" title="Email Address" placeholder="Your email address" required></input>
                <label for="phone">Phone*</label>
                <input type="text" id="phone" title="Phone Number" placeholder="Your phone number" required></input>
                <label for="streetAddress">Street Address*</label>
                <input type="text" id="streetAddress" title="Street Address" placeholder="Your street address" required></input>
                <label for="password">Password*</label>
                <input type="password" pattern=".{6,10}" id="password" title="Password must be 10 characters" placeholder="Any 10 characters, no spaces" required></input>
                <label for="confirmPassword">Confirm Password*</label>
                <input type="password" id="confirmPassword" title="Confirm Password" placeholder="Confirm your password" required></input>
                <p id="message"></p>
                <input type="submit" value="Submit" class="button">
            </fieldset>
        </form>
        </div>`,
    loginForm: `<div class="boxed">
        <h1>Login</h1>
        <form id="js-login-form">
            <fieldset name="login">
                <label for="email">Email*</label>
                <input type="email" id="email" title="Email address" placeholder="Your email address" required></input>
                <label for="password">Pasword*</label>
                <input type="password" id="password" title="Password" placeholder="Your password" required></input>
                <input type="submit" value="Submit" class="button">
            </fieldset>
        </form>
        </div>`,
    compactHeaderClient: `
        <div class="compactHeader">
            <a href="#clientDashboard">
            <img src="images/logo-small.png" alt="Pet Pal">
            </a>
            <nav>
                <a href="#clientDashboard" class="navLink">Dashboard</a>
                <a href="#logout" class="navLink">Logout</a>
            </nav>
        </div>`,
    compactHeaderProvider: `
        <div class="compactHeader">
            <a href="#providerDashboard">
                <img src="images/logo-small.png" alt="Pet Pal">
            </a>
            <nav>
                <a href="#providerDashboard" class="navLink">Dashboard</a>
                <a href="#visits" class="navLink">Visits</a>
                <a href="#clients" class="navLink">Clients</a>
                <a href="#logout" class="navLink">Logout</a>
            </nav>
        </div>`,
    addPetForm: `
        <div class="boxed">
            <h2>Add a Pet</h2>
            <form id="js-add-pet-form">
                <fieldset name="addPet">
                    <input type="hidden" id="clientId" title="Client ID"></input> 
                    <input type="hidden" id="_id" title="Pet ID"></input> 
                    <label for="petName">Name*</label>
                    <input type="text" id="petName" title="Pet Name" placeholder="Your pet's name" required></input>                  
                    <label for="petType">Type*</label>
                        <select id="petType" title="Pet Type" required>
                            <option value="" disabled selected hidden>Type of pet</option>
                            <option value="Dog">Dog</option>
                            <option value="Cat">Cat</option>
                            <option value="Bird">Bird</option>
                            <option value="Fish">Fish</option>
                            <option value="Snake">Snake</option>
                            <option value="Turtle">Turtle</option>
                            <option value="Lizard">Lizard</option>
                            <option value="Rodent">Rodent</option>
                            <option value="Other">Other</option>
                        </select> 
                    <label for="petBreed">Breed</label>
                    <input type="text" id="petBreed" title="Breed" placeholder="Breed of pet"></input>
                    <label for="petColor">Color</label>
                    <input type="text" id="petColor" title="Color" placeholder="Pet color"></input>
                    <label for="petFood">Food</label>
                    <input type="text" id="petFood" title="Food" placeholder="Pet food details"></input>
                    <input type="submit" value="Submit" class="button">
                </fieldset>
            </form>
        </div>`,
    addTaskForm: `
        <div class="boxed">
        <h2>Add a Task</h2>
        <form id="js-add-task-form">
            <fieldset name="addTask">
                <input type="hidden" id="clientId" title="Client ID"></input> 
                <label for="taskDescription">Description*</label>
                <input type="text" id="taskDescription" title="Task Description" placeholder="Task description" required></input>                  
                <input type="submit" value="Submit" class="button">
            </fieldset>
        </form>
        </div>`,
    providerDashboard: `
        <div class="boxed">
        <h2>Upcoming Visits</h2>
        <div id="js-visits-list"></div>
        <a class="button" id="js-all-visits-button" href="#visits">View All</a>
        <a class="button" id="js-add-visit-button" href="#addVisit">Add</a>
        </div>`,
    addVisitForm: `
        <div class="boxed">
        <h2>Add a Visit</h2>
        <form id="js-add-visit-form">
            <fieldset name="addVisit">
                <input type="hidden" id="provider" title="Provider ID"></input> 
                <label for="client">Client*</label>
                    <select id="js-client-list" title="Client" required>
                        <option value="" disabled selected hidden>Client</option>
                    </select>
                <label for="startTime">Start Time*</label>
                <input type="text" id="startTime" title="Start Time" placeholder="Start date and time" autocomplete="off" required></input>
                <label for="endTime" >End Time*</label>
                <input type="text" id="endTime" title="End Time" placeholder="End date and time" autocomplete="off" required></input>
                <input type="submit" value="Submit" class="button" placeholder="">
            </fieldset>
        </form>
        </div>`,
    fullHeader: `<div class="fullHeader">
            <a href="index.html">
                <img src="images/logo-large.png" alt="Pet Pal">
            </a>
        </div>`
}