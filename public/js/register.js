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

    $("#register-form").on("submit", function (e) {
        e.preventDefault();

        let isFormValid = true;

        $(this).find(".error-message").remove();
        $(this).find(".error").removeClass("error");

        const email = $("#admin-email").val();
        const password = $("#password").val();
        const name = $("#mosque-name").val();
        const phone = $("#mosque-phone").val();
        const street = $("#mosque-address").val();
        const city = $("#mosque-city").val();
        const province = $("#mosque-province").val();
        const zip = $("#mosque-postal").val();

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

            $("#admin-email").addClass("error");
            $("#admin-email").after(
                "<div class='error-message'>Please enter a valid email address</div>",
            );
        }

        if (!validation.isValidPassword(password)) {
            isFormValid = false;

            $("#password").addClass("error");
            $("#password").after(
                "<div class='error-message'>Password must be at least 8 characters long</div>",
            );
        }

        if (!validation.isPasswordMatch(password, $("#confirm-password").val())) {
            isFormValid = false;

            $("#confirm-password").addClass("error");
            $("#confirm-password").after("<div class='error-message'>Passwords do not match</div>");
        }

        if (!validation.isValidPhone(phone)) {
            isFormValid = false;

            $("#mosque-phone").addClass("error");
            $("#mosque-phone").after(
                "<div class='error-message'>Please enter a valid phone number</div>",
            );
        }

        if (!validation.isValidPostalCode(zip)) {
            isFormValid = false;

            $("#mosque-postal").addClass("error");
            $("#mosque-postal").after(
                "<div class='error-message'>Please enter a valid postal code</div>",
            );
        }

        if (!isFormValid) return;

        const submitBtn = $(this).find("button[type='submit']");
        submitBtn.prop("disabled", true).text("Registering...");

        $.ajax({
            url: "/auth/register",
            method: "POST",
            data: {
                email,
                password,
                mosque: { name, phone, address: { street, city, province, zip } },
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
