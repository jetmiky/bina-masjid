function login(form, email, password) {
    $.ajax({
        url: `${configs.API_URL}/auth/login`,
        method: "POST",
        data: {
            email,
            password,
        },
        success: (response) => {
            const { uid, token } = response.data;

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
        },
        error: (e) => {
            const errorMessage = $(
                "<div class='error-message'>Invalid email or password. Please try again.</div>",
            );

            form.before(errorMessage);

            // Reset button
            form.find("button[type='submit']").prop("disabled", false).text("Login");

            // Remove error message after 3 seconds
            setTimeout(() => {
                errorMessage.fadeOut(300, function () {
                    $(this).remove();
                });
            }, 3000);
        },
    });
}

$(document).ready(() => {
    // Login form validation
    validateForm("#login-form", (form) => {
        const submitBtn = form.find("button[type='submit']");
        submitBtn.prop("disabled", true).text("Logging in...");

        const email = $("#email").val();
        const password = $("#password").val();

        login(form, email, password);
    });
});
