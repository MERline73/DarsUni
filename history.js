// Функция для загрузки истории из localStorage и обновления отображения
function loadHistoryFromStorage() {
    const savedGames = JSON.parse(localStorage.getItem('gameHistory')) || [];
    return savedGames;
}

// Функция для обновления списка истории игр
function updateHistory() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = ''; // Очищаем предыдущие результаты

    const gameHistory = loadHistoryFromStorage(); // Загружаем историю из localStorage

    gameHistory.forEach(game => {
        const li = document.createElement('li');
        li.textContent = `${game.player1} vs ${game.player2} - Победитель: ${game.winner}, Очки: ${game.score}`;
        historyList.appendChild(li);
    });
}

// Функция для обновления турнирной сетки
function updateTournamentGrid() {
    const tournamentBody = document.getElementById('tournament-body');
    tournamentBody.innerHTML = ''; // Очищаем турнирную сетку

    const gameHistory = loadHistoryFromStorage(); // Загружаем историю из localStorage

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

// Функция для добавления нового результата игры в историю и сохранение в localStorage
function addNewGameResult(player1, player2, winner, score) {
    const newGame = {
        player1: player1,
        player2: player2,
        winner: winner,
        score: score,
    };

    let gameHistory = loadHistoryFromStorage(); // Загружаем текущую историю
    gameHistory.push(newGame); // Добавляем новый результат

    localStorage.setItem('gameHistory', JSON.stringify(gameHistory)); // Сохраняем обновленную историю в localStorage

    updateHistory(); // Обновляем отображение истории
    updateTournamentGrid(); // Обновляем турнирную сетку
}

// Вызовем функции при загрузке страницы для начальной настройки
updateHistory();
updateTournamentGrid();
