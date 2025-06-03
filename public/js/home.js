$(document).ready(() => {
    // Testimonial slider functionality
    let currentSlide = 0;
    const testimonials = $(".testimonial");

    loadAllMosque();

    // Only initialize if there are testimonials
    if (testimonials.length > 0) {
        // Hide all testimonials except the first one
        testimonials.hide();
        testimonials.eq(0).show();

        // Show next testimonial
        $(".next-btn").on("click", () => {
            testimonials.eq(currentSlide).fadeOut(300, () => {
                currentSlide = (currentSlide + 1) % testimonials.length;
                testimonials.eq(currentSlide).fadeIn(300);
            });
        });

        // Show previous testimonial
        $(".prev-btn").on("click", () => {
            testimonials.eq(currentSlide).fadeOut(300, () => {
                currentSlide = (currentSlide - 1 + testimonials.length) % testimonials.length;
                testimonials.eq(currentSlide).fadeIn(300);
            });
        });

        // Auto-rotate testimonials every 5 seconds
        const autoRotate = setInterval(() => {
            $(".next-btn").trigger("click");
        }, 5000);

        // Pause auto-rotation when user interacts with controls
        $(".prev-btn, .next-btn").on("click", () => {
            clearInterval(autoRotate);
        });
    }

    // Animate feature cards on scroll
    $(".feature-card").each(function (index) {
        $(this).css("animation-delay", `${index * 0.2}s`);
        $(this).addClass("fade-in");
    });
});

function loadAllMosque() {
    $.ajax(`/mosques?limit=10`, {
        success: (response) => {
            const mosqueListContainer = $("#mosque-list");
            mosqueListContainer.empty();

            const mosques = response.data; // fallback jika tidak dibungkus

            mosques.forEach((mosque) => {
                const card = `
                    <div class="mosque-card">
                        <h3>${mosque.name}</h3>
                        <a class="button-div button-primary width-full" href="/mosque.html?id=${mosque.uid}">View Details</a>
                    </div>
                `;

                mosqueListContainer.append(card);
            });
        },
        error: (e) => {
            console.error(e.responseJSON?.message || e.statusText);
        },
    });
}
