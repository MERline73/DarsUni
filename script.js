const canvas = document.getElementById("dartboardCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("scoreDisplay");

const player1Name = document.getElementById("player1Name");
const player2Name = document.getElementById("player2Name");

let throwHistory = [];
const sectors = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 
                 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];

const radius = canvas.width / 2;
const centerX = radius;
const centerY = radius;
const angleStep = Math.PI * 2 / 20;
const rotation = -9 * Math.PI / 180;
const startAngle = -Math.PI / 2 + rotation;

function drawBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.fillStyle = "#000";
  ctx.fill();

  for (let i = 0; i < 20; i++) {
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius * 0.85, startAngle + i * angleStep, startAngle + (i + 1) * angleStep);
    ctx.closePath();
    ctx.fillStyle = i % 2 === 0 ? "#000" : "#fff";
    ctx.fill();
  }
  drawRing(radius * 0.50, radius * 0.55, 'red', 'green');
  drawRing(radius * 0.80, radius * 0.85, 'red', 'green');

  ctx.fillStyle = "white";
  ctx.font = `${radius * 0.07}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let i = 0; i < 20; i++) {
    const numAngle = startAngle + i * angleStep + angleStep / 2;
    const x = centerX + Math.cos(numAngle) * radius * 0.93;
    const y = centerY + Math.sin(numAngle) * radius * 0.93;
    ctx.fillText(sectors[i], x, y);
  }
}

function drawRing(innerRadius, outerRadius, color1, color2) {
  for (let i = 0; i < 20; i++) {
    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius, startAngle + i * angleStep, startAngle + (i + 1) * angleStep);
    ctx.arc(centerX, centerY, innerRadius, startAngle + (i + 1) * angleStep, startAngle + i * angleStep, true);
    ctx.closePath();
    ctx.fillStyle = i % 2 === 0 ? color1 : color2;
    ctx.fill();
  }
}

function handleCanvasClick(e) {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left - centerX;
  const y = e.clientY - rect.top - centerY;
  const dist = Math.hypot(x, y);

  const clickAngle = Math.atan2(y, x);
  const normalizedAngle = (clickAngle + Math.PI / 2 - rotation + 2 * Math.PI) % (2 * Math.PI);
  const sectorIdx = Math.floor(normalizedAngle / angleStep);
  const sectorValue = sectors[sectorIdx];
  const currentScore = dist <= radius * 0.025 ? 50 :
                       dist <= radius * 0.06 ? 25 :
                       dist >= radius * 0.80 && dist <= radius * 0.85 ? sectorValue*2 :
                       dist >= radius * 0.50 && dist <= radius * 0.55 ? sectorValue*3 :
                       dist > radius * 0.85 ? 0 : sectorValue;

  throwHistory.unshift(currentScore);
  if(throwHistory.length > 10) throwHistory.pop();
  updateScoreDisplay();
}

function updateScoreDisplay() {
  const p1 = player1Name.value || 'Игрок №1';
  const p2 = player2Name.value || 'Игрок №2';
  let historyHtml = `<b>${p1} vs ${p2}</b><br><br>Броски:<br>`;
  historyHtml += throwHistory.map((score, idx) => `${idx + 1}. ${score} очков`).join("<br>");
  scoreDisplay.innerHTML = historyHtml;
}

drawBoard();
canvas.addEventListener("click", handleCanvasClick);