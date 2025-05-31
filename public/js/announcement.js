$(document).ready(() => {
    const mosqueId = window.auth.getUid();
    let isAnnouncementsEmpty = true;

    $.ajax({
        url: `/mosques/${mosqueId}/announcements`,
        success: (response) => {
            const announcements = response.data;

            if (announcements.length) {
                isAnnouncementsEmpty = false;
                $(".announcements-list").empty();

                for (const announcement of announcements) {
                    renderAnnouncement(announcement);
                }
            } else {
                $(".announcements-list").html("<p>No announcements created yet.</p>");
            }
        },
        error: (e) => {
            console.error(e.responseJSON.message);
        },
    });

    $("#announcement-form form").on("submit", function (e) {
        e.preventDefault();

        $.ajax({
            url: `/mosques/${mosqueId}/announcements`,
            method: "POST",
            data: {
                title: $("#announcement-title").val(),
                description: $("#announcement-content").val(),
            },
            success: (response) => {
                const announcement = response.data;
                alert("Announcement successfully added!");

                if (isAnnouncementsEmpty) {
                    isAnnouncementsEmpty = false;
                    $(".announcements-list").empty();
                }

                $("#announcement-form form").trigger("reset");
                $(".announcements-list").show();
                $("#announcement-form").addClass("hidden");
                renderAnnouncement(announcement);
            },
            error: (e) => {
                alert("Failed to add announcement");
                console.error(e.responseJSON.message);
            },
        });
    });

    function deleteAnnouncement(id) {
        $.ajax({
            url: `/mosques/${mosqueId}/announcements/${id}`,
            method: "DELETE",
            success: (response) => {
                alert("Announcement deleted");
                $(".announcement-card[data-id='" + id + "']").remove();
            },
            error: (e) => {
                console.error(e.responseJSON.message);
            },
        });
    }

    function renderAnnouncement(announcement) {
        const btn = $(`<button class="btn btn-danger btn-sm">Delete</button>`);
        btn.on("click", () => deleteAnnouncement(announcement.id));

        const item = $(`
            <div class="announcement-card" data-id="${announcement.id}">
                <div class="announcement-header">
                    <h3>${announcement.title}</h3>
                </div>
                <p>${announcement.description}</p>
                <div class="announcement-actions"></div>
            </div>
        `);

        $(item).appendTo(".announcements-list");
        $(item).children(".announcement-actions").append(btn);
    }
});

const textarea = document.getElementById("announcement-content");

textarea.addEventListener("focus", () => {
    if (textarea.value.trim() === "") {
        textarea.style.height = "126px"; // approx. 3 lines
    } else {
        textarea.style.height = "auto";
        textarea.style.height = textarea.scrollHeight + "px"; // fit content height
    }
});

// Shrink or auto-fit on blur
textarea.addEventListener("blur", () => {
    if (textarea.value.trim() === "") {
        textarea.style.height = "42px"; // back to 1 line
    } else {
        textarea.style.height = "auto";
        textarea.style.height = textarea.scrollHeight + "px"; // fit content height
    }
});

// Optional: auto-adjust while typing
textarea.addEventListener("input", () => {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
});
