$(document).ready(() => {
    window.auth = {
        login,
        logout,
        getAccessToken,
        getUid,
        isLoggedIn,
    };

    function login(token, uid) {
        localStorage.setItem("auth_token", token);
        localStorage.setItem("auth_uid", uid);
    }

    function logout() {
        localStorage.clear("auth_token");
        localStorage.clear("auth_uid");
    }

    function getAccessToken() {
        return localStorage.getItem("auth_token");
    }

    function getUid() {
        return localStorage.getItem("auth_uid");
    }

    function isLoggedIn() {
        return !!getUid() && !!getAccessToken();
    }
});
