function handleClientSignup(){
    $('#js-client-signup').on("submit", event => {
        event.preventDefault();
        window.location.href = "client-dashboard.html"
    }); 
}

$(handleClientSignup);