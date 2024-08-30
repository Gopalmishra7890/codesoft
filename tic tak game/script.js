const board = Array(9).fill(null);
const cells = document.querySelectorAll('.cell');
const messageElement = document.getElementById('message');
const restartButton = document.getElementById('restart-btn');

const humanPlayer = 'X';
const aiPlayer = 'O';

const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],  // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8],  // Columns
    [0, 4, 8], [2, 4, 6]              // Diagonals
];

cells.forEach(cell => cell.addEventListener('click', handleClick));
restartButton.addEventListener('click', restartGame);

function handleClick(event) {
    const index = event.target.dataset.index;

    if (board[index] || checkWinner(board) || isDraw()) return;

    makeMove(index, humanPlayer);
    if (!checkWinner(board) && !isDraw()) {
        makeMove(findBestMove(board), aiPlayer);
    }
}

function makeMove(index, player) {
    board[index] = player;
    cells[index].textContent = player;

    if (checkWinner(board)) {
        messageElement.textContent = `${player} wins!`;
        cells.forEach(cell => cell.removeEventListener('click', handleClick));  // Prevent further clicks after win
    } else if (isDraw()) {
        messageElement.textContent = `It's a draw!`;
    }
}

function checkWinner(board) {
    for (const combo of winningCombinations) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return null;
}

function isDraw() {
    return board.every(cell => cell);
}

function findBestMove(board) {
    let bestScore = -Infinity;
    let bestMove;

    for (let i = 0; i < board.length; i++) {
        if (!board[i]) {
            board[i] = aiPlayer;
            const score = minimax(board, 0, false);
            board[i] = null;
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }
    return bestMove;
}

function minimax(board, depth, isMaximizing) {
    const winner = checkWinner(board);
    if (winner === aiPlayer) return 10 - depth;
    if (winner === humanPlayer) return depth - 10;
    if (isDraw()) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (!board[i]) {
                board[i] = aiPlayer;
                bestScore = Math.max(bestScore, minimax(board, depth + 1, false));
                board[i] = null;
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (!board[i]) {
                board[i] = humanPlayer;
                bestScore = Math.min(bestScore, minimax(board, depth + 1, true));
                board[i] = null;
            }
        }
        return bestScore;
    }
}

function restartGame() {
    board.fill(null);
    cells.forEach(cell => {
        cell.textContent = '';
        cell.addEventListener('click', handleClick);  // Re-enable click events
    });
    messageElement.textContent = '';
}
