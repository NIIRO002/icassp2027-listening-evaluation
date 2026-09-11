(() => {
  const data = window.SMOKE_DATA;
  const root = document.getElementById("sampleRoot");
  const player = (src, label, className = "") => `
    <div class="audio-cell ${className}">
      <span>${label}</span>
      <audio controls preload="none" src="${src}"></audio>
    </div>`;

  data.pairs.forEach(pair => {
    const article = document.createElement("article");
    article.className = "pair";
    article.innerHTML = `
      <div class="pair-head">
        <div><h3>${pair.label}</h3><p>${pair.source} → ${pair.target}</p></div>
        ${player(`smoke-audio/${pair.id}/neutral.wav`, "Neutral", "neutral")}
      </div>`;

    data.axes.forEach(axis => {
      const heading = document.createElement("h4");
      heading.textContent = axis.label;
      article.appendChild(heading);
      axis.endpoints.forEach(endpoint => {
        const row = document.createElement("div");
        row.className = "audio-row";
        row.innerHTML = `<strong>${endpoint.label}</strong>` + data.supports.map(support =>
          player(
            `smoke-audio/${pair.id}/${axis.key}_${support.key}_${endpoint.key}.wav`,
            support.label
          )
        ).join("");
        article.appendChild(row);
      });
    });
    root.appendChild(article);
  });
})();
