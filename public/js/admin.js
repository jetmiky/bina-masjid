$(document).ready(() => {
    if (!window.auth.isLoggedIn()) {
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

    $("#mobile-logged-navbar-placeholder").load("../components/mobile-navbar-login.html");

    $("#js-logout").on("click", () => {
        window.auth.logout();
        window.location.href = "/login.html";
    });
});
