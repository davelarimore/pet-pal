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
                return api.getMe();
            })
            .then(response => {
                currentUser = response;
            })
    };

    function _updateCurrentUser() {
        return api.getMe()
        .then(response => {
            currentUser = response;
        })
    }


//     function _updateCurrentUser() {
//         return new Promise((resolve, reject) => {
//         api.getMe()
//             .then(response => {
//                 currentUser = response;
//             })
//             .then(resolve())
//         // do something asynchronous which eventually calls either:
//         //
//         //   resolve(someValue); // fulfilled
//         // or
//         //   reject("failure reason"); // rejected
//     })
// }

    function _logout() {
        window.localStorage.removeItem("AUTH_TOKEN");
    }

    return {
        login: _login,
        logout: _logout,
        getToken: _getToken,
        updateCurrentUser: _updateCurrentUser,
        isProvider: function () {
            return currentUser.role === "provider";
        },
        getCurrentUser: function () {
            return currentUser;
        }
    };
})();