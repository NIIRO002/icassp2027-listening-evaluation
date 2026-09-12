(() => {
  const root = document.getElementById("sampleRoot");

  const player = (base, track, className = "") => `
    <div class="player ${className}">
      <div class="player-label">
        <strong>${track.label}</strong>
        ${track.control ? `<span>${track.control}</span>` : ""}
      </div>
      <audio controls preload="metadata" aria-label="${track.label}" src="demo-audio/${base}/${track.file}"></audio>
    </div>`;

  window.DEMO_DATA.examples.forEach((example, index) => {
    const article = document.createElement("article");
    article.className = "example";
    article.innerHTML = `
      <div class="example-heading">
        <div>
          <p class="example-number">Example ${index + 1}</p>
          <h3>${example.title}</h3>
          <p>${example.direction}</p>
        </div>
        <div class="pair-meta">
          <strong>${example.pair}</strong>
          <span>${example.language}</span>
          <span>${example.note}</span>
        </div>
      </div>
      <div class="context-row">
        ${example.context.map(track => player(example.key, track, "context-player")).join("")}
      </div>
      <div class="output-row">
        ${example.outputs.map(track => player(example.key, track, track.neutral ? "neutral" : "")).join("")}
      </div>`;
    root.appendChild(article);
  });
})();
