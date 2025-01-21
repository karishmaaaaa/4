const gameGrid = document.getElementById("grid");
const startGameButton = document.getElementById("start-button");
const gameStatusText = document.getElementById("status");
const redPlayerScore = document.getElementById("player1-score");
const yellowPlayerScore = document.getElementById("player2-score");

let activePlayer = "red";
let gameBoard = [];
let isGameRunning = false;
let redPlayerPoints = 0;
let yellowPlayerPoints = 0;
let countdownTimer = null;
let remainingTime = 10;

function setupGameBoard() {
    gameGrid.innerHTML = "";
    gameBoard = Array.from({ length: 6 }, () => Array(7).fill(null));

    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 7; col++) {
            const gridCell = document.createElement("div");
            gridCell.classList.add("cell");
            gridCell.dataset.row = row;
            gridCell.dataset.col = col;
            gameGrid.appendChild(gridCell);
        }
    }
}

function hasPlayerWon(row, col, color) {
    const directions = [
        [0, 1], [1, 0], [1, 1], [1, -1],
    ];

    for (let [dx, dy] of directions) {
        let streak = 1;

        for (let step = 1; step <= 3; step++) {
            const newRow = row + dx * step;
            const newCol = col + dy * step;
            if (newRow >= 0 && newRow < 6 && newCol >= 0 && newCol < 7 && gameBoard[newRow][newCol] === color) {
                streak++;
            } else {
                break;
            }
        }

        for (let step = 1; step <= 3; step++) {
            const newRow = row - dx * step;
            const newCol = col - dy * step;
            if (newRow >= 0 && newRow < 6 && newCol >= 0 && newCol < 7 && gameBoard[newRow][newCol] === color) {
                streak++;
            } else {
                break;
            }
        }

        if (streak >= 4) {
            return true;
        }
    }
    return false;
}

function handleGridClick(e) {
    if (!isGameRunning || activePlayer === "yellow") return;

    const clickedCell = e.target;
    const col = parseInt(clickedCell.dataset.col);

    dropToken(col, activePlayer);
    resetTimer();
    if (isGameRunning && activePlayer === "yellow") aiTakeTurn();
}

function dropToken(col, player) {
    for (let row = 5; row >= 0; row--) {
        if (!gameBoard[row][col]) {
            gameBoard[row][col] = player;
            const targetCell = document.querySelector(
                `.cell[data-row="${row}"][data-col="${col}"]`
            );
            targetCell.classList.add(player);

            if (hasPlayerWon(row, col, player)) {
                isGameRunning = false;
                gameStatusText.textContent = `Player ${
                    player === "red" ? "1" : "2"
                } wins!`;
                updateScores(player);
                return;
            }

            activePlayer = activePlayer === "red" ? "yellow" : "red";
            gameStatusText.textContent = `Player ${
                activePlayer === "red" ? "1's" : "2's"
            } turn (${activePlayer === "red" ? "Red" : "Yellow"})`;
            return;
        }
    }
    gameStatusText.textContent = "Column is full! Pick another.";
}

function aiTakeTurn() {
    setTimeout(() => {
        const availableCols = [];
        for (let col = 0; col < 7; col++) {
            if (!gameBoard[0][col]) availableCols.push(col);
        }
        const chosenCol = availableCols[Math.floor(Math.random() * availableCols.length)];
        dropToken(chosenCol, "yellow");
    }, 1000); // Simulate AI thinking time
}

function updateScores(player) {
    if (player === "red") {
        redPlayerPoints++;
        redPlayerScore.textContent = redPlayerPoints;
    } else {
        yellowPlayerPoints++;
        yellowPlayerScore.textContent = yellowPlayerPoints;
    }
}

function startCountdown() {
    remainingTime = 10;
    gameStatusText.textContent += ` | Time left: ${remainingTime}s`;
    countdownTimer = setInterval(() => {
        remainingTime--;
        gameStatusText.textContent = `Player ${
            activePlayer === "red" ? "1's" : "2's"
        } turn (${activePlayer === "red" ? "Red" : "Yellow"}) | Time left: ${remainingTime}s`;
        if (remainingTime <= 0) {
            clearInterval(countdownTimer);
            activePlayer = activePlayer === "red" ? "yellow" : "red";
            gameStatusText.textContent = `Player ${
                activePlayer === "red" ? "1's" : "2's"
            } turn (${activePlayer === "red" ? "Red" : "Yellow"})`;
            resetTimer();
            if (activePlayer === "yellow") aiTakeTurn();
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(countdownTimer);
    startCountdown();
}

startGameButton.addEventListener("click", () => {
    setupGameBoard();
    isGameRunning = true;
    activePlayer = "red";
    gameStatusText.textContent = "Player 1's turn (Red)";
    resetTimer();
});

gameGrid.addEventListener("click", handleGridClick);
