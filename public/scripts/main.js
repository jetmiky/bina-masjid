async function ping(baseURL) {
    try {
        const response = await fetch(`${baseURL}`);
        const result = await response.text();

        alert(result);
    } catch (error) {
        alert("Failed to ping API");
    }
}

$(document).ready(() => {
    window.configs = {};
    const configs = window.configs;

    configs.mode = "DEVELOPMENT";

    configs.BASE_API_URL =
        configs.mode === "PRODUCTION"
            ? "https://api-cfb2qjgxrq-uc.a.run.app"
            : "http://127.0.0.1:5001/bina-masjid-digital/us-central1/api";

    ping(configs.BASE_API_URL);
});
