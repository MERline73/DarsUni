const canvas=document.getElementById('dartboardCanvas'),ctx=canvas.getContext('2d');
const player1Name=document.getElementById('player1Name'),player2Name=document.getElementById('player2Name');
const scoreDisplay=document.getElementById('scoreDisplay'),undoBtn=document.getElementById('undoBtn');

const sectors=[20,1,18,4,13,6,10,15,2,17,3,19,7,16,8,11,14,9,12,5];
const angleStep=Math.PI*2/sectors.length,rotation=-Math.PI/2-angleStep/2;
const radius=canvas.width/2*0.9,centerX=canvas.width/2,centerY=canvas.height/2;
const bullRadius=radius*0.0282,outerBullRadius=radius*0.0705;

let player1Score=0,player2Score=0,currentPlayer=1,p1throws=0,p2throws=0,rounds=1,gameOver=false,throwHistory=[],gameStates=[];

canvas.addEventListener("click",function(e){
  if(gameOver)return;
  saveGameState();

  const rect=canvas.getBoundingClientRect(),x=e.clientX-rect.left-centerX,y=e.clientY-rect.top-centerY,dist=Math.hypot(x,y);

  let angle=(Math.atan2(y,x)-rotation+2*Math.PI)%(2*Math.PI),sectorValue=sectors[Math.floor(angle/angleStep)],score=0;

  if(dist<=bullRadius)score=50;
  else if(dist<=outerBullRadius)score=25;
  else if(dist>=radius*0.5&&dist<=radius*0.55)score=sectorValue*3;
  else if(dist>=radius*0.8&&dist<=radius*0.85)score=sectorValue*2;
  else if(dist>radius*0.85)score=0;
  else score=sectorValue;

  if(currentPlayer===1){
    player1Score+=score;
    p1throws++;
    if(p1throws>=3){currentPlayer=2;p1throws=0;}
  }else{
    player2Score+=score;
    p2throws++;
    if(p2throws>=3){currentPlayer=1;p2throws=0;rounds++;}
  }

  throwHistory.unshift(score);
  throwHistory=throwHistory.slice(0,10);
  if(rounds>10)endGame();
  updateScoreDisplay();drawBoard();
});

undoBtn.addEventListener("click",undoLastThrow);

function saveGameState(){
  gameStates.push(JSON.stringify({player1Score,player2Score,currentPlayer,p1throws,p2throws,rounds,throwHistory:[...throwHistory],gameOver}));
}

function undoLastThrow(){
  if(gameStates.length===0||gameOver)return alert('Нечего отменять!');
  ({player1Score,player2Score,currentPlayer,p1throws,p2throws,rounds,throwHistory,gameOver}=JSON.parse(gameStates.pop()));
  updateScoreDisplay();drawBoard();
}

function drawBoard(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.beginPath();ctx.arc(centerX,centerY,radius,0,Math.PI*2);ctx.fillStyle='#111';ctx.fill();
  for(let i=0;i<20;i++){
    ctx.beginPath();ctx.moveTo(centerX,centerY);
    ctx.arc(centerX,centerY,radius*0.85,rotation+i*angleStep,rotation+(i+1)*angleStep);
    ctx.closePath();ctx.fillStyle=i%2?'#ddd':'#000';ctx.fill();
  }
  drawRing(radius*0.5,radius*0.55,'#e13','#2a2');drawRing(radius*0.8,radius*0.85,'#e13','#2a2');
  ctx.beginPath();ctx.arc(centerX,centerY,outerBullRadius,0,2*Math.PI);ctx.fillStyle='#2a2';ctx.fill();
  ctx.beginPath();ctx.arc(centerX,centerY,bullRadius,0,2*Math.PI);ctx.fillStyle='#e13';ctx.fill();
  ctx.fillStyle="#fff";ctx.font=`${radius*0.07}px Arial`;ctx.textAlign="center";ctx.textBaseline="middle";
  for(let i=0;i<20;i++){
    const a=rotation+(i+0.5)*angleStep;
    ctx.fillText(sectors[i],centerX+Math.cos(a)*radius*0.93,centerY+Math.sin(a)*radius*0.93);
  }
  ctx.font=`${radius*0.05}px Arial`;ctx.fillStyle="#fff";
  const pname=currentPlayer===1?player1Name.value||'Игрок №1':player2Name.value||'Игрок №2';
  ctx.fillText(gameOver?'Игра окончена':`Раунд: ${rounds} – Ходит: ${pname}`,centerX,centerY+radius*1.05);
}

function drawRing(inner,outer,cA,cB){
  for(let i=0;i<20;i++){
    ctx.beginPath();
    ctx.arc(centerX,centerY,outer,rotation+i*angleStep,rotation+(i+1)*angleStep);
    ctx.arc(centerX,centerY,inner,rotation+(i+1)*angleStep,rotation+i*angleStep,true);
    ctx.closePath();ctx.fillStyle=i%2?cA:cB;ctx.fill();
  }
}

function updateScoreDisplay(){
  scoreDisplay.innerHTML=`
    ${player1Name.value||'Игрок №1'}: ${player1Score}<br/>
    ${player2Name.value||'Игрок №2'}: ${player2Score}<br/>
    Раунд: ${rounds}${gameOver?' – Игра окончена!':''}<br/><br/>
    Последние броски: ${throwHistory.join(", ")}`;
}

function endGame(){
  gameOver=true;let winner=player1Score>player2Score?(player1Name.value||'Игрок №1'):(player1Score<player2Score?(player2Name.value||'Игрок №2'):'Ничья!');
  alert(`🎯 Игра окончена!\n\nИгрок №1: ${player1Score}\nИгрок №2: ${player2Score}\n\nПобедитель: ${winner}`);
}

drawBoard();updateScoreDisplay();
