function handleSignupSubmit(){
    $('#js-signup').on("submit", event => {
        event.preventDefault();
        console.log('`handleSubmit` ran');
        window.location.href = "signup-client.html"
    }); 
}

function generateProviderHTML(provider) {
    if (item.provider === true) {
        return `
        <option value="${provider.companyName}">${provider.companyName}</option>`
    }
}
  
function generateProviderListHTML(visitsList) {
    const items = visitsList.map((item, index) => generateProviderHTML(item, index));  
    return items.join("");
}
  
function renderProviderListInput() {
    const recentVisitsHTML = generateProviderListHTML(PROVIDERS_STORE);
    $('#js-provider-list').append(recentVisitsHTML);
}

function handleSignup() {
    renderProviderListInput();
    handleSignupSubmit();
}

$(handleSignup);