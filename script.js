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
  gameOver=true;
  const p1=player1Name.value||'Игрок №1';
  const p2=player2Name.value||'Игрок №2';
  let winner;
  if(player1Score>player2Score) winner=`Победитель: ${p1}! 🎉`;
  else if(player2Score>player1Score) winner=`Победитель: ${p2}! 🎉`;
  else winner="🤝 Ничья!";

  // Сообщение с результатами
  alert(`🏆 Результаты:\n\n${p1}: ${player1Score} очков\n${p2}: ${player2Score} очков\n\n${winner}`);

  // Запускаем салют
  launchFireworks();
}

// Салют на канвасе
function launchFireworks() {
  const fwCanvas = document.getElementById('fireworksCanvas');
  const fwCtx = fwCanvas.getContext('2d');
  fwCanvas.style.display='block';
  fwCanvas.width = window.innerWidth;
  fwCanvas.height = window.innerHeight;

  const particles = [];

  // класс частиц для салюта
  class Particle{
    constructor(x,y,color){
      this.x=x;this.y=y;
      this.speed=Math.random()*6+2;
      this.angle=Math.random()*Math.PI*2;
      this.color=color;
      this.life=Math.random()*50+50;
      this.size=Math.random()*3+1;
      this.gravity=0.03;
      this.opacity=1;
    }

    update(){
      this.speed*=0.98; // замедление
      this.x+=Math.cos(this.angle)*this.speed;
      this.y+=Math.sin(this.angle)*this.speed+this.gravity;
      this.opacity-=0.015; // исчезновение
      this.life--;
    }

    draw(){
      fwCtx.globalAlpha=this.opacity;
      fwCtx.fillStyle=this.color;
      fwCtx.beginPath();
      fwCtx.arc(this.x,this.y,this.size,0,Math.PI*2);
      fwCtx.fill();
    }
  }

  // Анимация салюта
  function animate(){
    fwCtx.fillStyle='rgba(0,0,0,0.1)';
    fwCtx.fillRect(0,0,fwCanvas.width,fwCanvas.height);
    particles.forEach((particle,i)=>{
      particle.update();
      particle.draw();
      if(particle.life<=0||particle.opacity<=0) particles.splice(i,1);
    });
    requestAnimationFrame(animate);
  }

  animate();

  // Запускаем праздничные залпы с разными цветами
  const colors=['#ff3f81','#3fa9ff','#ffbc41','#3bff7a','#a03dff','#ff3030','#3dffaa'];
  let salutesFired=0;
  const saluteInterval=setInterval(()=>{
    const x=Math.random()*fwCanvas.width*0.6+fwCanvas.width*0.2;
    const y=Math.random()*fwCanvas.height*0.5+fwCanvas.height*0.1;
    const color=colors[Math.floor(Math.random()*colors.length)];
    for(let i=0;i<100;i++) particles.push(new Particle(x,y,color));
    salutesFired++;
    if(salutesFired>=12){clearInterval(saluteInterval);}
  },800);
}

drawBoard();updateScoreDisplay();
