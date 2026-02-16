async function scan() {
  const address = document.getElementById("address").value.trim();
  const chain = document.getElementById("chain").value;

  if (!address) {
    alert("Please enter a contract address");
    return;
  }

  document.getElementById("results").innerHTML = "Analyzing contract...";

  try {

    const dex = await fetch(
      `https://api.dexscreener.com/latest/dex/tokens/${address}`
    );
    const dexData = await dex.json();
    const pair = dexData.pairs?.[0];

    if (!pair) {
      document.getElementById("results").innerHTML =
        "<p>No data found for this contract.</p>";
      return;
    }

    const name = pair.baseToken.name || "Unknown";
    const symbol = pair.baseToken.symbol || "";
    const price = parseFloat(pair.priceUsd || 0).toFixed(8);
    const liquidity = parseFloat(pair.liquidity?.usd || 0);
    const volume24h = parseFloat(pair.volume?.h24 || 0);
    const fdv = parseFloat(pair.fdv || 0);

    const riskScore = calculateRisk(liquidity, volume24h, fdv);

    // COINGECKO API: Get website & social
    const coingecko = await fetch(
      `https://api.coingecko.com/api/v3/coins/ethereum/contract/${address.toLowerCase()}`
    );

    const cgData = await coingecko.json();

    const links = {
      homepage: cgData?.links?.homepage?.[0] || "-",
      twitter: cgData?.links?.twitter_screen_name
        ? `https://twitter.com/${cgData.links.twitter_screen_name}`
        : "-",
      reddit: cgData?.links?.subreddit_url || "-",
      telegram: cgData?.links?.telegram_channel_identifier
        ? `https://t.me/${cgData.links.telegram_channel_identifier}`
        : "-",
      github: cgData?.links?.repos_url?.github?.[0] || "-",
      whitepaper: cgData?.links?.official_forum_url?.[0] || "-"
    };

    document.getElementById("results").innerHTML = `
      <h2>${name} (${symbol})</h2>
      <p><strong>Price:</strong> $${price}</p>
      <p><strong>Liquidity:</strong> $${liquidity.toLocaleString()}</p>
      <p><strong>24H Volume:</strong> $${volume24h.toLocaleString()}</p>
      <p><strong>FDV:</strong> $${fdv.toLocaleString()}</p>
      <p><strong>AI Risk Score:</strong> ${riskScore}/100</p>

      <h3>Website & Socials</h3>
      <ul>
        <li><strong>Homepage:</strong> <a href="${links.homepage}" target="_blank">${links.homepage}</a></li>
        <li><strong>Twitter:</strong> <a href="${links.twitter}" target="_blank">${links.twitter}</a></li>
        <li><strong>Reddit:</strong> <a href="${links.reddit}" target="_blank">${links.reddit}</a></li>
        <li><strong>Telegram:</strong> <a href="${links.telegram}" target="_blank">${links.telegram}</a></li>
        <li><strong>GitHub:</strong> <a href="${links.github}" target="_blank">${links.github}</a></li>
        <li><strong>Whitepaper:</strong> <a href="${links.whitepaper}" target="_blank">${links.whitepaper}</a></li>
      </ul>
    `;

    renderChart(address);

  } catch (error) {
    console.error(error);
    document.getElementById("results").innerHTML =
      "<p>Error fetching data.</p>";
  }
}
