document.addEventListener('DOMContentLoaded', function() {
    const currencyOptions = ['USD', 'EUR', 'GBP', 'JPY', 'CAD'];
    const baseCurrencySelect = document.getElementById('baseCurrency');
    const convertToCurrencySelect = document.getElementById('convertToCurrency');
    const fromDateInput = document.getElementById('fromDate');
    const toDateInput = document.getElementById('toDate');

    currencyOptions.forEach(currency => {
        let option = new Option(currency, currency);
        baseCurrencySelect.add(option.cloneNode(true));
        convertToCurrencySelect.add(option.cloneNode(true));
    });

    document.getElementById('showResults').addEventListener('click', function() {
        const baseCurrency = baseCurrencySelect.value;
        const convertToCurrency = convertToCurrencySelect.value;
        const fromDate = fromDateInput.value;
        const toDate = toDateInput.value;
        
        if (!baseCurrency || !convertToCurrency || !fromDate || !toDate) {
            alert('Please fill in all fields.');
            return;
        }

        const apiUrl = `https://api.polygon.io/v2/aggs/ticker/C:${baseCurrency}${convertToCurrency}/range/1/day/${fromDate}/${toDate}?adjusted=true&sort=asc&apiKey=luphhR35JJPQ5kDr5PV4_gxQMIZnfOVS`;

        $.ajax({
            url: apiUrl,
            type: 'GET',
            success: function(response) {
                const labels = response.results.map(item => new Date(item.t).toLocaleDateString());
                const data = response.results.map(item => item.c);
                const ctx = document.getElementById("chartjs-0").getContext('2d');
                if (window.myChart) {
                    window.myChart.destroy();
                }
                window.myChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: `${baseCurrency}/${convertToCurrency}`,
                            data: data,
                            fill: false,
                            borderColor: 'rgb(75, 192, 192)',
                            tension: 0.1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                    }
                });
            },
            error: function(xhr) {
                consterrorMessage = xhr.status + ': ' + xhr.statusText;
                alert('Error - ' + errorMessage);
            }
        });
    });

    document.getElementById('clear').addEventListener('click', function() {
        fromDateInput.value = '';
        toDateInput.value = '';
        baseCurrencySelect.selectedIndex = 0;
        convertToCurrencySelect.selectedIndex = 0;
        if (window.myChart) {
            window.myChart.destroy();
            window.myChart = null;
        }
    });
});