(() => {
  const grid = document.getElementById("gameGrid");
  if (!grid || typeof GAMES === "undefined") return;

  for (const game of GAMES) {
    const isLive = game.status === "live";
    const el = document.createElement(isLive ? "a" : "div");
    el.className = `game-tile accent-${game.accent}${isLive ? "" : " is-soon"}`;
    if (isLive) {
      el.href = game.href;
    } else {
      el.setAttribute("aria-disabled", "true");
    }

    el.innerHTML = `
      <span class="game-tag">${game.tag}</span>
      <h3 class="game-title">${game.title}</h3>
      <p class="game-blurb">${game.blurb}</p>
      <span class="game-cta">${isLive ? "Play" : "Soon"}</span>
    `;

    grid.appendChild(el);
  }
})();
