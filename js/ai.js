/**
 * ai.js
 * -----
 * Implementación del algoritmo Minimax con poda alfa-beta para crear
 * un oponente de Triqui matemáticamente invencible en modo "difícil".
 *
 * ¿Qué es Minimax? Es un algoritmo clásico de teoría de juegos usado
 * en ajedrez, damas y otros juegos de suma cero con información
 * perfecta. Simula recursivamente todas las jugadas posibles hasta
 * el final de la partida, asumiendo que ambos jugadores juegan de
 * forma óptima, y elige la jugada que maximiza el resultado propio.
 *
 * ¿Por qué alfa-beta? Sin poda, la complejidad es O(b^d) (b = ramas,
 * d = profundidad). La poda alfa-beta descarta ramas que ya no
 * pueden cambiar la decisión final, reduciendo drásticamente los
 * nodos explorados sin afectar el resultado. Para Triqui no es
 * estrictamente necesaria (el árbol es pequeño), pero se incluye
 * como buena práctica y para demostrar el concepto.
 *
 * Este archivo no depende del DOM: es lógica pura, por lo que puede
 * probarse directamente con Node.js (ver tests/test_ai.js).
 */

const WINNING_CONDITIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // filas
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columnas
    [0, 4, 8], [2, 4, 6],            // diagonales
];

const HUMAN = 'X';
const COMPUTER = 'O';

/** Devuelve el símbolo ganador ('X' u 'O') de un tablero, o null si no hay. */
function getWinner(board) {
    for (const [a, b, c] of WINNING_CONDITIONS) {
        if (board[a] && board[a] === board[b] && board[b] === board[c]) {
            return board[a];
        }
    }
    return null;
}

function isBoardFull(board) {
    return board.every((cell) => cell !== '');
}

/**
 * Evalúa un tablero terminado: +10 si gana la computadora, -10 si
 * gana el humano, 0 si es empate. Se resta/suma la profundidad para
 * que la IA prefiera ganar lo antes posible y retrasar una derrota
 * inevitable (mejor comportamiento estratégico, no solo "ganar en algún momento").
 */
function evaluateBoard(board, depth) {
    const winner = getWinner(board);
    if (winner === COMPUTER) return 10 - depth;
    if (winner === HUMAN) return depth - 10;
    return 0;
}

/**
 * Algoritmo Minimax con poda alfa-beta.
 * @param {string[]} board - Estado actual del tablero (se muta y se restaura).
 * @param {number} depth - Profundidad actual de la recursión.
 * @param {boolean} isMaximizing - true si es el turno de la computadora.
 * @param {number} alpha - Mejor valor garantizado hasta ahora para el maximizador.
 * @param {number} beta - Mejor valor garantizado hasta ahora para el minimizador.
 * @returns {number} Puntaje de la mejor jugada posible desde este estado.
 */
function minimax(board, depth, isMaximizing, alpha, beta) {
    const winner = getWinner(board);
    if (winner !== null || isBoardFull(board)) {
        return evaluateBoard(board, depth);
    }

    if (isMaximizing) {
        let best = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] !== '') continue;
            board[i] = COMPUTER;
            best = Math.max(best, minimax(board, depth + 1, false, alpha, beta));
            board[i] = '';
            alpha = Math.max(alpha, best);
            if (beta <= alpha) break; // Poda: el rival ya tiene una mejor opción, no seguir explorando
        }
        return best;
    }

    let best = Infinity;
    for (let i = 0; i < board.length; i++) {
        if (board[i] !== '') continue;
        board[i] = HUMAN;
        best = Math.min(best, minimax(board, depth + 1, true, alpha, beta));
        board[i] = '';
        beta = Math.min(beta, best);
        if (beta <= alpha) break;
    }
    return best;
}

/**
 * Decide la jugada de la computadora según la dificultad elegida.
 * @param {string[]} board - Copia del tablero actual.
 * @param {'facil'|'dificil'} difficulty
 * @returns {number} Índice (0-8) de la celda elegida.
 */
function getComputerMove(board, difficulty) {
    const availableMoves = board
        .map((cell, index) => (cell === '' ? index : null))
        .filter((index) => index !== null);

    if (difficulty === 'facil') {
        // Modo fácil: jugada aleatoria entre las disponibles (deliberadamente no óptima).
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }

    // Modo difícil: evalúa cada jugada posible con Minimax y elige la de mejor puntaje.
    let bestScore = -Infinity;
    let bestMove = availableMoves[0];

    for (const move of availableMoves) {
        board[move] = COMPUTER;
        const score = minimax(board, 0, false, -Infinity, Infinity);
        board[move] = '';
        if (score > bestScore) {
            bestScore = score;
            bestMove = move;
        }
    }
    return bestMove;
}

// Compatibilidad con Node.js para poder probar este archivo sin navegador
// (ver tests/test_ai.js). En el navegador 'module' no existe, así que
// este bloque simplemente se ignora y las funciones quedan disponibles
// como variables globales para game.js.
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { getComputerMove, minimax, getWinner, WINNING_CONDITIONS };
}
