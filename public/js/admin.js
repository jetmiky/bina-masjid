const configs = {};
configs.API_URL = "http://127.0.0.1:5001/bina-masjid-digital/us-central1/api";

$(document).ready(() => {
    // Check authentication for admin pages
    const token = localStorage.getItem("auth_token");
    if (!token) {
        window.location.href = "/login.html";
        return;
    }

    // Toggle mobile sidebar
    $(".mobile-menu-toggle").on("click", () => {
        $(".admin-sidebar").toggleClass("active");
    });

    // New announcement form
    $("#new-announcement-btn").on("click", () => {
        $(".announcements-list").hide();
        $("#announcement-form").removeClass("hidden");
    });

    $("#cancel-announcement").on("click", () => {
        $("#announcement-form").addClass("hidden");
        $(".announcements-list").show();
    });

    // New transaction form
    $("#new-transaction-btn").on("click", () => {
        $(".transactions-list").hide();
        $("#transaction-form").removeClass("hidden");
    });

    $("#cancel-transaction").on("click", () => {
        $("#transaction-form").addClass("hidden");
        $(".transactions-list").show();
    });
});

function logout() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_uid");

    window.location.href = "/login.html";
}
