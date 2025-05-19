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
            console.log(response.data);

            const mosque = {
                name: "Al-Falah Mosque",
                address: "123 Islamic Street, Silicon Valley, CA 94000",
                phone: "+1 (234) 567-8900",
                email: "info@alfalah.com",
            };

            $("#mosqueName").text(mosque.name);
            $("#mosqueAddress").html(
                `<img src="./assets/icons/location.svg" alt="Location"> ${mosque.address}`,
            );
            $("#mosquePhone").html(
                `<img src="./assets/icons/phone.svg" alt="Phone"> ${mosque.phone}`,
            );
            $("#mosqueEmail").html(
                `<img src="./assets/icons/email.svg" alt="Email"> ${mosque.email}`,
            );
        },
        error: (e) => {
            alert("Error getting mosque data");
            console.error(e.responseJSON.message);
        },
    });
}

function loadAnnouncements(mosqueId) {
    // Simulated API call - Replace with actual API endpoint
    setTimeout(() => {
        const announcements = [
            {
                title: "Eid Prayer Time Change",
                content:
                    "Due to expected high attendance, Eid prayer will now be held at 7:30 AM instead of 8:00 AM.",
                date: "2024-02-15",
            },
            {
                title: "Weekly Islamic Studies Class",
                content: "New Islamic Studies class starting this Saturday after Maghrib prayer.",
                date: "2024-02-12",
            },
        ];

        const announcementsHtml = announcements
            .map(
                (announcement) => `
          <div class="announcement-card">
              <p class="announcement-date">${formatDate(announcement.date)}</p>
              <h3 class="announcement-title">${announcement.title}</h3>
              <p>${announcement.content}</p>
          </div>
      `,
            )
            .join("");

        $("#announcementsList").html(announcementsHtml);
    }, 1000);
}

function loadFinancialData(mosqueId) {
    // Simulated API call - Replace with actual API endpoint
    setTimeout(() => {
        const financialData = {
            totalDonations: 25750,
            totalExpenses: 18320,
            recentTransactions: [
                {
                    date: "2024-02-15",
                    description: "Friday Prayer Donation",
                    type: "donation",
                    amount: 1200,
                },
                {
                    date: "2024-02-14",
                    description: "Utility Bills",
                    type: "expense",
                    amount: -450,
                },
            ],
        };

        $("#totalDonations").text(`$${financialData.totalDonations.toLocaleString()}`);
        $("#totalExpenses").text(`$${financialData.totalExpenses.toLocaleString()}`);

        const transactionsHtml = financialData.recentTransactions
            .map(
                (transaction) => `
          <div class="transaction-item">
              <span class="transaction-type ${transaction.type}">${capitalizeFirst(transaction.type)}</span>
              <span class="transaction-description">${transaction.description}</span>
              <span class="transaction-amount ${transaction.amount > 0 ? "positive" : "negative"}">
                  ${formatCurrency(transaction.amount)}
              </span>
          </div>
      `,
            )
            .join("");

        $("#transactionsList").html(transactionsHtml);
    }, 1000);
}

function exportFinancialReport(mosqueId, startDate, endDate) {
    // Simulated API call - Replace with actual API endpoint
    const btn = $("#exportForm button").html("Generating PDF...").prop("disabled", true);

    setTimeout(() => {
        // In a real implementation, this would trigger a PDF download
        alert("PDF report generated and downloaded successfully!");
        btn.html('<img src="./assets/icons/download.svg" alt="Download"> Export PDF').prop(
            "disabled",
            false,
        );
    }, 2000);
}

// Helper functions
function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

function formatCurrency(amount) {
    return `${amount >= 0 ? "+" : ""}$${Math.abs(amount).toLocaleString()}`;
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
