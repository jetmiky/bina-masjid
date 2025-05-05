$(document).ready(() => {
    // Contact form validation and submission
    validateForm("#contact-form", (form) => {
        // Simulate form submission (to be replaced with actual API call)
        const submitBtn = form.find("button[type='submit']");
        submitBtn.prop("disabled", true).text("Sending...");

        // Simulate API call with timeout
        setTimeout(() => {
            // Reset form
            form[0].reset();

            // Show success message
            const successMessage = $(
                "<div class='success-message'>Your message has been sent successfully! We'll get back to you soon.</div>",
            );
            form.before(successMessage);

            // Reset button
            submitBtn.prop("disabled", false).text("Send Message");

            // Remove success message after 5 seconds
            setTimeout(() => {
                successMessage.fadeOut(300, function () {
                    $(this).remove();
                });
            }, 5000);
        }, 1500);
    });

    // FAQ accordion functionality
    $(".faq-question").on("click", () => {
        const faqItem = $(this).parent();
        const faqAnswer = faqItem.find(".faq-answer");

        if (faqItem.hasClass("active")) {
            // Close the FAQ item
            faqItem.removeClass("active");
        } else {
            // Close all FAQ items
            $(".faq-item").removeClass("active");

            // Open the clicked FAQ item
            faqItem.addClass("active");
        }
    });
});
