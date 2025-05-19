function login(form, email, password) {}

$(document).ready(() => {
    $(".toggle-password").on("click", function () {
        const field = $(this).siblings("input");
        const type = field.attr("type") === "password" ? "text" : "password";
        field.attr("type", type);

        const icon = $(this).find("img");
        if (type === "text") {
            icon.attr("src", "./assets/icons/eye-off.svg");
        } else {
            icon.attr("src", "./assets/icons/eye.svg");
        }
    });

    $("#login-form").on("submit", function (e) {
        e.preventDefault();

        let isFormValid = true;

        $(this).find(".error-message").remove();
        $(this).find(".error").removeClass("error");

        const email = $("#email").val();
        const password = $("#password").val();

        const validation = window.validation;

        const requireds = $(this).find("[required]");
        requireds.each(function () {
            if (validation.isStringEmpty($(this).val())) {
                isValid = false;

                $(this).addClass("error");
                $(this).after("<div class='error-message'>This field is required</div>");
            }
        });

        if (!validation.isValidEmail(email)) {
            isFormValid = false;

            $("#email").addClass("error");
            $("#email").after(
                "<div class='error-message'>Please enter a valid email address</div>",
            );
        }

        if (!isFormValid) return;

        const submitBtn = $(this).find("button[type='submit']");
        submitBtn.prop("disabled", true).text("Logging in...");

        $.ajax({
            url: "/auth/login",
            method: "POST",
            data: { email, password },
            success: (response) => {
                const { uid, token } = response.data;

                auth.login(token, uid);

                const successMessage = $(
                    "<div class='success-message'>Login successful! Redirecting to dashboard...</div>",
                );

                $(this).before(successMessage);

                setTimeout(() => {
                    window.location.href = "/admin/profile.html";
                }, 1500);
            },
            error: (e) => {
                const errorMessage = $(
                    "<div class='error-message'>Invalid email or password. Please try again.</div>",
                );

                $(this).before(errorMessage);

                // Reset button
                $(this).find("button[type='submit']").prop("disabled", false).text("Login");

                // Remove error message after 3 seconds
                setTimeout(() => {
                    errorMessage.fadeOut(300, function () {
                        $(this).remove();
                    });
                }, 3000);
            },
        });
    });
});
