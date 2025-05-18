$(document).ready(() => {
    // Check authentication for admin pages
    // const token = localStorage.getItem("auth_token");
    // if (!token) {
    //     window.location.href = "/login.html";
    //     return;
    // }

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

    // Form submissions
    $("form").on("submit", function (e) {
        e.preventDefault();
        // Add your form submission logic here

        // Show success message
        const successMessage = $("<div class='success-message'>Changes saved successfully!</div>");
        $(this).prepend(successMessage);

        // Remove success message after 3 seconds
        setTimeout(() => {
            successMessage.fadeOut(300, function () {
                $(this).remove();
            });
        }, 3000);
    });
});

function logout() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_uid");

    window.location.href = "/login.html";
}
