/* ===== KidGame World — Juego de Memoria (v1.1: niveles y temáticas) ===== */

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
  finished: false
};

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

/* ===== Sonidos (Web Audio) ===== */
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

/* ===== Baraja ===== */
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

/* ===== Tablero ===== */
function renderBoard() {
  board.className = `board cols-${LEVELS[state.level].cols}`;
  board.innerHTML = '';
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

/* ===== Lógica del juego ===== */
function onCardClick(el, card) {
  if (state.lock || state.finished) return;
  if (el.classList.contains('flipped') || el.classList.contains('matched')) return;

  ensureAudio();
  if (!state.started) startTimer();

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

/* ===== Temporizador ===== */
function startTimer() {
  state.started = true;
  state.timer = setInterval(() => {
    state.seconds += 1;
    timeEl.textContent = `${state.seconds}s`;
  }, 1000);
}

/* ===== Victoria ===== */
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
  winStars.textContent = '⭐'.repeat(stars);
  winTitle.textContent = isLast ? '🏆 ¡Completaste todos los niveles!' : `🎉 ¡Nivel ${state.level + 1} completo!`;
  winInfo.textContent =
    `Temática: ${THEMES[state.theme].label} · ${state.moves} movimientos en ${state.seconds} segundos. ¡Eres increíble!`;
  nextLevelBtn.classList.toggle('hidden', isLast);
  playAgainBtn.textContent = isLast ? '🔄 Jugar de nuevo' : '🔁 Repetir nivel';

  setTimeout(() => {
    winOverlay.classList.remove('hidden');
    launchConfetti();
  }, 600);
}

/* ===== Confeti ===== */
function launchConfetti() {
  confettiLayer.innerHTML = '';
  const colors = ['#ffd93d', '#ff6a88', '#7ce495', '#6ea8fe', '#c77dff', '#ff9a56'];
  for (let i = 0; i < 80; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti';
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = `${2 + Math.random() * 2.5}s`;
    piece.style.animationDelay = `${Math.random() * 0.8}s`;
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    confettiLayer.appendChild(piece);
  }
  setTimeout(() => { confettiLayer.innerHTML = ''; }, 6000);
}

/* ===== Reiniciar ===== */
function resetGame(opts = {}) {
  if (!opts.keepLevel) state.level = 0;
  state.flipped = [];
  state.matchedPairs = 0;
  state.moves = 0;
  state.lock = false;
  state.started = false;
  state.finished = false;
  state.seconds = 0;
  clearInterval(state.timer);
  updateStats();
  winOverlay.classList.add('hidden');
  confettiLayer.innerHTML = '';
  buildDeck();
  renderBoard();
}

function updateStats() {
  levelEl.textContent = `${state.level + 1} / ${LEVELS.length}`;
  movesEl.textContent = '0';
  pairsEl.textContent = `0 / ${LEVELS[state.level].pairs}`;
  timeEl.textContent = '0s';
}

restartBtn.addEventListener('click', () => resetGame({ keepLevel: true }));

/* ===== Selector de temática ===== */
themePicker.addEventListener('click', (e) => {
  const btn = e.target.closest('.theme-btn');
  if (!btn) return;
  themePicker.querySelectorAll('.theme-btn').forEach((b) => b.classList.remove('active'));
  btn.classList.add('active');
  state.theme = btn.dataset.theme;
  resetGame({ keepLevel: false });
});

/* ===== Botones de victoria ===== */
playAgainBtn.addEventListener('click', () => resetGame({ keepLevel: true }));
nextLevelBtn.addEventListener('click', () => {
  if (state.level < LEVELS.length - 1) {
    state.level += 1;
    resetGame({ keepLevel: true });
  }
});

/* ===== Arranque ===== */
resetGame();
