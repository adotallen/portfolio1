const ctx = document.getElementById('uvChart');
    let uvChart;

    document.getElementById('fetchBtn').addEventListener('click', async () => {
      const query = document.getElementById('locationInput').value.trim();
      if (!query) {
        alert("Please enter a city or ZIP code.");
        return;
      }

      try {
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`);
        const geoData = await geoRes.json();

        if (!geoData.results || geoData.results.length === 0) {
          alert("Location not found. Try again.");
          return;
        }

        const { latitude, longitude, name } = geoData.results[0];

        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&past_days=5&forecast_days=5&daily=uv_index_max&timezone=auto`);
        const weatherData = await weatherRes.json();

        const dates = weatherData.daily.time;
        const uvValues = weatherData.daily.uv_index_max;

        if (uvChart) uvChart.destroy();
        uvChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: dates,
            datasets: [{
              label: `Daily UV Index for ${name}`,
              data: uvValues,
              borderColor: 'rgba(255, 99, 132, 1)',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              tension: 0.2,
              fill: true,
              pointRadius: 4
            }]
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
                title: { display: true, text: 'UV Index' }
              },
              x: {
                title: { display: true, text: 'Date' }
              }
            }
          }
        });

      } catch (error) {
        console.error(error);
        alert("Error fetching data. Try again later.");
      }
    });