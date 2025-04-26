async function pingFetch(baseURL) {
    try {
        const response = await fetch(`${baseURL}/ping`);
        const data = await response.text();

        alert(data);
    } catch (error) {
        alert("Failed to ping API");
    }
}

async function pingJquery(baseURL) {
    $.ajax({
        url: `${baseURL}/ping`,
        success: (data) => alert(data),
        error: () => alert("Failed to ping API"),
    });
}

$(document).ready(() => {
    window.configs = {};
    const configs = window.configs;

    configs.mode = "DEVELOPMENT";

    configs.BASE_API_URL =
        configs.mode === "PRODUCTION"
            ? "https://api-cfb2qjgxrq-uc.a.run.app"
            : "http://127.0.0.1:5001/bina-masjid-digital/us-central1/api";

    $("#js-fetch").on("click", () => pingFetch(configs.BASE_API_URL));
    $("#js-jquery").on("click", () => pingJquery(configs.BASE_API_URL));
});
