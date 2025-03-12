"use strict";

const canvas = document.getElementById('dartboardCanvas');
const ctx = canvas.getContext('2d');
const sectors = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17,
                 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];

function drawBoard(){
    const radius = canvas.width / 2;
    const centerX = radius;
    const centerY = radius;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Основные сектора с чередованием цветов
    for(let i = 0; i < 20; i++){
        const angle = (Math.PI * 2 / 20);
        const startAngle = angle * i - Math.PI / 2 - angle / 2;
        const endAngle = angle * (i + 1) - Math.PI / 2 - angle / 2;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX,centerY,radius,startAngle,endAngle);
        ctx.closePath();
        ctx.fillStyle = i % 2 ? '#000' : '#fff';
        ctx.fill();
    }

    // Рисуем двойное кольцо
    for(let i = 0; i < 20; i++){
        const angle = (Math.PI * 2 / 20);
        const startAngle = angle * i - Math.PI / 2 - angle / 2;
        const endAngle = angle * (i + 1) - Math.PI / 2 - angle / 2;

        ctx.beginPath();
        ctx.arc(centerX,centerY,radius*0.95,startAngle,endAngle,false);
        ctx.arc(centerX,centerY,radius*0.85,endAngle,startAngle,true);
        ctx.closePath();
        ctx.fillStyle = i % 2 ? '#D32F2F': '#388E3C';
        ctx.fill();
    }

    // Рисуем тройное кольцо
    for(let i = 0; i < 20; i++){
        const angle = (Math.PI * 2 / 20);
        const startAngle = angle * i - Math.PI / 2 - angle / 2;
        const endAngle = angle * (i + 1) - Math.PI / 2 - angle / 2;

        ctx.beginPath();
        ctx.arc(centerX,centerY,radius*0.6,startAngle,endAngle,false);
        ctx.arc(centerX,centerY,radius*0.5,endAngle,startAngle,true);
        ctx.closePath();
        ctx.fillStyle = i % 2 ? '#D32F2F': '#388E3C';
        ctx.fill();
    }

    // Внешний центр (зеленый)
    ctx.fillStyle = '#388E3C';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.08, 0, Math.PI*2);
    ctx.fill();

    // Внутренний центр (красный)
    ctx.fillStyle = '#D32F2F';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.04, 0, Math.PI*2);
    ctx.fill();

    // Нумерация секторов - количество очков напротив каждого сектора
    ctx.fillStyle = 'white';
    ctx.font = `bold ${radius*0.07}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for(let i = 0; i < 20; i++){
        const angle = (Math.PI*2 / 20)*i - Math.PI/2;
        const x = centerX + Math.cos(angle)*(radius*1.05);
        const y = centerY + Math.sin(angle)*(radius*1.05);
        ctx.fillText(sectors[i], x, y);
    }
}

// Обработка клика по мишени
function handleCanvasClick(e){
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - canvas.width / 2;
    const y = e.clientY - rect.top - canvas.height / 2;
    const angle = (Math.atan2(y, x) * 180 / Math.PI + 450) % 360;
    const sectorIndex = Math.floor(angle / 18);
    const score = sectors[sectorIndex];

    alert('Вы попали в сектор ' + score);
}

drawBoard();
canvas.addEventListener('click', handleCanvasClick);