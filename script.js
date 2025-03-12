const canvas = document.getElementById('dartboard');
const ctx = canvas.getContext('2d');
const undoBtn = document.getElementById('undoBtn');
const resetBtn = document.getElementById('resetBtn');
const statusLabel = document.getElementById('status');
const throwResultLabel = document.getElementById('throwResult');
const roundInfoLabel = document.getElementById('roundInfo');
const player1ScoreLabel = document.getElementById('player1Score');
const player2ScoreLabel = document.getElementById('player2Score');
let player1NameInput = document.getElementById('player1Name');
let player2NameInput = document.getElementById('player2Name');

const sectors = [20,1,18,4,13,6,10,15,2,17,3,19,7,16,8,11,14,9,12,5];

let round = 1;
const maxRounds = 10;
let currentPlayer = 1;
let throws = [[],[]];
let scores = [0, 0];

drawBoard();

canvas.addEventListener('click', e => {
  if(round > maxRounds) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left - 150;
  const y = e.clientY - rect.top - 150;

  const dist = Math.sqrt(x*x + y*y);
  let angle = Math.atan2(y,x) + Math.PI/2;
  if(angle < 0) angle += 2*Math.PI;

  const sectorIdx = Math.floor(angle/(Math.PI/10)) % 20;
  const sectorValue = sectors[sectorIdx];

  let score = 0;
  let result = '';
  if(dist < 6) { result = 'Bullseye 50'; score = 50;}
  else if(dist < 14) {result='Outer Bull 25'; score=25;}
  else if(dist>135 && dist<150) {result=`Double ${sectorValue}`; score=sectorValue*2;}
  else if(dist>87 && dist<93) {result=`Triple ${sectorValue}`; score=sectorValue*3;}
  else if(dist>150) {result='Мимо'; score=0;}
  else {result=`Single ${sectorValue}`; score=sectorValue;}

  throws[currentPlayer-1].push(score);
  scores[currentPlayer-1]+=score;
  updateInfo(result, score);
});

undoBtn.onclick = () => {
  const throwsCurr = throws[currentPlayer-1];
  if(throwsCurr.length === 0 && currentPlayer === 2) {currentPlayer=1;}
  else if(throwsCurr.length>0){
    const removedScore = throwsCurr.pop();
    scores[currentPlayer-1]-=removedScore;
    updateInfo('Последний бросок отменен', 0);
  }
}

resetBtn.onclick = () => {
  round = 1;
  currentPlayer = 1;
  throws = [[],[]];
  scores = [0, 0];
  updateInfo('Новая игра!',0);
}

function updateInfo(result, score){
  throwResultLabel.innerText = `${result}, Очки: ${score}`;
  player1ScoreLabel.innerText = `${player1NameInput.value||'Игрок 1'}: ${scores[0]}`;
  player2ScoreLabel.innerText = `${player2NameInput.value||'Игрок 2'}: ${scores[1]}`;

  if(throws[currentPlayer-1].length===3){
    currentPlayer = currentPlayer===1?2:1;
    if(currentPlayer===1) round++;
  }

  roundInfoLabel.innerText = `Раунд: ${round}/${maxRounds}`;
  let currName = currentPlayer===1?player1NameInput.value||'Игрок 1':player2NameInput.value||'Игрок 2';
  statusLabel.innerText= round>maxRounds ? 'Игра завершена!' : `${currName} бросает`;
}

function drawBoard(){
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, 300, 300);
  ctx.beginPath();
  ctx.fillStyle = "#fff";
  ctx.arc(150,150,150,0,Math.PI*2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(150,150,140,0,Math.PI*2);
  ctx.stroke();
}