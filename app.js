let chart;

async function scan() {
  const address = document.getElementById("address").value;
  const chain = document.getElementById("chain").value;

  const res = await fetch(`https://YOUR_BACKEND_URL/scan?chain=${chain}&address=${address}`);
  const data = await res.json();

  document.getElementById("result").innerHTML = `
    <h3>${data.name} (${data.symbol})</h3>
    <p>Liquidity: $${data.liquidity}</p>
    <p>Holders: ${data.holders}</p>
    <p>Risk Score: ${data.risk}/100</p>
  `;

  renderChart(data.priceHistory);
}

function renderChart(prices) {
  const ctx = document.getElementById('chart').getContext('2d');
  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: prices.map(p => p.time),
      datasets: [{
        data: prices.map(p => p.price),
        borderColor: 'gold'
      }]
    }
  });
}
