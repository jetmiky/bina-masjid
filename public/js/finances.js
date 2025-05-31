$(document).ready(() => {
    const mosqueId = window.auth.getUid();
    let isTransactionsEmpty = true;

    loadTransactions(mosqueId);

    // Export PDF functionality
    $("#export-pdf").on("click", () => {
        $.ajax(`/mosques/${mosqueId}/finances/report`, {
            xhrFields: {
                responseType: "blob",
            },
            success: (blob) => {
                const link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                link.download = "FinanceReport.pdf";
                link.click();

                link.remove();
            },
            error: (e) => {
                alert("Failed getting Finance Report");
                console.error(e.responseJSON.message);
            },
        });
    });

    function loadTransactions(mosqueId) {
        $.ajax(`/mosques/${mosqueId}/finances`, {
            success: (response) => {
                const { records, total } = response.data;

                if (records.length) {
                    isTransactionsEmpty = false;

                    $("#js-income").text(formatCurrency(total.income));
                    $("#js-expense").text(formatCurrency(total.expense));
                    $("#js-net-balance").text(formatCurrency(total.net));

                    for (const record of records) {
                        renderTransaction(record);
                    }
                } else {
                    $(".transactions-table")
                        .children("tbody")
                        .append(
                            `<tr>
                                <td colspan="5" class="text-center">No transactions yet</td>
                            </tr>`,
                        );
                }
            },
        });
    }

    function deleteTransaction(id) {
        $.ajax({
            url: `/mosques/${mosqueId}/finances/${id}`,
            method: "DELETE",
            success: (response) => {
                alert("Transaction deleted");

                $("tbody")
                    .children("tr[data-id='" + id + "']")
                    .remove();
            },
            error: (e) => {
                console.error(e.responseJSON.message);
            },
        });
    }

    $("#transaction-form").on("submit", (e) => {
        e.preventDefault();

        $.ajax({
            url: `/mosques/${mosqueId}/finances`,
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                type: $("#transaction-type").val(),
                amount: Number.parseInt($("#transaction-amount").val()),
                description: $("#transaction-description").val(),
                date: new Date($("#transaction-date").val()).toISOString(),
            }),
            success: (response) => {
                const record = response.data;
                alert("Transaction successfully added!");

                if (isTransactionsEmpty) {
                    isTransactionsEmpty = false;
                    $(".transactions-table").children("tbody").empty();
                }

                $("#transaction-form").trigger("reset");
                $("#transaction-form").addClass("hidden");
                $(".transactions-list").show();
                renderTransaction(record);
            },
            error: (e) => {
                alert("Failed to add transaction");
                console.error(e.responseJSON.message);
            },
        });
    });

    function renderTransaction(transaction) {
        const btn = $(
            `<button class="btn btn-icon"><img src="../assets/icons/delete.svg" alt="Delete" /></button>`,
        );
        btn.on("click", () => deleteTransaction(transaction.id));

        const item = $(`
            <tr data-id="${transaction.id}">
                <td>${formatDate(transaction.date)}</td>
                <td>${transaction.description}</td>
                <td><span class="badge ${transaction.type === "expense" ? "expense" : "donation"}">${capitalizeFirst(transaction.type)}</span></td>
                <td class="amount ${transaction.type === "expense" ? "negative" : "positive"}">${transaction.type === "expense" ? "-" : "+"} ${formatCurrency(transaction.amount)}</td>
                <td class="transaction-actions"></td>
            </tr>`);

        $(item).appendTo("tbody");
        $(item).children(".transaction-actions").append(btn);
    }
});

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
