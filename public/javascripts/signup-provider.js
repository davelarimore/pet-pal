function handleProviderSignup(){
    $('#js-provider-signup').on("submit", event => {
        event.preventDefault();
        window.location.href = "provider-dashboard.html"
    }); 
}

$(handleProviderSignup);