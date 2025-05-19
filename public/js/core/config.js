$(document).ready(() => {
    const API_URL = "http://127.0.0.1:5001/bina-masjid-digital/us-central1/api";
    setupJQueryAJAX(API_URL);

    function setupJQueryAJAX(url) {
        $.ajaxSetup({
            beforeSend: (xhr, options) => {
                if (!options.url.startsWith(".") && options.url.indexOf("http") !== 0) {
                    options.url = `${url}${options.url}`;
                }

                const token = window.auth?.getAccessToken();
                if (token) {
                    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
                }
            },
        });
    }
});
