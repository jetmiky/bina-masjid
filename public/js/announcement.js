$(document).ready(() => {
    const mosqueId = auth.getUid();

    $.ajax({
        url: `/mosques/${mosqueId}/announcements`,
        success: (response) => {
            $(".announcements-list").empty();

            for (const announcement of response.data) {
                const btn = $(`<button class="btn btn-danger btn-sm">Delete</button>`);
                btn.on("click", () => deleteAnnouncement(announcement.id));

                const item = $(`
                    <div class="announcement-card">
                                <div class="announcement-header">
                                    <h3>${announcement.title}</h3>
                                </div>
                                <p>
                                    ${announcement.description}
                                </p>
                                <div class="announcement-actions">
                                </div>
                            </div>`);

                $(item).appendTo(".announcements-list");
                $(item).children(".announcement-actions").append(btn);
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
                const successMessage = $("<div class='success-message'>Announcement added!</div>");
                $(this).prepend(successMessage);

                console.log(response);

                // Remove success message after 3 seconds
                setTimeout(() => {
                    successMessage.fadeOut(300, function () {
                        $(this).remove();
                    });
                }, 3000);
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
                console.log(response);
            },
            error: (e) => {
                console.error(e.responseJSON.message);
            },
        });
    }
});
