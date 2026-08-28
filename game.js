/* ===== KidGame World v2.0 — Monedas, Rachas, Avatares, Power-ups ===== */

/* ===== CONSTANTES ===== */
const THEMES = {
  animales: { label: '🐾 Animales', emojis: ['🐶', '🐱', '🦊', '🐸', '🐼', '🐵', '🦁', '🐷', '🐮', '🐔', '🐙', '🦄'] },
  frutas:   { label: '🍎 Frutas',   emojis: ['🍎', '🍌', '🍇', '🍓', '🍉', '🍍', '🥝', '🍒', '🥭', '🍑', '🍋', '🫐'] },
  numeros:  { label: '🔢 Números',  emojis: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'], txt: true },
  letras:   { label: '🔤 Letras',   emojis: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'], txt: true }
};

const LEVELS = [
  { pairs: 6,  cols: 4, name: 'Principiante' },
  { pairs: 8,  cols: 4, name: 'Explorador' },
  { pairs: 12, cols: 6, name: 'Maestro' }
];

const TXT_COLORS = ['#ff6a88', '#ff9a56', '#e0a800', '#22a05a', '#3d7eff', '#b34dff'];

const AVATARS = [
  { id: 'ninio',    emoji: '🧒', label: 'Niño',     cost: 0 },
  { id: 'nina',     emoji: '👧', label: 'Niña',     cost: 0 },
  { id: 'astronauta', emoji: '🧑‍🚀', label: 'Astronauta', cost: 30 },
  { id: 'superheroe', emoji: '🦸', label: 'Superhéroe', cost: 50 },
  { id: 'mago',     emoji: '🧙‍♂️', label: 'Mago',     cost: 80 },
  { id: 'dragon',   emoji: '🐉', label: 'Dragón',   cost: 120 },
  { id: 'sirena',   emoji: '🧜‍♀️', label: 'Sirena',   cost: 60 },
  { id: 'robot',    emoji: '🤖', label: 'Robot',    cost: 100 },
  { id: 'princesa', emoji: '👸', label: 'Princesa', cost: 70 },
  { id: 'pirata',   emoji: '🏴‍☠️', label: 'Pirata',   cost: 90 }
];

const SHOP_ITEMS = {
  'tema-espacial':    { emoji: '🌌', label: 'Tema Espacial',     cost: 50,  type: 'theme' },
  'tema-dinosaurio':  { emoji: '🦕', label: 'Tema Dinosaurio',   cost: 80,  type: 'theme' },
  'tema-marina':      { emoji: '🐠', label: 'Tema Marina',       cost: 60,  type: 'theme' },
  'pw-magnifier':     { emoji: '🔍', label: 'Lupa (x1)',         cost: 15,  type: 'powerup', pow: 'magnifier' },
  'pw-pause':         { emoji: '⏸️', label: 'Pausa (x1)',        cost: 20,  type: 'powerup', pow: 'pause' },
  'pw-wildcard':      { emoji: '❌', label: 'Comodín (x1)',      cost: 25,  type: 'powerup', pow: 'wildcard' }
};

/* ===== ESTADO ===== */
const state = {
  theme: 'animales',
  level: 0,
  deck: [],
  flipped: [],
  matchedPairs: 0,
  moves: 0,
  lock: false,
  timer: null,
  seconds: 0,
  started: false,
  finished: false,
  // Nuevo: Monedas y Rachas
  coins: 0,
  totalCoinsEarned: 0,
  streak: 0,
  lastPlayDate: '',
  // Nuevo: Avatares
  avatar: 'ninio',
  unlockedAvatars: ['ninio', 'nina'],
  // Nuevo: Power-ups
  powerups: { magnifier: 0, pause: 0, wildcard: 0 },
  powerupActive: false,
  // Nuevo: Temas comprados
  boughtThemes: [],
  activeTheme: 'default'
};

/* ===== DOM REFS ===== */
const board = document.getElementById('board');
const levelEl = document.getElementById('level');
const movesEl = document.getElementById('moves');
const pairsEl = document.getElementById('pairs');
const timeEl = document.getElementById('time');
const restartBtn = document.getElementById('restart');
const themePicker = document.getElementById('themePicker');
const winOverlay = document.getElementById('win');
const winTitle = document.getElementById('winTitle');
const winStars = document.getElementById('winStars');
const winInfo = document.getElementById('winInfo');
const playAgainBtn = document.getElementById('playAgain');
const nextLevelBtn = document.getElementById('nextLevel');
const confettiLayer = document.getElementById('confetti-layer');

// Nuevos refs
const coinsEl = document.getElementById('coinsCount');
const streakEl = document.getElementById('streakCount');
const avatarEl = document.getElementById('avatarDisplay');
const shopBtn = document.getElementById('shopBtn');
const shopModal = document.getElementById('shopModal');
const shopClose = document.getElementById('shopClose');
const shopItems = document.getElementById('shopItems');
const avatarPicker = document.getElementById('avatarPicker');
const avatarGrid = document.getElementById('avatarGrid');
const powerupBar = document.getElementById('powerupBar');
const magnifierBtn = document.getElementById('pwMagnifier');
const pauseBtn = document.getElementById('pwPause');
const wildcardBtn = document.getElementById('pwWildcard');
const magnifierCount = document.getElementById('pwMagnifierCount');
const pauseCount = document.getElementById('pwPauseCount');
const wildcardCount = document.getElementById('pwWildcardCount');
const pwFeedback = document.getElementById('pwFeedback');

/* ===== SONIDOS (Web Audio) ===== */
let audioCtx = null;

function ensureAudio() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) audioCtx = new AC();
  }
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
}

function tone(freq, dur = 0.15, type = 'sine', vol = 0.25, delay = 0) {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const t0 = audioCtx.currentTime + delay;
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

function soundFlip() { tone(520, 0.08, 'triangle', 0.15); }
function soundMatch() {
  tone(523, 0.12, 'sine', 0.22);
  tone(659, 0.12, 'sine', 0.22, 0.1);
  tone(784, 0.18, 'sine', 0.24, 0.2);
}
function soundNoMatch() {
  tone(220, 0.14, 'sawtooth', 0.1);
  tone(180, 0.16, 'sawtooth', 0.1, 0.08);
}
function soundWin() {
  const notes = [523, 659, 784, 1047, 784, 1047, 1319];
  notes.forEach((n, i) => tone(n, 0.22, 'sine', 0.22, i * 0.12));
}
function soundLevelUp() {
  const notes = [392, 523, 659, 784, 1047];
  notes.forEach((n, i) => tone(n, 0.2, 'triangle', 0.24, i * 0.1));
}
function soundCoin() { tone(880, 0.08, 'sine', 0.18); tone(1100, 0.1, 'sine', 0.18, 0.06); }
function soundStreak() { tone(660, 0.15, 'triangle', 0.2); tone(880, 0.2, 'sine', 0.22, 0.1); tone(1100, 0.25, 'sine', 0.25, 0.2); }

/* ===== GUARDAR / CARGAR (localStorage) ===== */
const SAVE_KEY = 'kidgame_world_save_v2';

function saveGame() {
  const data = {
    coins: state.coins,
    totalCoinsEarned: state.totalCoinsEarned,
    streak: state.streak,
    lastPlayDate: state.lastPlayDate,
    avatar: state.avatar,
    unlockedAvatars: state.unlockedAvatars,
    powerups: { ...state.powerups },
    boughtThemes: [...state.boughtThemes],
    activeTheme: state.activeTheme
  };
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch (e) { /* localStorage lleno, ignorar */ }
}

function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    state.coins = data.coins || 0;
    state.totalCoinsEarned = data.totalCoinsEarned || 0;
    state.streak = data.streak || 0;
    state.lastPlayDate = data.lastPlayDate || '';
    state.avatar = data.avatar || 'ninio';
    state.unlockedAvatars = data.unlockedAvatars || ['ninio', 'nina'];
    state.powerups = data.powerups || { magnifier: 0, pause: 0, wildcard: 0 };
    state.boughtThemes = data.boughtThemes || [];
    state.activeTheme = data.activeTheme || 'default';
  } catch (e) { /* ignorar */ }
}

/* ===== RACHAS ===== */
function updateStreak() {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  if (state.lastPlayDate === today) return; // ya jugó hoy

  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  if (state.lastPlayDate === yesterday) {
    state.streak += 1;
    soundStreak();
  } else if (state.lastPlayDate !== today) {
    state.streak = 1; // reset o primer día
  }

  state.lastPlayDate = today;
  updateStreakUI();
  saveGame();
}

function getStreakEmoji() {
  if (state.streak >= 7) return '🏆';
  if (state.streak >= 5) return '🔥🔥';
  if (state.streak >= 3) return '🔥';
  if (state.streak >= 1) return '⭐';
  return '🌑';
}

function getStreakMessage() {
  if (state.streak >= 30) return '¡Legendario! 🔥🔥🔥';
  if (state.streak >= 14) return '¡Imparable! 🔥🔥';
  if (state.streak >= 7) return '¡Semana completa! 🏆';
  if (state.streak >= 5) return '¡Racha increíble! 🔥🔥';
  if (state.streak >= 3) return '¡Vas caliente! 🔥';
  if (state.streak >= 1) return '¡Primer día! ⭐';
  return '¡Juega hoy! ⭐';
}

function updateStreakUI() {
  if (streakEl) {
    streakEl.textContent = `${getStreakEmoji()} ${state.streak}${state.streak === 1 ? ' día' : ' días'}`;
  }
}

/* ===== MONEDAS ===== */
function addCoins(amount) {
  state.coins += amount;
  state.totalCoinsEarned += amount;
  soundCoin();
  updateCoinsUI();
  saveGame();
}

function spendCoins(amount) {
  if (state.coins < amount) return false;
  state.coins -= amount;
  updateCoinsUI();
  saveGame();
  return true;
}

function updateCoinsUI() {
  if (coinsEl) coinsEl.textContent = `🪙 ${state.coins}`;
}

/* ===== AVATARES ===== */
function renderAvatarPicker() {
  if (!avatarGrid) return;
  avatarGrid.innerHTML = '';
  AVATARS.forEach(av => {
    const unlocked = state.unlockedAvatars.includes(av.id);
    const el = document.createElement('button');
    el.className = `avatar-option${av.id === state.avatar ? ' active' : ''}${!unlocked ? ' locked' : ''}`;
    el.dataset.avatar = av.id;
    el.innerHTML = `
      <span class="avatar-emoji">${unlocked ? av.emoji : '🔒'}</span>
      <span class="avatar-label">${av.label}</span>
      ${!unlocked ? `<span class="avatar-cost">🪙 ${av.cost}</span>` : ''}
    `;
    el.addEventListener('click', () => selectAvatar(av.id));
    avatarGrid.appendChild(el);
  });
}

function selectAvatar(id) {
  const av = AVATARS.find(a => a.id === id);
  if (!av) return;

  if (!state.unlockedAvatars.includes(id)) {
    // Intentar comprar
    if (state.coins < av.cost) {
      showPWFeedback('🔒 ¡No tienes suficientes monedas!', 'error');
      return;
    }
    if (!spendCoins(av.cost)) return;
    state.unlockedAvatars.push(id);
    soundCoin();
    renderAvatarPicker();
  }

  state.avatar = id;
  updateAvatarUI();
  renderAvatarPicker();
  saveGame();
}

function updateAvatarUI() {
  const av = AVATARS.find(a => a.id === state.avatar);
  if (avatarEl && av) avatarEl.textContent = av.emoji;
}

/* ===== POWER-UPS ===== */
function updatePowerupUI() {
  if (magnifierCount) magnifierCount.textContent = state.powerups.magnifier;
  if (pauseCount) pauseCount.textContent = state.powerups.pause;
  if (wildcardCount) wildcardCount.textContent = state.powerups.wildcard;
}

function showPWFeedback(msg, type = 'info') {
  if (!pwFeedback) return;
  pwFeedback.textContent = msg;
  pwFeedback.className = `pw-feedback ${type}`;
  pwFeedback.classList.remove('hidden');
  clearTimeout(pwFeedback._hideTimer);
  pwFeedback._hideTimer = setTimeout(() => pwFeedback.classList.add('hidden'), 2000);
}

function useMagnifier() {
  if (state.powerups.magnifier <= 0 || state.lock || state.finished) return;
  state.powerups.magnifier -= 1;
  state.lock = true;

  // Revelar todas las cartas por 1.5 segundos
  document.querySelectorAll('.card:not(.matched)').forEach(el => el.classList.add('revealed'));
  showPWFeedback('🔍 ¡Mapa visible por 1.5s!', 'info');

  setTimeout(() => {
    document.querySelectorAll('.card:not(.matched)').forEach(el => el.classList.remove('revealed'));
    state.lock = false;
  }, 1500);

  updatePowerupUI();
  saveGame();
}

function usePause() {
  if (state.powerups.pause <= 0 || state.finished) return;
  if (!state.started) return;
  state.powerups.pause -= 1;
  state.powerupActive = true;

  // Pausar timer
  clearInterval(state.timer);
  showPWFeedback('⏸️ ¡Tiempo congelado por 10s!', 'info');

  setTimeout(() => {
    if (!state.finished) {
      startTimer();
      state.powerupActive = false;
    }
  }, 10000);

  updatePowerupUI();
  saveGame();
}

function useWildcard() {
  if (state.powerups.wildcard <= 0 || state.lock || state.finished) return;
  if (state.flipped.length === 0) {
    showPWFeedback('❌ Voltea una carta primero', 'error');
    return;
  }

  state.powerups.wildcard -= 1;
  state.lock = true;

  // Buscar la pareja de la carta volteada
  const flippedCard = state.flipped[0];
  const targetEmoji = flippedCard.card.emoji;
  const cards = document.querySelectorAll('.card:not(.flipped):not(.matched)');

  let found = false;
  cards.forEach(el => {
    const idx = parseInt(el.dataset.index);
    const cardData = state.deck[idx];
    if (cardData && cardData.emoji === targetEmoji) {
      // Auto-match!
      el.classList.add('flipped');
      setTimeout(() => {
        el.classList.add('matched');
        flippedCard.el.classList.add('matched');
        state.matchedPairs += 1;
        const totalPairs = LEVELS[state.level].pairs;
        pairsEl.textContent = `${state.matchedPairs} / ${totalPairs}`;
        state.flipped = [];
        state.lock = false;
        soundMatch();
        showPWFeedback('❌ ¡Comodín activado! Pareja encontrada ✅', 'success');
        if (state.matchedPairs === totalPairs) win();
      }, 500);
      found = true;
    }
  });

  if (!found) {
    state.lock = false;
    showPWFeedback('❌ No se encontró pareja...', 'error');
  }

  updatePowerupUI();
  saveGame();
}

/* ===== TIENDA ===== */
function renderShop() {
  if (!shopItems) return;
  shopItems.innerHTML = '';
  Object.entries(SHOP_ITEMS).forEach(([key, item]) => {
    const el = document.createElement('div');
    el.className = 'shop-item';

    let owned = false;
    if (item.type === 'theme') owned = state.boughtThemes.includes(key);
    if (item.type === 'powerup') owned = false;

    const canAfford = state.coins >= item.cost;

    el.innerHTML = `
      <div class="shop-item-icon">${item.emoji}</div>
      <div class="shop-item-info">
        <div class="shop-item-label">${item.label}</div>
        <div class="shop-item-cost">🪙 ${item.cost}</div>
      </div>
      <button class="shop-buy-btn${owned ? ' owned' : ''}${!canAfford && !owned ? ' no-funds' : ''}"
              data-shop-key="${key}" ${owned ? 'disabled' : ''}>
        ${owned ? '✅ Comprado' : 'Comprar'}
      </button>
    `;
    shopItems.appendChild(el);
  });

  // Event listeners
  shopItems.querySelectorAll('.shop-buy-btn:not(.owned)').forEach(btn => {
    btn.addEventListener('click', () => buyShopItem(btn.dataset.shopKey));
  });
}

function buyShopItem(key) {
  const item = SHOP_ITEMS[key];
  if (!item) return;
  if (state.coins < item.cost) {
    showPWFeedback('🪙 ¡No tienes suficientes monedas!', 'error');
    return;
  }

  if (!spendCoins(item.cost)) return;

  if (item.type === 'theme') {
    state.boughtThemes.push(key);
    soundCoin();
    renderShop();
    showPWFeedback(`🌌 ¡Tema "${item.label}" comprado!`, 'success');
  } else if (item.type === 'powerup') {
    state.powerups[item.pow] = (state.powerups[item.pow] || 0) + 1;
    soundCoin();
    updatePowerupUI();
    renderShop();
    showPWFeedback(`⚡ ¡${item.label} adquirido!`, 'success');
  }

  saveGame();
}

/* ===== BAR AJA ===== */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildDeck() {
  const theme = THEMES[state.theme];
  const pairs = LEVELS[state.level].pairs;
  const chosen = theme.emojis.slice(0, pairs);
  state.deck = shuffle([...chosen, ...chosen]).map((emoji, i) => ({ id: i, emoji }));
}

/* ===== TABLERO ===== */
function renderBoard() {
  board.className = `board cols-${LEVELS[state.level].cols}`;
  board.innerHTML = '';
  
  // Aplicar tema visual si hay uno activo
  board.dataset.theme = state.activeTheme;
  
  const theme = THEMES[state.theme];
  state.deck.forEach((card, i) => {
    const el = document.createElement('div');
    el.className = 'card';
    el.dataset.index = card.id;
    const txtClass = theme.txt ? ' txt' : '';
    const color = theme.txt ? ` style="color:${TXT_COLORS[i % TXT_COLORS.length]}"` : '';
    el.innerHTML = `
      <div class="card-inner">
        <div class="face back"></div>
        <div class="face front${txtClass}"${color}>${card.emoji}</div>
      </div>`;
    el.addEventListener('click', () => onCardClick(el, card));
    board.appendChild(el);
  });
}

/* ===== LÓGICA DEL JUEGO ===== */
function onCardClick(el, card) {
  if (state.lock || state.finished) return;
  if (el.classList.contains('flipped') || el.classList.contains('matched')) return;

  ensureAudio();
  if (!state.started) {
    startTimer();
    updateStreak(); // <-- racha al primer click del día
  }

  el.classList.add('flipped');
  state.flipped.push({ el, card });
  soundFlip();

  if (state.flipped.length === 2) {
    state.moves += 1;
    movesEl.textContent = state.moves;
    checkMatch();
  }
}

function checkMatch() {
  const [a, b] = state.flipped;
  state.lock = true;
  const totalPairs = LEVELS[state.level].pairs;

  if (a.card.emoji === b.card.emoji) {
    setTimeout(() => {
      a.el.classList.add('matched');
      b.el.classList.add('matched');
      state.matchedPairs += 1;
      pairsEl.textContent = `${state.matchedPairs} / ${totalPairs}`;
      state.flipped = [];
      state.lock = false;
      soundMatch();
      if (state.matchedPairs === totalPairs) win();
    }, 450);
  } else {
    setTimeout(() => {
      a.el.classList.remove('flipped');
      b.el.classList.remove('flipped');
      state.flipped = [];
      state.lock = false;
      soundNoMatch();
    }, 900);
  }
}

/* ===== TEMPORIZADOR ===== */
function startTimer() {
  if (state.powerupActive) return; // no iniciar si está en pausa
  state.started = true;
  state.timer = setInterval(() => {
    state.seconds += 1;
    timeEl.textContent = `${state.seconds}s`;
  }, 1000);
}

/* ===== VICTORIA ===== */
function starsFor(moves) {
  if (moves <= 10) return 3;
  if (moves <= 14) return 2;
  return 1;
}

function win() {
  state.finished = true;
  clearInterval(state.timer);
  const isLast = state.level === LEVELS.length - 1;
  if (isLast) soundWin(); else soundLevelUp();

  const stars = starsFor(state.moves);
  
  // Monedas por nivel completado
  const coinReward = (stars * 5) + (state.level + 1) * 3;
  addCoins(coinReward);

  winStars.textContent = '⭐'.repeat(stars);
  winTitle.textContent = isLast ? '🏆 ¡Completaste todos los niveles!' : `🎉 ¡Nivel ${state.level + 1} completo!`;
  winInfo.textContent =
    `Temática: ${THEMES[state.theme].label} · ${state.moves} movimientos en ${state.seconds} segundos. ¡+${coinReward} 🪙 monedas!`;
  nextLevelBtn.classList.toggle('hidden', isLast);
  playAgainBtn.textContent = isLast ? '🔄 Jugar de nuevo' : '🔁 Repetir nivel';

  setTimeout(() => {
    winOverlay.classList.remove('hidden');
    launchConfetti();
  }, 600);
}

/* ===== CONFETI ===== */
function launchConfetti() {
  confettiLayer.innerHTML = '';
  const colors = ['#ffd93d', '#ff6a88', '#7ce495', '#6ea8fe', '#c77dff', '#ff9a56', '#ffdf00'];
  for (let i = 0; i < 100; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti';
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = `${2 + Math.random() * 2.5}s`;
    piece.style.animationDelay = `${Math.random() * 0.8}s`;
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    piece.style.width = `${8 + Math.random() * 10}px`;
    piece.style.height = `${12 + Math.random() * 12}px`;
    confettiLayer.appendChild(piece);
  }
  setTimeout(() => { confettiLayer.innerHTML = ''; }, 6000);
}

/* ===== REINICIAR ===== */
function resetGame(opts = {}) {
  if (!opts.keepLevel) state.level = 0;
  state.flipped = [];
  state.matchedPairs = 0;
  state.moves = 0;
  state.lock = false;
  state.started = false;
  state.finished = false;
  state.seconds = 0;
  state.powerupActive = false;
  clearInterval(state.timer);
  updateStats();
  winOverlay.classList.add('hidden');
  confettiLayer.innerHTML = '';
  buildDeck();
  renderBoard();
  updatePowerupUI();
}

function updateStats() {
  levelEl.textContent = `${state.level + 1} / ${LEVELS.length}`;
  movesEl.textContent = '0';
  pairsEl.textContent = `0 / ${LEVELS[state.level].pairs}`;
  timeEl.textContent = '0s';
}

restartBtn.addEventListener('click', () => resetGame({ keepLevel: true }));

/* ===== SELECTOR DE TEMÁTICA ===== */
themePicker.addEventListener('click', (e) => {
  const btn = e.target.closest('.theme-btn');
  if (!btn) return;
  themePicker.querySelectorAll('.theme-btn').forEach((b) => b.classList.remove('active'));
  btn.classList.add('active');
  state.theme = btn.dataset.theme;
  resetGame({ keepLevel: false });
});

/* ===== BOTONES DE VICTORIA ===== */
playAgainBtn.addEventListener('click', () => resetGame({ keepLevel: true }));
nextLevelBtn.addEventListener('click', () => {
  if (state.level < LEVELS.length - 1) {
    state.level += 1;
    resetGame({ keepLevel: true });
  }
});

/* ===== EVENTOS NUEVOS ===== */

// Tienda
if (shopBtn) {
  shopBtn.addEventListener('click', () => {
    renderShop();
    shopModal.classList.remove('hidden');
  });
}
if (shopClose) {
  shopClose.addEventListener('click', () => shopModal.classList.add('hidden'));
}
// Cerrar tienda al hacer clic fuera
if (shopModal) {
  shopModal.addEventListener('click', (e) => {
    if (e.target === shopModal) shopModal.classList.add('hidden');
  });
}

// Power-ups
if (magnifierBtn) magnifierBtn.addEventListener('click', useMagnifier);
if (pauseBtn) pauseBtn.addEventListener('click', usePause);
if (wildcardBtn) wildcardBtn.addEventListener('click', useWildcard);

/* ===== ARRANQUE ===== */
loadGame();
updateCoinsUI();
updateStreakUI();
updateAvatarUI();
updatePowerupUI();
renderAvatarPicker();
resetGame();