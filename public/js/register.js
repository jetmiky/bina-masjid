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
        // Simulate form submission (to be replaced with actual API call)
        const submitBtn = form.find("button[type='submit']");
        submitBtn.prop("disabled", true).text("Registering...");

        // Simulate API call with timeout
        setTimeout(() => {
            // Redirect to login page (in a real implementation, this would happen after successful registration)
            window.location.href = "login.html";
        }, 2000);
    });
});
