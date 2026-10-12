// --- 1. АУДИОДВИЖОК: СИНТЕЗАТОР ЗВУКА "OOF" И ДРУГИХ ЭФФЕКТОВ ---
const AudioEngine = {
  ctx: null,
  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
  },
  
  // Легендарный звук смерти Roblox "OOF"
  playOof() {
    this.init();
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    const now = ctx.currentTime;
    
    // Характерный глиссандо (падение тона)
    osc.frequency.setValueAtTime(360, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.28);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.29);
  },

  // Звук прыжка
  playJump() {
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(450, now + 0.15);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  },

  // Звук взятия монетки / Bloxy Cola
  playCoin() {
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.setValueAtTime(880, now + 0.08); // A5
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);
  },

  // Классический взмах мечом SFOTH
  playSword() {
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.12);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.12);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.12);
  }
};

// --- 2. ПАСХАЛКИ И ИНТЕРАКТИВ ---
document.addEventListener('DOMContentLoaded', () => {
  // Пасхалка: клик по логотипу
  const logo = document.querySelector('.logo-icon');
  if (logo) {
    logo.addEventListener('click', (e) => {
      e.preventDefault();
      AudioEngine.playOof();
      alert('🔴 Секретный олдскульный факт: До названия "Roblox" проект назывался "DynaBlocks" в 2004 году!');
    });
  }

  // Пасхалка: плавающий Нубик
  const noobBtn = document.querySelector('.secret-noob-trigger');
  if (noobBtn) {
    noobBtn.addEventListener('click', () => {
      AudioEngine.playOof();
      noobBtn.style.transform = 'scale(1.4) rotate(360deg)';
      setTimeout(() => noobBtn.style.transform = '', 300);
    });
  }

  // Инициализация игры (если мы на странице games.html)
  if (document.getElementById('gameCanvas')) {
    initMiniGame();
  }
});

// --- 3. ИГРАБЕЛЬНАЯ МИНИ-ИГРА: "ROBLOX OBBY RUNNER" ---
function initMiniGame() {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const scoreEl = document.getElementById('scoreDisplay');
  const startBtn = document.getElementById('startBtn');

  // Размеры внутреннего холста
  canvas.width = 640;
  canvas.height = 320;

  let isPlaying = false;
  let score = 0;
  let animationId = null;

  // Игрок (Классический Нубик)
  const player = {
    x: 70,
    y: 230,
    width: 28,
    height: 48,
    velocityY: 0,
    gravity: 0.8,
    jumpPower: -13,
    isGrounded: true
  };

  let obstacles = [];
  let items = [];
  let frame = 0;

  function resetGame() {
    player.y = 230;
    player.velocityY = 0;
    obstacles = [];
    items = [];
    score = 0;
    frame = 0;
    scoreEl.textContent = 'Очки: 0';
  }

  function jump() {
    if (player.isGrounded && isPlaying) {
      player.velocityY = player.jumpPower;
      player.isGrounded = false;
      AudioEngine.playJump();
    }
  }

  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
      e.preventDefault();
      jump();
    }
  });

  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    jump();
  });

  if (startBtn) {
    startBtn.addEventListener('click', () => {
      if (!isPlaying) {
        resetGame();
        isPlaying = true;
        startBtn.textContent = 'Перезапустить';
        gameLoop();
      } else {
        resetGame();
      }
    });
  }

  function gameLoop() {
    if (!isPlaying) return;

    frame++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Пол (в стиле серых старых Roblox Studs)
    ctx.fillStyle = '#222834';
    ctx.fillRect(0, 278, canvas.width, 42);

    // Рисуем точки "Studs" на полу
    ctx.fillStyle = '#343d4f';
    for (let i = 0; i < canvas.width; i += 24) {
      ctx.beginPath();
      ctx.arc(i + 12, 282, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Физика игрока
    player.velocityY += player.gravity;
    player.y += player.velocityY;

    if (player.y >= 230) {
      player.y = 230;
      player.velocityY = 0;
      player.isGrounded = true;
    }

    // Отрисовка Нубика:
    // Голова (Желтая)
    ctx.fillStyle = '#ffd000';
    ctx.fillRect(player.x + 4, player.y, 20, 16);
    // Торс (Синий)
    ctx.fillStyle = '#0062ff';
    ctx.fillRect(player.x, player.y + 16, 28, 18);
    // Ноги (Зеленые)
    ctx.fillStyle = '#24b338';
    ctx.fillRect(player.x + 2, player.y + 34, 11, 14);
    ctx.fillRect(player.x + 15, player.y + 34, 11, 14);

    // Спавн опасных красных лазерных блоков (Killbricks)
    if (frame % 110 === 0) {
      obstacles.push({
        x: canvas.width,
        y: 248,
        width: 26,
        height: 30
      });
    }

    // Спавн коллекционных банок Bloxy Cola
    if (frame % 170 === 0) {
      items.push({
        x: canvas.width,
        y: 190,
        width: 18,
        height: 24
      });
    }

    // Обработка препятствий
    for (let i = obstacles.length - 1; i >= 0; i--) {
      const obs = obstacles[i];
      obs.x -= 4.5;

      // Отрисовка красного киллбрика с неоновым свечением
      ctx.fillStyle = '#ff2a44';
      ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
      ctx.fillStyle = '#ffffff';
      ctx.font = '10px sans-serif';
      ctx.fillText('KILL', obs.x + 2, obs.y + 18);

      // Коллизия (Смерть -> OOF)
      if (
        player.x < obs.x + obs.width &&
        player.x + player.width > obs.x &&
        player.y < obs.y + obs.height &&
        player.y + player.height > obs.y
      ) {
        AudioEngine.playOof();
        isPlaying = false;
        startBtn.textContent = 'Начать заново';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ff334b';
        ctx.font = 'bold 28px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('OOF! ВЫ УПАЛИ С ОББИ', canvas.width / 2, canvas.height / 2);
        ctx.fillStyle = '#fff';
        ctx.font = '16px sans-serif';
        ctx.fillText('Нажмите кнопку снизу для рестарта', canvas.width / 2, canvas.height / 2 + 35);
        ctx.textAlign = 'left';
        return;
      }

      if (obs.x + obs.width < 0) obstacles.splice(i, 1);
    }

    // Обработка монеток / колы
    for (let j = items.length - 1; j >= 0; j--) {
      const it = items[j];
      it.x -= 4.5;

      ctx.fillStyle = '#ff9900';
      ctx.fillRect(it.x, it.y, it.width, it.height);
      ctx.fillStyle = '#fff';
      ctx.font = '9px sans-serif';
      ctx.fillText('COLA', it.x, it.y + 15);

      // Подбор бонуса
      if (
        player.x < it.x + it.width &&
        player.x + player.width > it.x &&
        player.y < it.y + it.height &&
        player.y + player.height > it.y
      ) {
        AudioEngine.playCoin();
        score += 150;
        scoreEl.textContent = `Очки: ${score}`;
        items.splice(j, 1);
        continue;
      }

      if (it.x + it.width < 0) items.splice(j, 1);
    }

    // Начисление очков за выживание
    if (frame % 8 === 0) {
      score += 5;
      scoreEl.textContent = `Очки: ${score}`;
    }

    animationId = requestAnimationFrame(gameLoop);
  }
}