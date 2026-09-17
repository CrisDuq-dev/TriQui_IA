/**
 * test_ai.js
 * ----------
 * Pruebas del algoritmo Minimax. Se ejecutan con Node.js, sin
 * necesidad de navegador, porque ai.js es lógica pura (no toca el DOM).
 *
 * Ejecutar con:  node tests/test_ai.js
 */

const assert = require('assert');
const { getComputerMove, getWinner } = require('../js/ai.js');

function playRandomGameAgainstAI(aiStartsFirst) {
    const board = Array(9).fill('');
    let current = aiStartsFirst ? 'O' : 'X';

    while (true) {
        const winner = getWinner(board);
        if (winner) return winner;
        if (!board.includes('')) return 'draw';

        let move;
        if (current === 'O') {
            move = getComputerMove([...board], 'dificil');
        } else {
            const available = board
                .map((cell, index) => (cell === '' ? index : null))
                .filter((index) => index !== null);
            move = available[Math.floor(Math.random() * available.length)];
        }
        board[move] = current;
        current = current === 'X' ? 'O' : 'X';
    }
}

function testWinDetectionRow() {
    const board = ['X', 'X', 'X', '', '', '', '', '', ''];
    assert.strictEqual(getWinner(board), 'X');
    console.log('OK: deteccion de victoria en fila.');
}

function testWinDetectionDiagonal() {
    const board = ['O', '', '', '', 'O', '', '', '', 'O'];
    assert.strictEqual(getWinner(board), 'O');
    console.log('OK: deteccion de victoria en diagonal.');
}

function testNoWinnerOnEmptyBoard() {
    const board = Array(9).fill('');
    assert.strictEqual(getWinner(board), null);
    console.log('OK: tablero vacio no reporta ganador.');
}

function testAITakesTheWin() {
    // La IA (O) tiene una jugada ganadora inmediata en la casilla 2: debe tomarla.
    const board = ['O', 'O', '', 'X', 'X', '', '', '', ''];
    const move = getComputerMove([...board], 'dificil');
    assert.strictEqual(move, 2, `La IA deberia jugar en 2 para ganar, jugo en ${move}`);
    console.log('OK: la IA toma la jugada ganadora inmediata cuando existe.');
}

function testAIBlocksOpponent() {
    // El humano (X) esta a punto de ganar en la casilla 2: la IA debe bloquear.
    const board = ['X', 'X', '', 'O', '', '', '', '', ''];
    const move = getComputerMove([...board], 'dificil');
    assert.strictEqual(move, 2, `La IA deberia bloquear en 2, jugo en ${move}`);
    console.log('OK: la IA bloquea la jugada ganadora del oponente.');
}

function testAINeverLosesAgainstRandomPlay() {
    const GAMES = 200;
    let losses = 0;
    for (let i = 0; i < GAMES; i++) {
        const result = playRandomGameAgainstAI(i % 2 === 0);
        if (result === 'X') losses++;
    }
    assert.strictEqual(losses, 0, `La IA perdio ${losses} de ${GAMES} partidas contra jugadas aleatorias`);
    console.log(`OK: la IA (dificil) no perdio ninguna de ${GAMES} partidas contra un oponente aleatorio.`);
}

testWinDetectionRow();
testWinDetectionDiagonal();
testNoWinnerOnEmptyBoard();
testAITakesTheWin();
testAIBlocksOpponent();
testAINeverLosesAgainstRandomPlay();

console.log('\nTodas las pruebas pasaron correctamente.');
