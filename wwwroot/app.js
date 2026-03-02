const els = {
  createBtn: document.getElementById("createBtn"),
  joinBtn: document.getElementById("joinBtn"),
  joinGameId: document.getElementById("joinGameId"),
  gameIdOut: document.getElementById("gameIdOut"),
  playerTokenOut: document.getElementById("playerTokenOut"),
  setup: document.getElementById("setup"),
  game: document.getElementById("game"),

  statusOut: document.getElementById("statusOut"),
  activeOut: document.getElementById("activeOut"),
  wordOut: document.getElementById("wordOut"),
  pendingOut: document.getElementById("pendingOut"),
  p1Out: document.getElementById("p1Out"),
  p2Out: document.getElementById("p2Out"),
  p1ScoreOut: document.getElementById("p1ScoreOut"),
  p2ScoreOut: document.getElementById("p2ScoreOut"),

  letterIn: document.getElementById("letterIn"),
  playBtn: document.getElementById("playBtn"),
  claimBtn: document.getElementById("claimBtn"),
  disputeRow: document.getElementById("disputeRow"),
  acceptBtn: document.getElementById("acceptBtn"),
  disputeBtn: document.getElementById("disputeBtn"),

  log: document.getElementById("log"),
};

let state = {
  gameId: null,
  playerToken: null,
  game: null,
  pollTimer: null,
};

function log(msg) {
  const ts = new Date().toLocaleTimeString();
  els.log.textContent = `[${ts}] ${msg}\n` + els.log.textContent;
}

function setCreds(gameId, playerToken) {
  state.gameId = gameId;
  state.playerToken = playerToken;

  els.gameIdOut.textContent = gameId ?? "-";
  els.playerTokenOut.textContent = playerToken ?? "-";

  // put join field for convenience
  els.joinGameId.value = gameId ?? "";

  if (gameId && playerToken) {
    els.game.classList.remove("hidden");
    startPolling();
  }
}

async function api(path, options = {}) {
  const headers = options.headers || {};
  headers["Content-Type"] = "application/json";
  if (state.playerToken) headers["X-Player-Token"] = state.playerToken;
  const res = await fetch(path, { ...options, headers });

  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { /* ignore */ }

  if (!res.ok) {
    const msg = data?.error || `${res.status} ${res.statusText}`;
    throw new Error(msg);
  }
  return data;
}

function render(game) {
  if (!game) return;

  els.statusOut.textContent = game.status;
  els.activeOut.textContent = game.activePlayerId;
  els.wordOut.textContent = game.currentWord || "(empty)";

  els.p1Out.textContent = game.player1Id;
  els.p2Out.textContent = game.player2Id ?? "(not joined)";
  els.p1ScoreOut.textContent = game.player1Score;
  els.p2ScoreOut.textContent = game.player2Score;

  const pending = game.status === "PendingDispute"
    ? `claimer=${game.pendingClaimerId} word="${game.pendingWord}"`
    : "(none)";
  els.pendingOut.textContent = pending;

  const canRespond = game.status === "PendingDispute" &&
    game.player2Id &&
    game.pendingClaimerId &&
    state.playerToken &&
    state.playerToken !== game.pendingClaimerId;

  els.disputeRow.classList.toggle("hidden", !canRespond);

  const myTurn = state.playerToken &&
      game.activePlayerId === state.playerToken &&
      game.status === "InProgress";

  const canClaimAfterLast =
      state.playerToken &&
      game.status === "InProgress" &&
      game.lastLetterPlayerId === state.playerToken;

  els.playBtn.disabled = !myTurn;
  els.letterIn.disabled = !myTurn;

  // Claim är tillåtet om:
  // 1) det är din tur
  // 2) eller du var den som la senaste bokstaven
  els.claimBtn.disabled = !(myTurn || canClaimAfterLast);
  els.playBtn.disabled = !myTurn;
  els.letterIn.disabled = !myTurn;

  if (myTurn) els.letterIn.focus();
}

async function refresh() {
  if (!state.gameId) return;
  const game = await api(`/games/${state.gameId}`, { method: "GET" });
  state.game = game;
  render(game);
}

function startPolling() {
  stopPolling();
  refresh().catch(e => log(`refresh error: ${e.message}`));
  state.pollTimer = setInterval(() => {
    refresh().catch(() => {});
  }, 800);
}

function stopPolling() {
  if (state.pollTimer) clearInterval(state.pollTimer);
  state.pollTimer = null;
}

// --- Actions ---
els.createBtn.addEventListener("click", async () => {
  try {
    const res = await api("/games", { method: "POST" });
    setCreds(res.gameId, res.playerToken);
    log(`Created game ${res.gameId}`);
  } catch (e) { log(e.message); }
});

els.joinBtn.addEventListener("click", async () => {
  const gid = els.joinGameId.value.trim();
  if (!gid) return log("Enter a game id to join.");
  try {
    const res = await api(`/games/${gid}/join`, { method: "POST" });
    setCreds(res.gameId, res.playerToken);
    log(`Joined game ${res.gameId}`);
  } catch (e) { log(e.message); }
});

els.playBtn.addEventListener("click", async () => {
  const letter = els.letterIn.value.trim();
  els.letterIn.value = "";
  try {
    const game = await api(`/games/${state.gameId}/letter`, {
      method: "POST",
      body: JSON.stringify({ letter })
    });
    state.game = game;
    render(game);
  } catch (e) { log(e.message); }
});

els.letterIn.addEventListener("keydown", (ev) => {
  if (ev.key === "Enter") els.playBtn.click();
});

els.claimBtn.addEventListener("click", async () => {
  try {
    const game = await api(`/games/${state.gameId}/claim`, { method: "POST" });
    state.game = game;
    render(game);
  } catch (e) { log(e.message); }
});

els.acceptBtn.addEventListener("click", async () => {
  try {
    const game = await api(`/games/${state.gameId}/accept`, { method: "POST" });
    state.game = game;
    render(game);
  } catch (e) { log(e.message); }
});

els.disputeBtn.addEventListener("click", async () => {
  try {
    const game = await api(`/games/${state.gameId}/dispute`, { method: "POST" });
    state.game = game;
    render(game);
  } catch (e) { log(e.message); }
});

// try restore from localStorage
(function init() {
  const saved = JSON.parse(localStorage.getItem("esl_creds") || "null");
  if (saved?.gameId && saved?.playerToken) setCreds(saved.gameId, saved.playerToken);

  // persist changes
  const persist = () => localStorage.setItem("esl_creds", JSON.stringify({ gameId: state.gameId, playerToken: state.playerToken }));
  window.addEventListener("beforeunload", persist);
})();
