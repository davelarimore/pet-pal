const USERS_STORE = [{
    user: 001, // provider who owns it
    companyName: "Jane's Pet Care",
    provider: true
},
{
    user: 002, // provider who owns it
    companyName: "Dog Walkers Inc.",
    provider: true
},
{
    user: 002, // provider who owns it
    companyName: "",
    provider: false
}];


function handleSignupSubmit(){
    $('#js-signup').on("submit", event => {
        event.preventDefault();
        console.log('`handleSubmit` ran');
        window.location.href = "client-dashboard.html"
    }); 
}


function generateProviderHTML(item, itemIndex, template) {
    if (item.provider === true) {
        return `
        <option value="${item.companyName}">${item.companyName}</option>`
    }
}
  
function generateProviderListHTML(visitsList) {
    const items = visitsList.map((item, index) => generateProviderHTML(item, index));  
    return items.join("");
}
  
function renderProviderListInput() {
    const recentVisitsHTML = generateProviderListHTML(USERS_STORE);
    $('#js-provider-list').append(recentVisitsHTML);
}

function handleSignup() {
    renderProviderListInput();
    handleSignupSubmit();
}

$(handleSignup);