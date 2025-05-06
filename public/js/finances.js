$(document).ready(() => {
    // Initialize financial chart
    const ctx = document.getElementById("financeChart").getContext("2d");

    const data = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
            {
                label: "Donations",
                data: [4500, 5200, 4800, 5800, 4900, 5750],
                borderColor: "#27AE60",
                backgroundColor: "rgba(39, 174, 96, 0.1)",
                tension: 0.4,
            },
            {
                label: "Expenses",
                data: [3200, 3800, 3500, 4200, 3900, 4320],
                borderColor: "#E74C3C",
                backgroundColor: "rgba(231, 76, 60, 0.1)",
                tension: 0.4,
            },
        ],
    };

    const config = {
        type: "line",
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "top",
                },
                title: {
                    display: true,
                    text: "Financial Overview - Last 6 Months",
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: (value) => {
                            return `Rp ${value}`;
                        },
                    },
                },
            },
        },
    };

    new Chart(ctx, config);

    // Export PDF functionality
    $("#export-pdf").on("click", () => {
        // Add your PDF export logic here
        alert("Generating PDF report...");
    });

    // Transaction filters
    $("#transaction-type, #date-filter").on("change", () => {
        // Add your filtering logic here
        console.log("Filtering transactions...");
    });
});
