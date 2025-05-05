$(document).ready(() => {
    // Load header and footer components
    $("#header-placeholder").load("./components/header.html", () => {
        // Set active nav link based on current page
        const currentPage = window.location.pathname.split("/").pop();
        const navLinks = $(".nav-link, .mobile-nav-link");

        navLinks.each(function () {
            const linkHref = $(this).attr("href");
            if (linkHref === currentPage || (currentPage === "" && linkHref === "index.html")) {
                $(this).addClass("active");
            }
        });

        // Mobile menu toggle
        $(".mobile-menu-toggle").click(function () {
            $(this).toggleClass("active");
            $(".mobile-menu").toggleClass("active");
        });
    });

    $("#footer-placeholder").load("./components/footer.html");

    // Initialize animations
    initAnimations();

    // Add fade-in animation to sections
    $("section").addClass("fade-in");
});

// Animation on scroll initialization
function initAnimations() {
    // Check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0
        );
    }

    // Handle scroll animations
    function handleScrollAnimations() {
        $(".fade-in:not(.show)").each(function () {
            if (isInViewport(this)) {
                $(this).addClass("show");
            }
        });

        $(".slide-in:not(.show)").each(function () {
            if (isInViewport(this)) {
                $(this).addClass("show");
            }
        });
    }

    // Initial check for animations
    handleScrollAnimations();

    // Check animations on scroll
    $(window).on("scroll", () => {
        handleScrollAnimations();
    });
}

// Form validation helper
function validateForm(formId, successCallback) {
    const form = $(formId);

    form.on("submit", (event) => {
        event.preventDefault();

        let isValid = true;
        const requiredFields = form.find("[required]");

        // Reset validation errors
        form.find(".error-message").remove();
        form.find(".error").removeClass("error");

        // Check required fields
        requiredFields.each(function () {
            if (!$(this).val().trim()) {
                isValid = false;
                $(this).addClass("error");
                $(this).after("<div class='error-message'>This field is required</div>");
            }
        });

        // Email validation
        const emailField = form.find("input[type='email']");
        if (emailField.length && emailField.val()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailField.val())) {
                isValid = false;
                emailField.addClass("error");
                emailField.after(
                    "<div class='error-message'>Please enter a valid email address</div>",
                );
            }
        }

        // Password validation for registration
        const passwordField = form.find("#password");
        const confirmPasswordField = form.find("#confirm-password");

        if (passwordField.length && confirmPasswordField.length) {
            if (passwordField.val() !== confirmPasswordField.val()) {
                isValid = false;
                confirmPasswordField.addClass("error");
                confirmPasswordField.after(
                    "<div class='error-message'>Passwords do not match</div>",
                );
            }
        }

        // If form is valid, call success callback
        if (isValid && typeof successCallback === "function") {
            successCallback(form);
        }
    });
}

// Handle password toggle
$(document).on("click", ".toggle-password", function () {
    const passwordField = $(this).siblings("input");
    const type = passwordField.attr("type") === "password" ? "text" : "password";
    passwordField.attr("type", type);

    const img = $(this).find("img");
    if (type === "text") {
        img.attr("src", "./assets/icons/eye-off.svg");
    } else {
        img.attr("src", "./assets/icons/eye.svg");
    }
});
