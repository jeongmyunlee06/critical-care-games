(() => {
  const sheetEl = document.getElementById("sheet");
  const slotsEl = document.getElementById("slots");
  const scatterEl = document.getElementById("scatter");
  const connectorsEl = document.getElementById("connectors");
  const startBtn = document.getElementById("startBtn");
  const timerDisplay = document.getElementById("timerDisplay");
  const bestDisplay = document.getElementById("bestDisplay");
  const compareNote = document.getElementById("compareNote");
  const progressFill = document.getElementById("progressFill");
  const progressText = document.getElementById("progressText");
  const hintEl = document.getElementById("hint");
  const adviceModal = document.getElementById("adviceModal");
  const adviceBody = document.getElementById("adviceBody");
  const finalTime = document.getElementById("finalTime");
  const compareFinal = document.getElementById("compareFinal");
  const playAgainBtn = document.getElementById("playAgainBtn");

  const state = {
    playing: false,
    placed: new Set(),
    startMs: 0,
    elapsedMs: 0,
    timerId: null,
    bestMs: loadBest(),
    drag: null,
    behavior: freshBehavior(),
  };

  function freshBehavior() {
    return {
      wrongDrops: 0,
      correctDrops: 0,
      pathwayWrong: { extrinsic: 0, intrinsic: 0, common: 0, start: 0 },
      pathwayCorrect: { extrinsic: 0, intrinsic: 0, common: 0, start: 0 },
      firstMoveMs: null,
      lastActionMs: null,
      hesitations: 0,
      attemptsByTile: {},
      orderPlaced: [],
    };
  }

  function loadBest() {
    const raw = localStorage.getItem(STORAGE_KEY);
    const n = Number(raw);
    return Number.isFinite(n) && n > 0 ? n : null;
  }

  function saveBest(ms) {
    localStorage.setItem(STORAGE_KEY, String(ms));
    state.bestMs = ms;
  }

  function formatTime(ms) {
    const totalTenths = Math.floor(ms / 100);
    const tenths = totalTenths % 10;
    const totalSeconds = Math.floor(totalTenths / 10);
    const seconds = totalSeconds % 60;
    const minutes = Math.floor(totalSeconds / 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${tenths}`;
  }

  function tileById(id) {
    return CASCADE_TILES.find((t) => t.id === id);
  }

  function renderBest() {
    if (state.bestMs == null) {
      bestDisplay.textContent = "—";
      bestDisplay.classList.add("muted");
    } else {
      bestDisplay.textContent = formatTime(state.bestMs);
      bestDisplay.classList.remove("muted");
    }
  }

  function updateProgress() {
    const total = CASCADE_TILES.length;
    const done = state.placed.size;
    progressFill.style.width = `${total ? (done / total) * 100 : 0}%`;
    progressText.textContent = `${done} / ${total}`;
  }

  function centerOf(tile) {
    return {
      x: ((tile.x + tile.w / 2) / 100) * 1000,
      y: ((tile.y + tile.h / 2) / 100) * 720,
    };
  }

  function drawConnectors() {
    connectorsEl.innerHTML = "";
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
    marker.setAttribute("id", "arrowHead");
    marker.setAttribute("markerWidth", "7");
    marker.setAttribute("markerHeight", "7");
    marker.setAttribute("refX", "6");
    marker.setAttribute("refY", "3.5");
    marker.setAttribute("orient", "auto");
    const tip = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    tip.setAttribute("points", "0 0, 7 3.5, 0 7");
    tip.setAttribute("fill", "rgba(60, 90, 100, 0.45)");
    marker.appendChild(tip);
    defs.appendChild(marker);
    connectorsEl.appendChild(defs);

    for (const [fromId, toId] of CASCADE_EDGES) {
      const from = tileById(fromId);
      const to = tileById(toId);
      if (!from || !to) continue;
      const a = centerOf(from);
      const b = centerOf(to);
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      const mx = (a.x + b.x) / 2;
      const my = (a.y + b.y) / 2;
      // gentle elbow for mostly-vertical or mostly-horizontal flows
      const dx = Math.abs(b.x - a.x);
      const dy = Math.abs(b.y - a.y);
      let d;
      if (dy > dx * 1.2) {
        d = `M${a.x.toFixed(1)} ${a.y.toFixed(1)} L${a.x.toFixed(1)} ${my.toFixed(1)} L${b.x.toFixed(1)} ${my.toFixed(1)} L${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
      } else if (dx > dy * 1.2) {
        d = `M${a.x.toFixed(1)} ${a.y.toFixed(1)} L${mx.toFixed(1)} ${a.y.toFixed(1)} L${mx.toFixed(1)} ${b.y.toFixed(1)} L${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
      } else {
        d = `M${a.x.toFixed(1)} ${a.y.toFixed(1)} Q${mx.toFixed(1)} ${my.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
      }
      path.setAttribute("d", d);
      path.setAttribute("marker-end", "url(#arrowHead)");
      connectorsEl.appendChild(path);
    }
  }

  function createTileElement(tile, { locked = false, scattered = false } = {}) {
    const el = document.createElement("button");
    el.type = "button";
    el.className = `tile kind-${tile.kind}`;
    el.dataset.tileId = tile.id;
    if (locked) el.classList.add("locked");
    if (scattered) el.classList.add("scattered");

    const label = document.createElement("span");
    label.textContent = tile.label;
    el.appendChild(label);

    if (!locked) {
      el.addEventListener("pointerdown", onPointerDown);
    }

    return el;
  }

  function buildSlots() {
    slotsEl.innerHTML = "";
    for (const tile of CASCADE_TILES) {
      const slot = document.createElement("div");
      slot.className = `slot kind-${tile.kind}`;
      slot.dataset.slotId = tile.id;
      slot.dataset.pathway = tile.pathway;
      slot.style.left = `${tile.x}%`;
      slot.style.top = `${tile.y}%`;
      slot.style.width = `${tile.w}%`;
      slot.style.height = `${tile.h}%`;
      slot.setAttribute("aria-label", `Slot for ${tile.label}`);
      slotsEl.appendChild(slot);
    }
  }

  function clearPlaced() {
    slotsEl.querySelectorAll(".slot").forEach((slot) => {
      slot.classList.remove("filled", "correct-flash", "wrong-flash", "drag-over");
      slot.innerHTML = "";
    });
    scatterEl.innerHTML = "";
  }

  function overlapRatio(a, b) {
    const x1 = Math.max(a.x, b.x);
    const y1 = Math.max(a.y, b.y);
    const x2 = Math.min(a.x + a.w, b.x + b.w);
    const y2 = Math.min(a.y + a.h, b.y + b.h);
    const iw = Math.max(0, x2 - x1);
    const ih = Math.max(0, y2 - y1);
    const inter = iw * ih;
    if (!inter) return 0;
    const smaller = Math.min(a.w * a.h, b.w * b.h);
    return smaller ? inter / smaller : 0;
  }

  function scatterTiles(tiles) {
    scatterEl.innerHTML = "";
    const sheetRect = sheetEl.getBoundingClientRect();
    const placedBoxes = [];

    for (const tile of tiles) {
      const el = createTileElement(tile, { scattered: true });
      scatterEl.appendChild(el);

      // Measure natural size after mount
      const tw = el.offsetWidth;
      const th = el.offsetHeight;
      const maxX = Math.max(0, sheetRect.width - tw);
      const maxY = Math.max(0, sheetRect.height - th);

      let best = null;
      let bestScore = Infinity;

      for (let attempt = 0; attempt < 120; attempt += 1) {
        const x = Math.random() * maxX;
        const y = Math.random() * maxY;
        const box = { x, y, w: tw, h: th };
        let worst = 0;
        for (const other of placedBoxes) {
          worst = Math.max(worst, overlapRatio(box, other));
        }
        if (worst <= MAX_OVERLAP) {
          best = box;
          bestScore = worst;
          break;
        }
        if (worst < bestScore) {
          bestScore = worst;
          best = box;
        }
      }

      const pos = best || { x: Math.random() * maxX, y: Math.random() * maxY, w: tw, h: th };
      el.style.left = `${pos.x}px`;
      el.style.top = `${pos.y}px`;
      placedBoxes.push(pos);
    }
  }

  function stopTimer() {
    if (state.timerId) {
      clearInterval(state.timerId);
      state.timerId = null;
    }
  }

  function startTimer() {
    stopTimer();
    state.startMs = performance.now();
    state.elapsedMs = 0;
    timerDisplay.textContent = formatTime(0);
    state.timerId = setInterval(() => {
      state.elapsedMs = performance.now() - state.startMs;
      timerDisplay.textContent = formatTime(state.elapsedMs);
      if (state.bestMs != null) {
        const delta = state.elapsedMs - state.bestMs;
        compareNote.hidden = false;
        if (delta <= 0) {
          compareNote.textContent = `${formatTime(Math.abs(delta))} under best`;
          compareNote.className = "compare-note better";
        } else {
          compareNote.textContent = `${formatTime(delta)} over best`;
          compareNote.className = "compare-note worse";
        }
      }
    }, 100);
  }

  function recordActionTiming() {
    const now = performance.now();
    if (state.behavior.firstMoveMs == null) {
      state.behavior.firstMoveMs = now - state.startMs;
    }
    if (state.behavior.lastActionMs != null && now - state.behavior.lastActionMs > 8000) {
      state.behavior.hesitations += 1;
    }
    state.behavior.lastActionMs = now;
  }

  function flash(el, className, ms) {
    el.classList.remove("correct-flash", "wrong-flash");
    void el.offsetWidth;
    el.classList.add(className);
    window.setTimeout(() => el.classList.remove(className), ms);
  }

  function slotAtPoint(clientX, clientY) {
    const stack = document.elementsFromPoint(clientX, clientY);
    return stack.find((n) => n.classList?.contains("slot")) || null;
  }

  function onPointerDown(e) {
    if (!state.playing || e.button !== 0) return;
    const el = e.currentTarget;
    if (el.classList.contains("locked")) return;

    e.preventDefault();
    el.setPointerCapture(e.pointerId);

    const rect = el.getBoundingClientRect();
    const sheetRect = sheetEl.getBoundingClientRect();

    state.drag = {
      el,
      tileId: el.dataset.tileId,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
      originLeft: parseFloat(el.style.left) || rect.left - sheetRect.left,
      originTop: parseFloat(el.style.top) || rect.top - sheetRect.top,
      pointerId: e.pointerId,
    };

    el.classList.add("dragging");
    el.style.zIndex = "30";

    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointercancel", onPointerUp);
  }

  function onPointerMove(e) {
    const drag = state.drag;
    if (!drag || drag.pointerId !== e.pointerId) return;

    const sheetRect = sheetEl.getBoundingClientRect();
    const tw = drag.el.offsetWidth;
    const th = drag.el.offsetHeight;
    let x = e.clientX - sheetRect.left - drag.offsetX;
    let y = e.clientY - sheetRect.top - drag.offsetY;
    x = Math.max(0, Math.min(x, sheetRect.width - tw));
    y = Math.max(0, Math.min(y, sheetRect.height - th));

    drag.el.style.left = `${x}px`;
    drag.el.style.top = `${y}px`;

    slotsEl.querySelectorAll(".slot.drag-over").forEach((s) => s.classList.remove("drag-over"));
    const slot = slotAtPoint(e.clientX, e.clientY);
    if (slot && !slot.classList.contains("filled")) slot.classList.add("drag-over");
  }

  function onPointerUp(e) {
    const drag = state.drag;
    if (!drag || drag.pointerId !== e.pointerId) return;

    const el = drag.el;
    el.releasePointerCapture?.(e.pointerId);
    el.removeEventListener("pointermove", onPointerMove);
    el.removeEventListener("pointerup", onPointerUp);
    el.removeEventListener("pointercancel", onPointerUp);
    el.classList.remove("dragging");
    el.style.zIndex = "";

    slotsEl.querySelectorAll(".slot.drag-over").forEach((s) => s.classList.remove("drag-over"));

    const slot = slotAtPoint(e.clientX, e.clientY);
    const tileId = drag.tileId;
    const tile = tileById(tileId);
    state.drag = null;

    if (!state.playing || !tile || state.placed.has(tileId)) return;

    if (!slot || slot.classList.contains("filled")) {
      // snap back already at last free position
      return;
    }

    recordActionTiming();
    state.behavior.attemptsByTile[tileId] = (state.behavior.attemptsByTile[tileId] || 0) + 1;

    const slotTile = tileById(slot.dataset.slotId);
    const correct =
      !!slotTile &&
      (slotTile.id === tileId ||
        (tile.group && slotTile.group && tile.group === slotTile.group));

    if (!correct) {
      state.behavior.wrongDrops += 1;
      state.behavior.pathwayWrong[tile.pathway] =
        (state.behavior.pathwayWrong[tile.pathway] || 0) + 1;
      flash(slot, "wrong-flash", 700);
      // return tile near drop, still free
      return;
    }

    state.behavior.correctDrops += 1;
    state.behavior.pathwayCorrect[tile.pathway] =
      (state.behavior.pathwayCorrect[tile.pathway] || 0) + 1;
    state.behavior.orderPlaced.push(tileId);
    state.placed.add(tileId);

    el.remove();
    slot.classList.add("filled");
    slot.appendChild(createTileElement(tile, { locked: true }));
    flash(slot, "correct-flash", 1500);
    updateProgress();

    if (state.placed.size === CASCADE_TILES.length) completeRun();
  }

  function pathwayAccuracy(pathway) {
    const ok = state.behavior.pathwayCorrect[pathway] || 0;
    const bad = state.behavior.pathwayWrong[pathway] || 0;
    const total = ok + bad;
    if (!total) return null;
    return ok / total;
  }

  function buildAdvice() {
    const b = state.behavior;
    const tips = [];
    const elapsed = state.elapsedMs;
    const intrinsicAcc = pathwayAccuracy("intrinsic");
    const extrinsicAcc = pathwayAccuracy("extrinsic");
    const commonAcc = pathwayAccuracy("common");

    if (b.wrongDrops === 0) {
      tips.push({
        title: "Precision",
        text: "Perfect placement. Keep using Injury as the anchor, then fill Extrinsic left and Intrinsic right before the common stem.",
      });
    } else if (b.wrongDrops / Math.max(1, b.correctDrops + b.wrongDrops) > 0.35) {
      tips.push({
        title: "Placement discipline",
        text: "High miss rate. Match shape and color first (starburst, blue zymogen, orange activated), then confirm the pathway column.",
      });
    }

    if (intrinsicAcc != null && intrinsicAcc < 0.7) {
      tips.push({
        title: "Intrinsic pathway",
        text: "Drill XII → XIIa → XI → XIa (+ HMW kininogen) → IX → IXa, then VIII/VIIIa + Platelet Phospholipids into the Factor X activator Complex.",
      });
    }

    if (extrinsicAcc != null && extrinsicAcc < 0.7) {
      tips.push({
        title: "Extrinsic pathway",
        text: "Damaged Tissue → Tissue factor (III) → IIIa, then VII + Ca²⁺ form the VII–III complex that feeds Factor X.",
      });
    }

    if (commonAcc != null && commonAcc < 0.75) {
      tips.push({
        title: "Common pathway",
        text: "X → Xa (prothrombinase) → Prothrombin/Thrombin → Fibrinogen/Fibrin, then XIII → XIIIa for Cross-linking of fibrin!",
      });
    }

    if (b.firstMoveMs != null && b.firstMoveMs > 12000) {
      tips.push({
        title: "Opening tempo",
        text: "Long pause before the first move. Spend five seconds reading the faint pathway skeleton, then place Injury.",
      });
    }

    if (b.hesitations >= 3) {
      tips.push({
        title: "Flow",
        text: "Several long mid-run pauses. Work one pathway fully before hopping across the sheet.",
      });
    }

    const hardTiles = Object.entries(b.attemptsByTile)
      .filter(([, n]) => n >= 3)
      .map(([id]) => tileById(id)?.label)
      .filter(Boolean);

    if (hardTiles.length) {
      tips.push({
        title: "Sticky tiles",
        text: `You retried ${hardTiles.slice(0, 3).join(", ")} often. Rehearse those nodes on the sample map before the next run.`,
      });
    }

    if (elapsed > 180000) {
      tips.push({
        title: "Efficiency",
        text: "Long completion time. Next run: clear Ca²⁺ and cofactor dots early — they unlock several junctions.",
      });
    }

    if (!tips.length) {
      tips.push({
        title: "Solid run",
        text: "Balanced pathway accuracy. Next goal: beat your best while naming each activation aloud.",
      });
    }

    return tips.slice(0, 4);
  }

  function completeRun() {
    state.playing = false;
    stopTimer();
    state.elapsedMs = performance.now() - state.startMs;
    timerDisplay.textContent = formatTime(state.elapsedMs);
    startBtn.disabled = false;
    startBtn.textContent = "Start";
    startBtn.classList.add("pulse");
    sheetEl.classList.add("is-complete");
    hintEl.textContent = "Complete — review your advice, then Start for a new run.";

    const prevBest = state.bestMs;
    let isNewBest = false;
    if (prevBest == null || state.elapsedMs < prevBest) {
      saveBest(state.elapsedMs);
      isNewBest = true;
    }
    renderBest();

    finalTime.textContent = `Time ${formatTime(state.elapsedMs)}`;
    if (prevBest == null) {
      compareFinal.textContent = "First recorded finish — this is your baseline best.";
    } else if (isNewBest) {
      compareFinal.textContent = `New best! Previous best was ${formatTime(prevBest)}.`;
    } else {
      compareFinal.textContent = `Best remains ${formatTime(prevBest)} (+${formatTime(state.elapsedMs - prevBest)} this run).`;
    }

    adviceBody.innerHTML = "";
    for (const tip of buildAdvice()) {
      const p = document.createElement("p");
      p.className = "advice-item";
      p.innerHTML = `<strong>${tip.title}</strong>${tip.text}`;
      adviceBody.appendChild(p);
    }
    adviceModal.hidden = false;
  }

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function resetToIdle() {
    state.playing = false;
    state.placed = new Set();
    state.drag = null;
    stopTimer();
    clearPlaced();
    sheetEl.classList.add("is-idle");
    sheetEl.classList.remove("is-complete");
    timerDisplay.textContent = formatTime(0);
    compareNote.hidden = true;
    compareNote.textContent = "";
    startBtn.disabled = false;
    startBtn.textContent = "Start";
    startBtn.classList.add("pulse");
    hintEl.textContent = "Press Start — tiles scatter over the answer sheet.";
    updateProgress();
    adviceModal.hidden = true;
  }

  function startGame() {
    adviceModal.hidden = true;
    state.playing = true;
    state.placed = new Set();
    state.behavior = freshBehavior();
    state.drag = null;

    sheetEl.classList.remove("is-idle", "is-complete");
    clearPlaced();
    scatterTiles(shuffle(CASCADE_TILES));
    updateProgress();
    compareNote.hidden = state.bestMs == null;
    compareNote.textContent = "";
    compareNote.className = "compare-note";

    startBtn.disabled = true;
    startBtn.classList.remove("pulse");
    startBtn.textContent = "In play";
    hintEl.textContent = "Drag scattered tiles onto their matching slots on the answer sheet.";

    startTimer();
  }

  function init() {
    drawConnectors();
    buildSlots();
    resetToIdle();
    renderBest();

    startBtn.addEventListener("click", startGame);
    playAgainBtn.addEventListener("click", () => {
      adviceModal.hidden = true;
      startGame();
    });
    adviceModal.addEventListener("click", (e) => {
      if (e.target === adviceModal) resetToIdle();
    });

    window.addEventListener("resize", () => {
      if (state.playing && state.placed.size === 0) {
        scatterTiles(shuffle(CASCADE_TILES.filter((t) => !state.placed.has(t.id))));
      }
    });
  }

  init();
})();
