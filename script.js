/* ==========================================================================
   Merry Christmas - Interactive Features & Audio Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initBackgroundSnow();
  initCountdown();
  initWishTree();
  initSnowGlobe();
  initGiftBoxes();
  initPostcardGenerator();
  initAudioEngine();
});

/* ==========================================================================
   1. Background Snow Particles (Canvas)
   ========================================================================== */
let snowDensityFactor = 1;
function initBackgroundSnow() {
  const canvas = document.getElementById('snow-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const baseCount = Math.min(130, Math.floor((width * height) / 10000));
  let snowflakes = [];

  function createFlake() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 3 + 1,
      density: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.7 + 0.3,
      wind: Math.random() * 0.8 - 0.4,
      swaySpeed: Math.random() * 0.02 + 0.01,
      swayOffset: Math.random() * Math.PI * 2
    };
  }

  for (let i = 0; i < baseCount; i++) {
    snowflakes.push(createFlake());
  }

  let mouseX = width / 2;
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
  });

  let time = 0;
  function render() {
    ctx.clearRect(0, 0, width, height);
    time += 0.02;

    const windInfluence = (mouseX - width / 2) / (width / 2) * 0.8;

    ctx.fillStyle = '#ffffff';

    for (let i = 0; i < snowflakes.length * snowDensityFactor; i++) {
      const flake = snowflakes[i % snowflakes.length];
      flake.y += flake.density * 1.2;
      flake.x += Math.sin(time * flake.swaySpeed + flake.swayOffset) * 0.6 + flake.wind + windInfluence;

      if (flake.y > height) {
        flake.y = -5;
        flake.x = Math.random() * width;
      }
      if (flake.x > width) flake.x = 0;
      if (flake.x < 0) flake.x = width;

      ctx.save();
      ctx.globalAlpha = flake.opacity;
      ctx.beginPath();
      ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);

  // Toggle White Christmas Snowstorm Button
  const snowBtn = document.getElementById('snow-toggle-btn');
  let isBlizzard = false;
  if (snowBtn) {
    snowBtn.addEventListener('click', () => {
      isBlizzard = !isBlizzard;
      if (isBlizzard) {
        snowDensityFactor = 2.2;
        snowBtn.classList.add('active');
        showToast('❄️ 화이트 크리스마스 폭설 모드가 켜졌습니다!');
      } else {
        snowDensityFactor = 1;
        snowBtn.classList.remove('active');
        showToast('🌨️ 포근한 일반 눈송이로 돌아왔습니다.');
      }
    });
  }
}

/* ==========================================================================
   2. Real-time Christmas Countdown
   ========================================================================== */
function initCountdown() {
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');
  const statusEl = document.getElementById('countdown-status');

  function update() {
    const now = new Date();
    let currentYear = now.getFullYear();
    let christmasDate = new Date(currentYear, 11, 25, 0, 0, 0);

    // If today is past Dec 25 this year, target next year's Christmas
    if (now.getTime() > christmasDate.getTime() + 86400000) {
      christmasDate = new Date(currentYear + 1, 11, 25, 0, 0, 0);
    }

    const diff = christmasDate.getTime() - now.getTime();

    if (diff <= 0 && diff > -86400000) {
      if (statusEl) statusEl.textContent = '🎉 오늘은 행복한 메리 크리스마스입니다! 즐거운 하루 보내세요! 🎅';
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);

    if (daysEl) daysEl.textContent = String(d).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(h).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(m).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(s).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   3. Interactive Christmas Wish Tree
   ========================================================================== */
const DEFAULT_WISHES = [
  { id: '1', author: '루돌프', text: '산타 할아버지 썰매 끌고 모두에게 기쁨을 전할게요! 🦌', ornament: '🔔', x: 48, y: 18 },
  { id: '2', author: '꼬마 요정', text: '모든 아이들의 양말 속에 따스한 선물이 가득하길 🎁', ornament: '🌟', x: 38, y: 35 },
  { id: '3', author: '스노우맨', text: '녹지 않는 따뜻한 사랑과 우정이 함께하길 바라요 ⛄', ornament: '🔴', x: 60, y: 38 },
  { id: '4', author: '진저맨', text: '올해 힘들었던 일 모두 눈 녹듯 사라지고 꽃길만 걸어요 🍪', ornament: '🍪', x: 32, y: 55 },
  { id: '5', author: '별빛지기', text: '원하는 대학, 꿈꾸는 시험, 취업 모두 대박 나길 응원합니다!', ornament: '🌟', x: 52, y: 60 },
  { id: '6', author: '성탄 천사', text: '가족 모두 건강하고 웃음꽃 피는 한 해가 되기를 기도해요 💕', ornament: '🎀', x: 68, y: 58 },
  { id: '7', author: '익명의 산타', text: '소소하지만 확실한 행복들이 매일 가득한 2027년 되세요!', ornament: '🍬', x: 25, y: 76 },
  { id: '8', author: '겨울바람', text: '추운 겨울이지만 우리 마음만은 늘 봄날처럼 따스하기를!', ornament: '🔴', x: 46, y: 78 },
  { id: '9', author: '행복 배달부', text: '사랑하는 연인과 잊지 못할 특별한 크리스마스 데이트 되세요!', ornament: '🔔', x: 74, y: 75 }
];

function initWishTree() {
  const ornamentsLayer = document.getElementById('ornaments-layer');
  const countEl = document.getElementById('total-wishes-count');
  const wishForm = document.getElementById('wish-form');
  const wishAuthor = document.getElementById('wish-author');
  const wishText = document.getElementById('wish-text');
  const charNum = document.getElementById('char-num');
  const resetBtn = document.getElementById('reset-wishes-btn');
  const selector = document.getElementById('ornament-selector');

  // Modal elements
  const modal = document.getElementById('wish-modal');
  const modalClose = document.getElementById('modal-close-btn');
  const modalOk = document.getElementById('modal-ok-btn');
  const modalIcon = document.getElementById('modal-ornament-icon');
  const modalAuthor = document.getElementById('modal-author-title');
  const modalContent = document.getElementById('modal-wish-content');
  const modalDate = document.getElementById('modal-wish-date');

  let wishes = [];
  try {
    const saved = localStorage.getItem('christmas_wishes_2026');
    wishes = saved ? JSON.parse(saved) : [...DEFAULT_WISHES];
  } catch (e) {
    wishes = [...DEFAULT_WISHES];
  }

  function saveWishes() {
    try {
      localStorage.setItem('christmas_wishes_2026', JSON.stringify(wishes));
    } catch (e) {}
  }

  function renderOrnaments() {
    if (!ornamentsLayer) return;
    ornamentsLayer.innerHTML = '';

    wishes.forEach((wish, idx) => {
      const el = document.createElement('div');
      el.className = 'tree-ornament';
      el.textContent = wish.ornament || '🌟';
      el.style.left = `${wish.x}%`;
      el.style.top = `${wish.y}%`;
      el.style.animationDelay = `${(idx * 0.25) % 2}s`;
      el.title = `${wish.author}님의 소원: ${wish.text}`;

      el.addEventListener('click', () => {
        playChimeSound(660);
        openWishModal(wish);
      });

      ornamentsLayer.appendChild(el);
    });

    if (countEl) countEl.textContent = wishes.length;
  }

  function openWishModal(wish) {
    if (!modal) return;
    modalIcon.textContent = wish.ornament || '🌟';
    modalAuthor.textContent = `${wish.author}님의 크리스마스 소원`;
    modalContent.textContent = `"${wish.text}"`;
    modalDate.textContent = wish.date || '2026.12.25 Special Wish';
    modal.classList.add('show');
  }

  function closeModal() {
    if (modal) modal.classList.remove('show');
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalOk) {
    modalOk.addEventListener('click', () => {
      playChimeSound(880);
      showToast('💖 따뜻한 응원의 마음이 전달되었습니다!');
      closeModal();
    });
  }
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // Character count
  if (wishText && charNum) {
    wishText.addEventListener('input', () => {
      charNum.textContent = wishText.value.length;
    });
  }

  // Ornament selector styling
  if (selector) {
    const labels = selector.querySelectorAll('.ornament-opt');
    labels.forEach(lbl => {
      lbl.addEventListener('click', () => {
        labels.forEach(l => l.classList.remove('active'));
        lbl.classList.add('active');
      });
    });
  }

  // Add new wish form submit
  if (wishForm) {
    wishForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const author = wishAuthor.value.trim() || '익명의 천사';
      const text = wishText.value.trim();
      const selectedRadio = wishForm.querySelector('input[name="ornament"]:checked');
      const ornament = selectedRadio ? selectedRadio.value : '🌟';

      if (!text) return;

      // Position organically on the tree pyramid
      // Tier height y from 15% to 85%
      // Width bounds narrow at top, wider at bottom
      const y = Math.random() * 65 + 18; // 18% to 83%
      const halfWidthAtY = ((y - 10) / 75) * 35; // triangle taper
      const minX = 50 - halfWidthAtY;
      const maxX = 50 + halfWidthAtY;
      const x = Math.random() * (maxX - minX) + minX;

      const newWish = {
        id: Date.now().toString(),
        author,
        text,
        ornament,
        x: Math.round(x),
        y: Math.round(y),
        date: new Date().toLocaleDateString('ko-KR')
      };

      wishes.push(newWish);
      saveWishes();
      renderOrnaments();

      wishForm.reset();
      if (charNum) charNum.textContent = '0';

      playChimeSound(880);
      showToast(`🎄 ${author}님의 소원이 트리에 예쁘게 걸렸습니다!`);
    });
  }

  // Reset wishes button
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('소원의 트리를 기본 상태로 초기화할까요?')) {
        wishes = [...DEFAULT_WISHES];
        saveWishes();
        renderOrnaments();
        showToast('트리가 반짝이는 처음 모습으로 초기화되었습니다.');
      }
    });
  }

  // Click on tree star
  const star = document.querySelector('.tree-top-star');
  if (star) {
    star.addEventListener('click', () => {
      playArpeggio();
      showToast('⭐ 별이 밝게 빛나며 성탄의 축복을 내립니다!');
    });
  }

  renderOrnaments();
}

/* ==========================================================================
   4. Interactive Snow Globe (Canvas inside globe)
   ========================================================================== */
function initSnowGlobe() {
  const globeCanvas = document.getElementById('globe-snow-canvas');
  const globeWrap = document.getElementById('snowglobe-wrap');
  const shakeBtn = document.getElementById('shake-globe-btn');
  if (!globeCanvas || !globeWrap) return;

  const ctx = globeCanvas.getContext('2d');
  const size = 300;
  globeCanvas.width = size;
  globeCanvas.height = size;

  const flakeCount = 75;
  let flakes = [];
  let shakeForce = 1;

  for (let i = 0; i < flakeCount; i++) {
    flakes.push({
      x: Math.random() * size,
      y: Math.random() * size,
      r: Math.random() * 2.2 + 0.8,
      speedY: Math.random() * 1.2 + 0.6,
      speedX: Math.random() * 0.8 - 0.4,
      sway: Math.random() * 2
    });
  }

  let angle = 0;
  function drawGlobeSnow() {
    ctx.clearRect(0, 0, size, size);
    angle += 0.04;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';

    flakes.forEach(flake => {
      flake.y += flake.speedY * shakeForce;
      flake.x += Math.sin(angle + flake.sway) * 1.5 * shakeForce + flake.speedX;

      if (flake.y > size - 30) {
        flake.y = 10;
        flake.x = Math.random() * size;
      }
      if (flake.x > size - 10) flake.x = 10;
      if (flake.x < 10) flake.x = size - 10;

      ctx.beginPath();
      ctx.arc(flake.x, flake.y, flake.r, 0, Math.PI * 2);
      ctx.fill();
    });

    if (shakeForce > 1) {
      shakeForce -= 0.025;
      if (shakeForce < 1) shakeForce = 1;
    }

    requestAnimationFrame(drawGlobeSnow);
  }

  requestAnimationFrame(drawGlobeSnow);

  function triggerShake() {
    globeWrap.classList.add('shaking');
    shakeForce = 4.5;
    playArpeggio();

    setTimeout(() => {
      globeWrap.classList.remove('shaking');
    }, 1200);

    showToast('❄️ 스노우볼 속에 황홀한 눈보라가 휘몰아칩니다!');
  }

  globeWrap.addEventListener('click', triggerShake);
  if (shakeBtn) shakeBtn.addEventListener('click', triggerShake);
}

/* ==========================================================================
   5. Surprise Gift Boxes (Advent Lucky Boxes)
   ========================================================================== */
function initGiftBoxes() {
  const cards = document.querySelectorAll('.gift-card');

  cards.forEach(card => {
    const btn = card.querySelector('.open-gift-btn');
    const visual = card.querySelector('.gift-box-visual');

    function toggleGift() {
      if (card.classList.contains('opened')) {
        card.classList.remove('opened');
        btn.textContent = '상자 열어보기 ✨';
      } else {
        card.classList.add('opened');
        btn.textContent = '상자 다시 닫기 🎁';
        playChimeSound(784); // G5 note
        showToast('🎉 마법의 선물 상자가 열렸습니다!');
      }
    }

    if (btn) btn.addEventListener('click', toggleGift);
    if (visual) visual.addEventListener('click', toggleGift);
  });
}

/* ==========================================================================
   6. Custom Holiday Postcard Generator & Canvas Export
   ========================================================================== */
function initPostcardGenerator() {
  const toInput = document.getElementById('card-to');
  const msgInput = document.getElementById('card-message');
  const fromInput = document.getElementById('card-from');

  const preview = document.getElementById('postcard-preview');
  const previewTo = document.getElementById('preview-to');
  const previewMsg = document.getElementById('preview-msg');
  const previewFrom = document.getElementById('preview-from');

  const themeBtns = document.querySelectorAll('.theme-btn');
  const copyBtn = document.getElementById('copy-card-text-btn');
  const downloadBtn = document.getElementById('download-card-btn');

  // Live input sync
  if (toInput && previewTo) {
    toInput.addEventListener('input', () => {
      previewTo.textContent = `To. ${toInput.value || '사랑하는 그대에게'}`;
    });
  }

  if (msgInput && previewMsg) {
    msgInput.addEventListener('input', () => {
      previewMsg.textContent = msgInput.value || '행복한 크리스마스 되세요!';
    });
  }

  if (fromInput && previewFrom) {
    fromInput.addEventListener('input', () => {
      previewFrom.textContent = `From. ${fromInput.value || '마음을 담아'}`;
    });
  }

  // Theme selector
  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      themeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const theme = btn.dataset.theme;
      preview.className = `greeting-postcard theme-${theme}`;
      playChimeSound(523.25);
    });
  });

  // Copy card text
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const textToCopy = `🎄 [Christmas Greeting Card] 🎄\n\n${toInput.value}\n\n"${msgInput.value}"\n\n${fromInput.value}\n\n✨ Wishing you a Merry Christmas & Happy New Year! ✨`;
      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast('📋 크리스마스 메시지가 클립보드에 복사되었습니다!');
      }).catch(() => {
        showToast('메시지 복사에 실패했습니다. 수동으로 복사해주세요.');
      });
    });
  }

  // High-res Image Download via HTML5 Canvas
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      generateAndDownloadPostcard();
    });
  }

  function generateAndDownloadPostcard() {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');

    // Theme styles
    let activeTheme = 'classic-red';
    const activeBtn = document.querySelector('.theme-btn.active');
    if (activeBtn) activeTheme = activeBtn.dataset.theme;

    let gradColors = ['#780e14', '#3e0609'];
    let borderColor = '#ffd700';

    if (activeTheme === 'pine-green') {
      gradColors = ['#124024', '#071c10'];
      borderColor = '#fef08a';
    } else if (activeTheme === 'midnight-blue') {
      gradColors = ['#142247', '#060c1d'];
      borderColor = '#bae6fd';
    } else if (activeTheme === 'warm-champagne') {
      gradColors = ['#5c401c', '#291807'];
      borderColor = '#ffd700';
    }

    // Draw background
    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 800);
    bgGrad.addColorStop(0, gradColors[0]);
    bgGrad.addColorStop(1, gradColors[1]);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 800);

    // Outer double border
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 14;
    ctx.strokeRect(30, 30, 1140, 740);

    ctx.lineWidth = 4;
    ctx.strokeRect(50, 50, 1100, 700);

    // Stamp box top-right
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 6]);
    ctx.strokeRect(980, 80, 140, 170);
    ctx.setLineDash([]);

    // Stamp text & icon
    ctx.font = '55px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🦌', 1050, 160);
    ctx.font = 'bold 20px serif';
    ctx.fillStyle = borderColor;
    ctx.fillText('2026.12.25', 1050, 215);

    // Title
    ctx.textAlign = 'left';
    ctx.fillStyle = '#fef08a';
    ctx.font = '22px serif';
    ctx.fillText('SPECIAL HOLIDAY GREETINGS', 100, 120);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 70px serif';
    ctx.fillText('Merry Christmas', 100, 200);

    // Decorative line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(100, 240);
    ctx.lineTo(920, 240);
    ctx.stroke();

    // To recipient
    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText(`To. ${toInput.value || '사랑하는 사람에게'}`, 100, 320);

    // Message body (word wrapped)
    ctx.fillStyle = '#ffffff';
    ctx.font = '30px sans-serif';
    const rawMsg = msgInput.value || '따뜻하고 행복한 크리스마스 보내세요!';
    wrapText(ctx, `"${rawMsg}"`, 100, 400, 1000, 48);

    // From sender
    ctx.textAlign = 'right';
    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 34px sans-serif';
    ctx.fillText(`From. ${fromInput.value || '산타의 선물'}`, 1100, 680);

    // Wax seal mark bottom-left
    ctx.beginPath();
    ctx.arc(140, 680, 50, 0, Math.PI * 2);
    ctx.fillStyle = '#c0262d';
    ctx.fill();
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffd700';
    ctx.font = '40px serif';
    ctx.fillText('★', 140, 694);

    // Initiate download
    const link = document.createElement('a');
    link.download = `Merry-Christmas-Card-2026.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    showToast('💾 정성 가득한 크리스마스 엽서가 저장되었습니다!');
  }

  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y);
  }
}

/* ==========================================================================
   7. Web Audio Procedural Carol & Fireplace Music Engine
   ========================================================================== */
let audioCtx = null;
let isPlayingMelody = false;
let currentSongIndex = 0;
let melodyTimeoutId = null;

// Fireplace ambient noise
let fireplaceNoiseNode = null;
let isFireplaceSoundActive = false;

// Note Frequencies
const NOTES = {
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00
};

// Song Scores: [note, duration in seconds]
const SONGS = {
  jingle: [
    ['E4', 0.25], ['E4', 0.25], ['E4', 0.5],
    ['E4', 0.25], ['E4', 0.25], ['E4', 0.5],
    ['E4', 0.25], ['G4', 0.25], ['C4', 0.35], ['D4', 0.15], ['E4', 0.8],
    ['F4', 0.25], ['F4', 0.25], ['F4', 0.35], ['F4', 0.15],
    ['F4', 0.25], ['E4', 0.25], ['E4', 0.25], ['E4', 0.25],
    ['E4', 0.25], ['D4', 0.25], ['D4', 0.25], ['E4', 0.25], ['D4', 0.5], ['G4', 0.5],
    ['E4', 0.25], ['E4', 0.25], ['E4', 0.5],
    ['E4', 0.25], ['E4', 0.25], ['E4', 0.5],
    ['E4', 0.25], ['G4', 0.25], ['C4', 0.35], ['D4', 0.15], ['E4', 0.8],
    ['F4', 0.25], ['F4', 0.25], ['F4', 0.35], ['F4', 0.15],
    ['F4', 0.25], ['E4', 0.25], ['E4', 0.25], ['E4', 0.25],
    ['G4', 0.25], ['G4', 0.25], ['F4', 0.25], ['D4', 0.25], ['C4', 0.8]
  ],
  'we-wish': [
    ['D4', 0.3],
    ['G4', 0.3], ['G4', 0.15], ['A4', 0.15], ['G4', 0.15], ['F4', 0.15],
    ['E4', 0.3], ['E4', 0.3], ['E4', 0.3],
    ['A4', 0.3], ['A4', 0.15], ['B4', 0.15], ['A4', 0.15], ['G4', 0.15],
    ['F4', 0.3], ['D4', 0.3], ['D4', 0.3],
    ['B4', 0.3], ['B4', 0.15], ['C5', 0.15], ['B4', 0.15], ['A4', 0.15],
    ['G4', 0.3], ['E4', 0.3], ['D4', 0.15], ['D4', 0.15],
    ['E4', 0.3], ['A4', 0.3], ['F4', 0.3],
    ['G4', 0.6]
  ],
  'silent-night': [
    ['G4', 0.6], ['A4', 0.2], ['G4', 0.4], ['E4', 0.8],
    ['G4', 0.6], ['A4', 0.2], ['G4', 0.4], ['E4', 0.8],
    ['D5', 0.6], ['D5', 0.4], ['B4', 0.8],
    ['C5', 0.6], ['C5', 0.4], ['G4', 0.8],
    ['A4', 0.6], ['A4', 0.4], ['C5', 0.4], ['B4', 0.2], ['A4', 0.4],
    ['G4', 0.6], ['A4', 0.2], ['G4', 0.4], ['E4', 0.8]
  ]
};

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Warm music box / glockenspiel bell chime tone
function playBellTone(freq, duration = 0.5, volume = 0.2) {
  const ctx = getAudioContext();
  const osc = ctx.createOscillator();
  const oscHarmonic = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, ctx.currentTime);

  oscHarmonic.type = 'triangle';
  oscHarmonic.frequency.setValueAtTime(freq * 2.02, ctx.currentTime);

  const harmonicGain = ctx.createGain();
  harmonicGain.gain.setValueAtTime(0.2, ctx.currentTime);

  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

  osc.connect(gain);
  oscHarmonic.connect(harmonicGain);
  harmonicGain.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime);
  oscHarmonic.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration);
  oscHarmonic.stop(ctx.currentTime + duration);
}

function playChimeSound(freq = 660) {
  playBellTone(freq, 0.4, 0.25);
}

function playArpeggio() {
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((freq, idx) => {
    setTimeout(() => {
      playBellTone(freq, 0.6, 0.2);
    }, idx * 110);
  });
}

function initAudioEngine() {
  const musicNavBtn = document.getElementById('music-btn');
  const mainPlayBtn = document.getElementById('main-play-btn');
  const playIcon = document.getElementById('play-btn-icon');
  const playText = document.getElementById('play-btn-text');
  const disc = document.getElementById('music-disc');
  const statusBadge = document.getElementById('track-status-badge');
  const trackTitle = document.getElementById('track-title-text');
  const songBtns = document.querySelectorAll('.song-btn');
  const fireToggle = document.getElementById('fireplace-sound-toggle');

  let activeSongKey = 'jingle';

  function updateSongMetadata() {
    const titles = {
      jingle: 'Jingle Bells (오르골 벨소리)',
      'we-wish': 'We Wish You A Merry Christmas (오르골)',
      'silent-night': 'Silent Night 고요한 밤 거룩한 밤'
    };
    if (trackTitle) trackTitle.textContent = titles[activeSongKey] || '크리스마스 캐럴';
  }

  function startMelody() {
    isPlayingMelody = true;
    if (mainPlayBtn) mainPlayBtn.classList.add('playing');
    if (musicNavBtn) musicNavBtn.classList.add('active');
    if (disc) disc.classList.add('playing');
    if (playIcon) playIcon.textContent = '⏸';
    if (playText) playText.textContent = '캐럴 일시정지';
    if (statusBadge) statusBadge.textContent = '오르골 캐럴 연주 중 🎶';

    const score = SONGS[activeSongKey];
    let noteIdx = 0;

    function playNext() {
      if (!isPlayingMelody) return;
      if (noteIdx >= score.length) {
        noteIdx = 0; // Loop song
      }

      const [noteName, dur] = score[noteIdx];
      const freq = NOTES[noteName] || 440;
      playBellTone(freq, Math.max(dur * 1.5, 0.4), 0.22);

      noteIdx++;
      melodyTimeoutId = setTimeout(playNext, dur * 1000);
    }

    playNext();
  }

  function stopMelody() {
    isPlayingMelody = false;
    clearTimeout(melodyTimeoutId);
    if (mainPlayBtn) mainPlayBtn.classList.remove('playing');
    if (musicNavBtn) musicNavBtn.classList.remove('active');
    if (disc) disc.classList.remove('playing');
    if (playIcon) playIcon.textContent = '▶';
    if (playText) playText.textContent = '캐럴 재생하기';
    if (statusBadge) statusBadge.textContent = '일시 정지됨';
  }

  function togglePlay() {
    getAudioContext();
    if (isPlayingMelody) {
      stopMelody();
      showToast('⏸️ 캐럴 연주가 멈추었습니다.');
    } else {
      startMelody();
      showToast('🎵 맑고 은은한 크리스마스 오르골이 연주됩니다!');
    }
  }

  if (mainPlayBtn) mainPlayBtn.addEventListener('click', togglePlay);
  if (musicNavBtn) musicNavBtn.addEventListener('click', togglePlay);

  // Switch songs
  songBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      songBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeSongKey = btn.dataset.song;
      updateSongMetadata();

      if (isPlayingMelody) {
        stopMelody();
        startMelody();
      }
    });
  });

  // Ambient Fireplace Crackle Generator
  function startFireplaceCrackle() {
    const ctx = getAudioContext();
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      // Gentle crackle / brown noise algorithm
      const white = Math.random() * 2 - 1;
      const crackle = Math.random() > 0.994 ? (Math.random() * 2 - 1) * 3 : 0;
      data[i] = (white * 0.04 + crackle) * 0.15;
    }

    fireplaceNoiseNode = ctx.createBufferSource();
    fireplaceNoiseNode.buffer = buffer;
    fireplaceNoiseNode.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;

    const gain = ctx.createGain();
    gain.gain.value = 0.25;

    fireplaceNoiseNode.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    fireplaceNoiseNode.start(0);
    isFireplaceSoundActive = true;
  }

  function stopFireplaceCrackle() {
    if (fireplaceNoiseNode) {
      try {
        fireplaceNoiseNode.stop();
        fireplaceNoiseNode.disconnect();
      } catch (e) {}
      fireplaceNoiseNode = null;
    }
    isFireplaceSoundActive = false;
  }

  if (fireToggle) {
    fireToggle.addEventListener('change', () => {
      if (fireToggle.checked) {
        startFireplaceCrackle();
        showToast('🔥 타닥타닥 따뜻한 장작 불꽃 소리가 켜졌습니다.');
      } else {
        stopFireplaceCrackle();
        showToast('장작 소리가 꺼졌습니다.');
      }
    });
  }
}

/* ==========================================================================
   8. Global Toast Notification Helper
   ========================================================================== */
let toastTimeout = null;
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

