const boardElement = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const resetBtn = document.getElementById('resetBtn');

let humanPlayer = "X";
let aiPlayer = "O";
let gameState = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

// Handle Human Move
function handleCellClick(e) {
    const clickedIndex = parseInt(e.target.getAttribute('data-index'));

    if (gameState[clickedIndex] !== "" || !gameActive) return;

    makeMove(clickedIndex, humanPlayer);

    if (gameActive) {
        statusText.innerText = "AI is thinking...";
        setTimeout(() => {
            const bestMove = minimax(gameState, aiPlayer).index;
            makeMove(bestMove, aiPlayer);
        }, 500); // Slight delay for realism
    }
}

function makeMove(index, player) {
    gameState[index] = player;
    cells[index].innerText = player;
    cells[index].classList.add(player.toLowerCase());
    
    if (checkWin(gameState, player)) {
        statusText.innerText = player === humanPlayer ? "You Win!" : "AI Wins!";
        gameActive = false;
    } else if (gameState.every(cell => cell !== "")) {
        statusText.innerText = "It's a Draw!";
        gameActive = false;
    } else {
        statusText.innerText = player === humanPlayer ? "AI's Turn" : "Your Turn";
    }
}

// Minimax Algorithm Logic
function checkWin(board, player) {
    return winningConditions.some(condition => {
        return condition.every(index => board[index] === player);
    });
}

function minimax(newBoard, player) {
    const availSpots = newBoard.map((val, idx) => val === "" ? idx : null).filter(val => val !== null);

    if (checkWin(newBoard, humanPlayer)) return { score: -10 };
    if (checkWin(newBoard, aiPlayer)) return { score: 10 };
    if (availSpots.length === 0) return { score: 0 };

    const moves = [];
    for (let i = 0; i < availSpots.length; i++) {
        let move = {};
        move.index = availSpots[i];
        newBoard[availSpots[i]] = player;

        if (player === aiPlayer) {
            move.score = minimax(newBoard, humanPlayer).score;
        } else {
            move.score = minimax(newBoard, aiPlayer).score;
        }

        newBoard[availSpots[i]] = "";
        moves.push(move);
    }

    let bestMove;
    if (player === aiPlayer) {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    return moves[bestMove];
}

function resetGame() {
    gameState = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    statusText.innerText = "Your Turn";
    cells.forEach(cell => {
        cell.innerText = "";
        cell.classList.remove('x', 'o');
    });
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetBtn.addEventListener('click', resetGame);

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
}
