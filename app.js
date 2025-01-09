const grid = document.getElementById("grid");
const startButton = document.getElementById("start-button");
const statusText = document.getElementById("status");
const player1ScoreEl = document.getElementById("player1-score");
const player2ScoreEl = document.getElementById("player2-score");

let currentPlayer = "red";
let board = [];
let gameActive = false;
let player1Score = 0;
let player2Score = 0;

function initializeBoard() {
    grid.innerHTML = "";
    board = Array.from({ length: 6 }, () => Array(7).fill(null));

    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 7; col++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.row = row;
            cell.dataset.col = col;
            grid.appendChild(cell);
        }
    }
}

function checkWin(row, col, color) {
    const directions = [
        [0, 1], [1, 0], [1, 1], [1, -1],
    ];

    for (let [dx, dy] of directions) {
        let count = 1;

        for (let step = 1; step <= 3; step++) {
            const r = row + dx * step;
            const c = col + dy * step;
            if (r >= 0 && r < 6 && c >= 0 && c < 7 && board[r][c] === color) {
                count++;
            } else {
                break;
            }
        }

        for (let step = 1; step <= 3; step++) {
            const r = row - dx * step;
            const c = col - dy * step;
            if (r >= 0 && r < 6 && c >= 0 && c < 7 && board[r][c] === color) {
                count++;
            } else {
                break;
            }
        }

        if (count >= 4) {
            return true;
        }
    }
    return false;
}

function handleCellClick(e) {
    if (!gameActive) return;

    const cell = e.target;
    const col = parseInt(cell.dataset.col);

    for (let row = 5; row >= 0; row--) {
        if (!board[row][col]) {
            board[row][col] = currentPlayer;
            const cellToFill = document.querySelector(
                `.cell[data-row="${row}"][data-col="${col}"]`
            );
            cellToFill.classList.add(currentPlayer);

            if (checkWin(row, col, currentPlayer)) {
                gameActive = false;
                statusText.textContent = `Player ${
                    currentPlayer === "red" ? "1" : "2"
                } wins!`;
                updateScore();
                return;
            }

            currentPlayer = currentPlayer === "red" ? "yellow" : "red";
            statusText.textContent = `Player ${
                currentPlayer === "red" ? "1's" : "2's"
            } turn (${currentPlayer === "red" ? "Red" : "Yellow"})`;
            return;
        }
    }
    statusText.textContent = "Column is full! Choose another.";
}

function updateScore() {
    if (currentPlayer === "red") {
        player1Score++;
        player1ScoreEl.textContent = player1Score;
    } else {
        player2Score++;
        player2ScoreEl.textContent = player2Score;
    }
}

startButton.addEventListener("click", () => {
    initializeBoard();
    gameActive = true;
    currentPlayer = "red";
    statusText.textContent = "Player 1's turn (Red)";
});

grid.addEventListener("click", handleCellClick);
