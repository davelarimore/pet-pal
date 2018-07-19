function handleLogin(){
    $('#js-login').on("submit", event => {
        const role = $('input[name="role"]:checked').val();
        event.preventDefault();
        console.log('`handleLogin` ran');
        if (role === "provider") {
            window.location.href = "provider-dashboard.html"
        }
        else {
            window.location.href = "client-dashboard.html"
        }
    }); 
}

$(handleLogin);