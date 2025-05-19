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
