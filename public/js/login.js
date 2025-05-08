async function login(email, password) {
    try {
        const response = await fetch("/api/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        });
        const { uid, token } = await response.json();

        localStorage.setItem("auth_token", token);
        localStorage.setItem("auth_uid", uid);

        // Show success message and redirect
        const successMessage = $(
            "<div class='success-message'>Login successful! Redirecting to dashboard...</div>",
        );

        form.before(successMessage);

        setTimeout(() => {
            window.location.href = "/admin/profile.html";
        }, 1500);
    } catch (error) {
        console.error(error);

        const errorMessage = $(
            "<div class='error-message'>Invalid email or password. Please try again.</div>",
        );

        form.before(errorMessage);

        // Reset button
        submitBtn.prop("disabled", false).text("Login");

        // Remove error message after 3 seconds
        setTimeout(() => {
            errorMessage.fadeOut(300, function () {
                $(this).remove();
            });
        }, 3000);
    }
}

$(document).ready(() => {
    // Login form validation
    validateForm("#login-form", (form) => {
        const submitBtn = form.find("button[type='submit']");
        submitBtn.prop("disabled", true).text("Logging in...");

        const email = $("#email").val();
        const password = $("#password").val();

        login(email, password);
    });
});
