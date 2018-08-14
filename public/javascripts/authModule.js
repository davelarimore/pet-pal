const auth = (function () {
    let currentUser = {};

    const _setToken = token => {
        window.localStorage.setItem("AUTH_TOKEN", token);
    };

    const _getToken = token => {
        return window.localStorage.getItem("AUTH_TOKEN");
    };

    function _login(email, password) {
        return $
            .ajax({
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                url: 'auth/login',
                data: JSON.stringify({ email: email, password: password })
            })
            .then(response => {
                _setToken(response.authToken);

                return getMe();
            })
            .then(response => {
                currentuser = response;
                console.log(response);
            });
    }

    function _logout() {
        window.localStorage.removeItem("AUTH_TOKEN");
        window.location.replace = '../';
    }

    return {
        login: _login,
        logout: _logout,
        isProvider: function () {
            console.log(currentUser.role);
            return currentUser.role === "provider";
        },
        getCurrentUser: function () {
            return currentUser;
        }
    };
})();