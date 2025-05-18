$(document).ready(() => {
    // Password strength checker
    $("#password").on("keyup", function () {
        const password = $(this).val();
        const strengthMeter = $(".strength-segment");
        const strengthText = $("#strength-value");

        // Reset strength indicators
        strengthMeter.removeClass("weak medium strong");

        if (password.length === 0) {
            strengthText.text("Weak");
            return;
        }

        // Check strength
        let strength = 0;

        // Length check
        if (password.length >= 8) strength += 1;

        // Uppercase check
        if (/[A-Z]/.test(password)) strength += 1;

        // Lowercase check
        if (/[a-z]/.test(password)) strength += 1;

        // Number check
        if (/[0-9]/.test(password)) strength += 1;

        // Special character check
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;

        // Update strength indicator
        if (strength <= 2) {
            strengthText.text("Weak");
            strengthMeter.slice(0, 1).addClass("weak");
        } else if (strength <= 4) {
            strengthText.text("Medium");
            strengthMeter.slice(0, 3).addClass("medium");
        } else {
            strengthText.text("Strong");
            strengthMeter.slice(0, 4).addClass("strong");
        }
    });

    // Registration form validation
    validateForm("#register-form", (form) => {
        const submitBtn = form.find("button[type='submit']");
        submitBtn.prop("disabled", true).text("Registering...");

        $.ajax({
            url: `${configs.API_URL}/auth/register`,
            method: "POST",
            data: {
                email: $("#admin-email").val(),
                password: $("#password").val(),
                mosque: {
                    name: $("#mosque-name").val(),
                    phone: $("#mosque-phone").val(),
                    address: {
                        street: $("#mosque-address").val(),
                        city: $("#mosque-city").val(),
                        province: $("#mosque-province").val(),
                        zip: $("#mosque-postal").val(),
                    },
                },
            },
            success: () => {
                window.location.href = "login.html";
            },
            error: (e) => {
                submitBtn.prop("disabled", false).text("Register");
                alert(`Registration failed: ${e.responseJSON.message}`);
            },
        });
    });
});
