$(document).ready(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const mosqueId = urlParams.get("id");

    if (!mosqueId) {
        window.location.href = "/404.html";
        return;
    }

    // Load mosque details
    loadMosqueDetails(mosqueId);
    loadAnnouncements(mosqueId);
    loadFinancialData(mosqueId);

    // Handle export form submission
    $("#exportForm").on("submit", (e) => {
        e.preventDefault();

        const startDate = $("#startDate").val();
        const endDate = $("#endDate").val();

        if (!startDate || !endDate) {
            alert("Please select both start and end dates");
            return;
        }

        if (new Date(startDate) > new Date(endDate)) {
            alert("Start date must be before end date");
            return;
        }

        exportFinancialReport(mosqueId, startDate, endDate);
    });
});

function loadMosqueDetails(mosqueId) {
    $.ajax(`/mosques/${mosqueId}`, {
        success: (response) => {
            const mosque = response.data;

            $("#mosqueName").text(mosque.name);
            $("#mosqueName2").text(mosque.name);
            $("#mosqueAddress").html(
                `<img src="./assets/img/icon/location.png" alt="Location"> ${mosque.address.street}, ${mosque.address.city}, ${mosque.address.province} ${mosque.address.zip}`,
            );
            $("#mosquePhone").html(
                `<img src="./assets/img/icon/contact2.png" alt="Phone"> ${mosque.phone}`,
            );
            $("#mosqueEmail").html(
                `<img src="./assets/img/icon/email.png" alt="Email"> ${mosque.email}`,
            );
        },
        error: (e) => {
            alert("Error getting mosque data");
            console.error(e.responseJSON.message);
        },
    });
}

function loadAnnouncements(mosqueId) {
    $.ajax({
        url: `/mosques/${mosqueId}/announcements`,
        success: (response) => {
            const announcements = response.data;

            if (announcements.length) {
                const announcementsHtml = announcements
                    .map(
                        (announcement) => `
                            <div class="announcement-card">
                                <h3 class="announcement-title">${announcement.title}</h3>
                                <p>${announcement.description}</p>
                            </div>
                        `,
                    )
                    .join("");

                $("#announcementsList").html(announcementsHtml);
            } else {
                $("#announcementsList").html("<p>No announcements created yet.</p>");
            }
        },
        error: (e) => {
            console.error(e.responseJSON.message);
        },
    });
}

function loadFinancialData(mosqueId) {
    $.ajax(`/mosques/${mosqueId}/finances`, {
        success: (response) => {
            const { records, total } = response.data;

            if (records.length) {
                $("#totalDonations").text(`+ ${formatCurrency(total.income)}`);
                $("#totalExpenses").text(`- ${formatCurrency(total.expense)}`);

                const transactionsHtml = records
                    .map(
                        (transaction) => `
                            <div class="transaction-item">
                                <span class="transaction-type ${transaction.type === "expense" ? "expense" : "donation"}">${capitalizeFirst(transaction.type)}</span>
                                <span class="transaction-date">${formatDate(transaction.date)}</span>
                                <span class="transaction-description">${transaction.description}</span>
                                <span class="transaction-amount ${transaction.amount > 0 ? "positive" : "negative"}">
                                    ${formatCurrency(transaction.amount)}
                                </span>
                            </div>
                        `,
                    )
                    .join("");

                $("#transactionsList").html(transactionsHtml);
            } else {
                $("#transactionsList").html(
                    `<div class="transaction-item">
                        <p>No transaction yet</p>
                    </div>`,
                );
            }
        },
    });
}

function exportFinancialReport(mosqueId, startDate, endDate) {
    const btn = $("#exportForm button").html("Generating PDF...").prop("disabled", true);

    $.ajax(`/mosques/${mosqueId}/finances/report?start_date=${startDate}&end_date=${endDate}`, {
        xhrFields: {
            responseType: "blob",
        },
        success: (blob) => {
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = "FinanceReport.pdf";
            link.click();

            link.remove();

            btn.html("Export PDF").prop("disabled", false);
        },
        error: (e) => {
            alert("Failed getting Finance Report.");
            console.error(e.responseJSON.message);
        },
    });
}

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

function formatCurrency(amount) {
    return `Rp ${amount.toLocaleString("id-ID")}`;
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
