$(document).ready(() => {
    const mosqueId = window.auth.getUid();

    loadMosqueDetails(mosqueId);

    $("#js-get-qr").on("click", () => {
        $.ajax(`/mosques/${mosqueId}/qr`, {
            xhrFields: {
                responseType: "blob",
            },
            success: (blob) => {
                const link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                link.download = "QRCode.pdf";
                link.click();

                link.remove();
            },
            error: (e) => {
                alert("Failed getting QRCode");
                console.error(e.responseJSON.message);
            },
        });
    });

    $("#profile-form").on("submit", (e) => {
        e.preventDefault();

        $.ajax(`/mosques/${mosqueId}`, {
            method: "PUT",
            data: {
                name: $("#mosque-name").val(),
                address: {
                    street: $("#mosque-address").val(),
                    city: $("#mosque-city").val(),
                    province: $("#mosque-province").val(),
                    zip: $("#mosque-postal").val(),
                },
                phone: $("#mosque-phone").val(),
            },
            success: (response) => {
                const mosque = response.data;
                fillMosqueDetails(mosque);

                alert("Mosque data successfully updated");
            },
            error: (e) => {
                alert("Error updating mosque data");
                console.error(e.responseJSON.message);
            },
        });
    });

    $("#profile-img-form").on("submit", function (e) {
        e.preventDefault();

        const formData = new FormData(this);

        $.ajax(`/mosques/${mosqueId}/image`, {
            method: "PUT",
            data: formData,
            contentType: false,
            processData: false,
            success: (response) => {
                const mosque = response.data;
                fillMosqueDetails(mosque);

                alert("Mosque profile image successfully updated");
            },
            error: (e) => {
                alert("Error updating mosque profile image");
                console.error(e.responseJSON.message);
            },
        });
    });
});

function loadMosqueDetails(mosqueId) {
    $.ajax(`/mosques/${mosqueId}`, {
        success: (response) => {
            const mosque = response.data;
            fillMosqueDetails(mosque);
        },
        error: (e) => {
            alert("Error getting mosque data");
            console.error(e.responseJSON.message);
        },
    });
}

function fillMosqueDetails(mosque) {
    $("#js-mosque-image").css({ backgroundImage: `url(${mosque.img})` });
    $("#mosque-name").val(mosque.name);
    $("#mosque-phone").val(mosque.phone);
    $("#mosque-address").val(mosque.address.street);
    $("#mosque-city").val(mosque.address.city);
    $("#mosque-province").val(mosque.address.province);
    $("#mosque-postal").val(mosque.address.zip);
}
