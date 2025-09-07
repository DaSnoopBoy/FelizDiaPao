// ====== Tilt 3D ===================================================
const card = document.getElementById('card');
let rect = null;

function updateTilt(e){
  if(!rect) rect = card.getBoundingClientRect();
  const cx = rect.left + rect.width/2;
  const cy = rect.top + rect.height/2;
  const dx = (e.clientX - cx) / (rect.width/2);
  const dy = (e.clientY - cy) / (rect.height/2);
  const max = 10;
  card.style.setProperty('--ry', `${dx * max}deg`);
  card.style.setProperty('--rx', `${-dy * max}deg`);
}
function resetTilt(){
  card.style.setProperty('--ry', `0deg`);
  card.style.setProperty('--rx', `0deg`);
  rect = null;
}
card.addEventListener('pointermove', updateTilt);
card.addEventListener('pointerleave', resetTilt);

// ====== Confeti ===================================================
const fxLayer = document.getElementById('fx-layer');
const btnSurprise = document.getElementById('btnSurprise');

function rand(min, max){ return Math.random() * (max - min) + min; }

function launchConfetti(count = 150){
  for(let i=0;i<count;i++){
    const piece = document.createElement('div');
    piece.className = 'confetti';
    const size = rand(6,14);
    piece.style.width = `${size}px`;
    piece.style.height = `${size*1.4}px`;
    piece.style.left = `${rand(0, 100)}vw`;
    piece.style.top = `${rand(-10, -2)}vh`;
    piece.style.background = `hsl(${rand(0,360)}, 90%, ${rand(45,65)}%)`;
    piece.style.setProperty('--tx', `${rand(-60,60)}vw`);
    piece.style.setProperty('--rot', `${rand(180, 1080)}deg`);
    piece.style.animationDuration = `${rand(1.8, 3.6)}s`;
    fxLayer.appendChild(piece);
    piece.addEventListener('animationend', ()=> piece.remove());
  }
}

btnSurprise.addEventListener('click', ()=>{
  launchConfetti(160);
  card.animate(
    [{ transform: getComputedStyle(card).transform },
     { transform: 'perspective(1000px) scale(1.05) rotateX(3deg)' },
     { transform: 'perspective(1000px) scale(1) rotateX(0)' }],
    { duration: 700, easing: 'ease-out' }
  );
}, { passive:true });

// ====== Música ====================================================
const btnMusic = document.getElementById('btnMusic');
const audioPlayer = document.getElementById('audioPlayer');
const startTime = 55; // segundo donde empieza
const endTime = 74;   // segundo donde termina

if(btnMusic){
  btnMusic.addEventListener('click', ()=>{
    if(audioPlayer.paused){
      audioPlayer.currentTime = startTime;
      audioPlayer.play();
      btnMusic.textContent = "⏸️ ";
    } else {
      audioPlayer.pause();
      btnMusic.textContent = "🎵 ";
    }
  });

  audioPlayer.addEventListener("timeupdate", ()=>{
    if(audioPlayer.currentTime >= endTime){
      audioPlayer.pause();
      audioPlayer.currentTime = startTime;
      btnMusic.textContent = "🎵 ";
    }
  });
}

// ====== Cambio de tema ==================================
const btnTheme = document.getElementById('btnTheme');
const themeIcon = document.getElementById('themeIcon');

btnTheme.addEventListener('click', ()=>{
  const root = document.documentElement;
  const isLight = root.classList.toggle('light');
  btnTheme.setAttribute('aria-pressed', String(isLight));
  themeIcon.textContent = isLight ? "☀️" : "🌙";
});

// ====== Lock Screen ====================================
const lockScreen = document.getElementById('lock-screen');
const wrapper = document.querySelector('.wrapper');
const unlockBtn = document.getElementById('unlockBtn');
const inputs = document.querySelectorAll('.pin-inputs input');
const errorMsg = document.getElementById('errorMsg');
const correctPin = "0709";

inputs.forEach((input, i)=>{
  input.addEventListener('input', ()=>{
    if(input.value && i < inputs.length-1) inputs[i+1].focus();
  });
});

unlockBtn.addEventListener('click', ()=>{
  const entered = Array.from(inputs).map(i=>i.value).join('');
  if(entered === correctPin){
    lockScreen.style.display = "none";
    wrapper.style.display = "grid";
    createTulipField();
  } else {
    errorMsg.textContent = "Contraseña incorrecta";
    inputs.forEach(i=> i.value="");
    inputs[0].focus();
  }
});

// ====== Tulipanes distribuidos ===========================
function createTulipField(){
  const tulipField = document.querySelector('.tulip-field');
  const totalTulips = 150;
  for(let i=0;i<totalTulips;i++){
    const tulip = document.createElement('div');
    tulip.className = 'tulip-static';
    tulip.style.left = `${rand(0, 100)}vw`;
    tulip.style.top = `${rand(0, 100)}vh`;
    tulip.style.setProperty('--color', `hsl(${rand(320,360)},70%,80%)`);
    tulip.style.animationDelay = `${i * 0.2}s`;
    tulip.innerHTML = `
      <div class="stem"></div>
      <div class="leaf left"></div>
      <div class="leaf right"></div>
      <div class="flower">
        <div class="petal back-left"></div>
        <div class="petal back-right"></div>
        <div class="petal left"></div>
        <div class="petal right"></div>
        <div class="petal center"></div>
      </div>
    `;
    tulipField.appendChild(tulip);
  }
}
