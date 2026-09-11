(() => {
  const data = window.SMOKE_DATA;
  const root = document.getElementById("sampleRoot");
  const audio = (src, label) => `<div class="audio-cell"><span>${label}</span><audio controls preload="none" src="${src}"></audio></div>`;

  data.pairs.forEach((pair, pairIndex) => {
    const section = document.createElement("article");
    section.className = "pair-card";
    section.innerHTML = `
      <header><div><span class="pair-number">${String(pairIndex + 1).padStart(2, "0")}</span><div><h3>${pair.label}</h3><p>${pair.source} → ${pair.target}</p></div></div>${audio(`smoke-audio/${pair.id}/neutral.wav`, "Neutral")}</header>
      <div class="pair-body"></div>`;
    const body = section.querySelector(".pair-body");
    data.axes.forEach(axis => {
      const axisBlock = document.createElement("section");
      axisBlock.className = "axis-block";
      axisBlock.innerHTML = `<h4>${axis.label}</h4>`;
      axis.endpoints.forEach(endpoint => {
        const row = document.createElement("div");
        row.className = "comparison-row";
        row.innerHTML = `<strong>${endpoint.label}</strong>` + data.supports.map(support =>
          audio(`smoke-audio/${pair.id}/${axis.key}_${support.key}_${endpoint.key}.wav`, support.label)
        ).join("");
        axisBlock.appendChild(row);
      });
      body.appendChild(axisBlock);
    });
    root.appendChild(section);
  });
})();
