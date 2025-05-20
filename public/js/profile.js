$(document).ready(() => {
    const mosqueId = auth.getUid();

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
});
