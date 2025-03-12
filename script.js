"use strict";

const canvas = document.getElementById('dartboardCanvas');
const ctx = canvas.getContext('2d');
const sectors = [20,1,18,4,13,6,10,15,2,17,3,19,7,16,8,11,14,9,12,5];

function drawBoard(){
    const radius = canvas.width / 2;
    const centerX = radius;
    const centerY = radius;

    ctx.clearRect(0,0,canvas.width,canvas.height);

    // рисуем общие сектора (чередование черно-белых цветов):
    for(let i = 0; i < 20; i++){
        const angle = (Math.PI * 2 / 20);
        const startAngle = (angle * i) - Math.PI / 2 - angle / 2;
        const endAngle = (angle * (i + 1)) - Math.PI / 2 - angle / 2;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX,centerY,radius,startAngle,endAngle,false);
        ctx.closePath();
        ctx.fillStyle = i % 2 ? '#000' : '#fff';
        ctx.fill();
    }

    // двойное кольцо
    for(let i = 0; i < 20; i++){
        const angle = (Math.PI * 2 / 20);
        const startAngle = angle * i - Math.PI / 2 - angle / 2;
        const endAngle = angle * (i + 1) - Math.PI / 2 - angle / 2;

        ctx.beginPath();
        ctx.arc(centerX,centerY,radius*0.95,startAngle,endAngle,false);
        ctx.arc(centerX,centerY,radius*0.85,endAngle,startAngle,true);
        ctx.closePath();
        ctx.fillStyle = i % 2 ? '#d32f2f' : '#5cb85c';
        ctx.fill();
    }

    // тройное кольцо
    for(let i = 0; i < 20; i++){
        const angle = (Math.PI * 2 / 20);
        const startAngle = angle * i - Math.PI / 2 - angle / 2;
        const endAngle = angle * (i + 1) - Math.PI / 2 - angle / 2;

        ctx.beginPath();
        ctx.arc(centerX,centerY,radius*0.6,startAngle,endAngle,false);
        ctx.arc(centerX,centerY,radius*0.5,endAngle,startAngle,true);
        ctx.closePath();
        ctx.fillStyle = i % 2 ? '#d32f2f' : '#5cb85c';
        ctx.fill();
    }

    // Внешний bullseye (зеленый)
    ctx.beginPath();
    ctx.arc(centerX,centerY,radius*0.08,0,Math.PI*2);
    ctx.fillStyle = '#5cb85c';
    ctx.fill();

    // Внутренний bullseye (красный)
    ctx.beginPath();
    ctx.arc(centerX,centerY,radius*0.04,0,Math.PI*2);
    ctx.fillStyle = '#d32f2f';
    ctx.fill();

    // ✔️ нумерация секторов:
    ctx.fillStyle = 'black';
    ctx.font = `${radius*0.06}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for(let i = 0; i < 20; i++){
        const angle = (Math.PI*2 / 20) * i - Math.PI/2;
        const x = centerX + Math.cos(angle)*(radius*1.03);
        const y = centerY + Math.sin(angle)*(radius*1.03);
        ctx.fillText(sectors[i], x, y);
    }
}

// функция кликов по секторам
function handleCanvasClick(e){
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - canvas.width/2;
    const y = e.clientY - rect.top - canvas.height/2;

    let angle = Math.atan2(y, x) + Math.PI/2;
    if(angle < 0) angle += Math.PI*2;

    let sectorIndex = Math.floor((angle)/(Math.PI*2)*20);
    let sector = sectors[sectorIndex];

    alert('Вы попали в сектор '+sector);
}

// вызов функций при загрузке страницы:
drawBoard();

// добавляем обработчик клика
canvas.addEventListener('click', handleCanvasClick);