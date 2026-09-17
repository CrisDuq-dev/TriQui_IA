/**
 * game.js
 * -------
 * Maneja el estado de la partida, la interacción con el DOM y el
 * flujo del juego: turnos, detección de victoria/empate, marcador
 * y los distintos modos (contra otra persona o contra la IA).
 *
 * WINNING_CONDITIONS, getWinner y getComputerMove vienen de ai.js,
 * que se carga antes que este archivo (ver index.html).
 */

// --- Referencias al DOM ---
const cells = document.querySelectorAll('.cell');
const turnIndicator = document.getElementById('turnIndicator');
const scoreXElement = document.getElementById('scoreX');
const scoreOElement = document.getElementById('scoreO');
const scoreDrawElement = document.getElementById('scoreDraw');
const modeSelector = document.getElementById('modeSelector');

// --- Estado del juego ---
let currentPlayer = 'X';
let board = Array(9).fill('');
let gameActive = true;
let gameMode = 'pvp'; // 'pvp' | 'facil' | 'dificil'

let scoreX = 0;
let scoreO = 0;
let scoreDraw = 0;

function handleCellClick(event) {
    const index = parseInt(event.target.getAttribute('data-index'), 10);

    if (board[index] !== '' || !gameActive) return;
    // En modos contra la IA, evita que el humano haga clic durante el turno de la computadora
    if (gameMode !== 'pvp' && currentPlayer === 'O') return;

    playMove(index, currentPlayer);
}

function playMove(index, player) {
    board[index] = player;
    const cell = cells[index];
    cell.innerText = player;
    cell.classList.add(player.toLowerCase());

    const result = checkGameEnd();
    if (result !== 'continue') return;

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

    const isComputerTurn = gameMode !== 'pvp' && currentPlayer === 'O';
    if (isComputerTurn) {
        turnIndicator.innerHTML = '🐙 Polpi is thinking...';
        setTimeout(computerPlay, 450); // Pequeña pausa para que se sienta natural, no instantáneo
    } else {
        updateTurnIndicator();
    }
}

function computerPlay() {
    if (!gameActive) return;
    const move = getComputerMove([...board], gameMode);
    playMove(move, 'O');
}

function checkGameEnd() {
    const winningLine = getWinningLine(board);

    if (winningLine) {
        highlightWinningCells(winningLine);
        if (currentPlayer === 'X') {
            scoreX++;
            scoreXElement.innerText = scoreX;
            turnIndicator.innerHTML = '¡<span class="score-x">X</span>&nbsp;He won the game !';
        } else {
            scoreO++;
            scoreOElement.innerText = scoreO;
            turnIndicator.innerHTML = '¡<span class="score-o">O</span>&nbsp;He won the game !';
        }
        gameActive = false;
        return 'win';
    }

    if (!board.includes('')) {
        scoreDraw++;
        scoreDrawElement.innerText = scoreDraw;
        turnIndicator.innerText = '¡It was a tie!';
        gameActive = false;
        return 'draw';
    }

    return 'continue';
}

function getWinningLine(currentBoard) {
    for (const line of WINNING_CONDITIONS) {
        const [a, b, c] = line;
        if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[b] === currentBoard[c]) {
            return line;
        }
    }
    return null;
}

function highlightWinningCells(line) {
    line.forEach((index) => cells[index].classList.add('winning-cell'));
}

function updateTurnIndicator() {
    if (!gameActive) return;
    turnIndicator.innerHTML = currentPlayer === 'X'
        ? 'Shift of:<span class="score-x">X</span>'
        : 'Shift of:<span class="score-o">O</span>';
}

function resetGame() {
    currentPlayer = 'X';
    board = Array(9).fill('');
    gameActive = true;
    updateTurnIndicator();

    cells.forEach((cell) => {
        cell.innerText = '';
        cell.classList.remove('x', 'o', 'winning-cell');
    });
}

function resetScores() {
    scoreX = 0;
    scoreO = 0;
    scoreDraw = 0;
    scoreXElement.innerText = 0;
    scoreOElement.innerText = 0;
    scoreDrawElement.innerText = 0;
    resetGame();
}

function changeMode(newMode) {
    gameMode = newMode;
    resetGame();
}

// --- Enlazar eventos ---
cells.forEach((cell) => cell.addEventListener('click', handleCellClick));
modeSelector.addEventListener('change', (event) => changeMode(event.target.value));

updateTurnIndicator();
