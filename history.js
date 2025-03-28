// Пример массива с историей игр
let gameHistory = [
    { player1: 'Иван', player2: 'Алексей', winner: 'Иван', score: '120' },
    { player1: 'Мария', player2: 'Елена', winner: 'Елена', score: '150' },
    { player1: 'Дмитрий', player2: 'Максим', winner: 'Дмитрий', score: '100' },
];

// Функция для обновления списка истории игр
function updateHistory() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = ''; // Очищаем предыдущие результаты

    gameHistory.forEach(game => {
        const li = document.createElement('li');
        li.textContent = `${game.player1} vs ${game.player2} - Победитель: ${game.winner}, Очки: ${game.score}`;
        historyList.appendChild(li);
    });
}

// Функция для обновления турнирной сетки
function updateTournamentGrid() {
    const tournamentBody = document.getElementById('tournament-body');
    tournamentBody.innerHTML = ''; // Очищаем сетку

    gameHistory.forEach(game => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${game.player1}</td>
            <td>${game.player2}</td>
            <td>${game.winner}</td>
        `;
        tournamentBody.appendChild(tr);
    });
}

// Вызовем функции при загрузке страницы
updateHistory();
updateTournamentGrid();
