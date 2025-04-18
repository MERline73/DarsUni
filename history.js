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

// Функция для добавления нового результата игры в localStorage
function addNewGameResult(player1, player2, winner, score) {
    const gameResult = {
        player1: player1,
        player2: player2,
        winner: winner,
        score: score,
    };

    let savedGames = JSON.parse(localStorage.getItem('gameHistory')) || [];
    savedGames.push(gameResult);  // Добавляем новый результат в сохраненные игры
    localStorage.setItem('gameHistory', JSON.stringify(savedGames));  // Сохраняем в localStorage

    updateHistory();  // Обновляем отображение истории
    updateTournamentGrid();  // Обновляем турнирную сетку
}

// Функция для очищения истории игр
function clearHistory() {
    localStorage.removeItem('gameHistory');  // Очищаем историю игр из localStorage
    updateHistory();  // Обновляем отображение истории
    updateTournamentGrid();  // Обновляем турнирную сетку
}

// Вызовем функции при загрузке страницы для начальной настройки
document.addEventListener('DOMContentLoaded', () => {
    updateHistory();
    updateTournamentGrid();
});

// Пример использования функции добавления нового результата игры
// Например, эта функция будет вызываться после завершения каждой игры:
addNewGameResult('Олег', 'Сергей', 'Сергей', '140');

// Если нужно очистить историю, можно использовать:
clearHistory();  // Очистить всю историю
