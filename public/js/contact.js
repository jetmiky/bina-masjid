$(document).ready(() => {
    $("#contact-form").on("submit", function (e) {
        e.preventDefault();

        let isFormValid = true;

        $(this).find(".error-message").remove();
        $(this).find(".error").removeClass("error");

        const validation = window.validation;

        const requireds = $(this).find("[required]");
        requireds.each(function () {
            if (validation.isStringEmpty($(this).val())) {
                isFormValid = false;

                $(this).addClass("error");
                $(this).after("<div class='error-message'>This field is required</div>");
            }
        });

        const email = $("#email").val();
        if (!validation.isValidEmail(email)) {
            isFormValid = false;

            $("#email").addClass("error");
            $("#email").after(
                "<div class='error-message'>Please enter a valid email address</div>",
            );
        }

        if (!isFormValid) return;

        const btn = $(this).find("button[type='submit']");
        btn.attr("disabled", true).text("Sending...");

        setTimeout(() => {
            $(this).trigger("reset");
            alert("Thanks for your message! We'll get back to you soon.");

            btn.attr("disabled", false).text("Send Message");
        }, 3000);
    });

    // FAQ accordion functionality
    $(".faq-question").on("click", function () {
        const faqItem = $(this).parent();

        if (faqItem.hasClass("active")) {
            faqItem.removeClass("active");
        } else {
            $(".faq-item").removeClass("active");
            faqItem.addClass("active");
        }
    });
});

// abs
const textarea = document.getElementById('message');

textarea.addEventListener('focus', () => {
    if (textarea.value.trim() === '') {
        textarea.style.height = '126px'; // approx. 3 lines
    } else {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px'; // fit content height
  }
});

// Shrink or auto-fit on blur
textarea.addEventListener('blur', () => {
  if (textarea.value.trim() === '') {
    textarea.style.height = '42px'; // back to 1 line
  } else {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px'; // fit content height
  }
});

// Optional: auto-adjust while typing
textarea.addEventListener('input', () => {
  textarea.style.height = 'auto';
  textarea.style.height = textarea.scrollHeight + 'px';
});
