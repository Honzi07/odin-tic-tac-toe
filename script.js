'use strict';

let player1;
let player2;

const game = (function () {
  const gameCell = document.querySelectorAll('.game-cell');
  const gameBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  let currentPlayer;

  const changePlayer = function () {
    gameCell.forEach((cell) =>
      cell.addEventListener('click', function (e) {
        if (e.target.innerText) return;

        currentPlayer = currentPlayer === player1 ? player2 : player1;

        display.colorSign(currentPlayer, cell);
        display.displayCurrentPlayer(currentPlayer);
      })
    );
    addSignToCell();
  };

  const changeCurrentPlayer = function (player1) {
    currentPlayer = player1;
  };

  const addSignToCell = function () {
    gameCell.forEach((cell) =>
      cell.addEventListener('click', function (e) {
        const i = e.target.dataset.index;

        if (!gameBoard[i]) {
          gameBoard[i] = currentPlayer.sign;
        }

        e.target.innerText = gameBoard[i];
        checkCells();
      })
    );
  };

  const checkCells = function () {
    let gameOver = false;
    const winCells = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const arr of winCells) {
      if (arr.every((cell) => gameBoard[cell] === 'X')) {
        display.colorGameOverText(currentPlayer);
        display.displayEndingModal(currentPlayer.name);
        gameOver = true;
        break;
      } else if (arr.every((cell) => gameBoard[cell] === 'O')) {
        display.colorGameOverText(currentPlayer);
        display.displayEndingModal(currentPlayer.name);
        gameOver = true;
        break;
      }
    }
    if (!gameOver && gameBoard.every((cell) => cell !== '')) {
      display.displayEndingModalDraw();
    }
  };

  const AIcheckEmptyCell = function (board) {
    return board.filter((cell) => cell != 'O' && cell != 'X');
  };

  const AIcheckCells = function (newBoard, player) {
    const winCells = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const arr of winCells) {
      if (arr.every((cell) => newBoard[cell] === player.sign)) {
        return true;
      } else {
        return false;
      }
    }
  };

  const AIminimax = function (newBoard, player) {
    let emptyCellArr = AIcheckEmptyCell(newBoard);

    if (AIcheckCells(newBoard, player1)) {
      return { score: -10 };
    } else if (AIcheckCells(newBoard, player2)) {
      return { score: 10 };
    } else if (emptyCellArr.length === 0) {
      return { score: 0 };
    }

    const moves = [];

    for (const cell of emptyCellArr) {
      const move = {};
      move.index = newBoard[emptyCellArr[cell]];

      newBoard[emptyCellArr[cell]] = player;

      if (player === player2) {
        let result = AIminimax(newBoard, player1);
        move.score = result.score;
      } else {
        let result = AIminimax(newBoard, player2);
        move.score = result.score;
      }

      newBoard[emptyCellArr[cell]] = move.index;
      moves.push(move);
    }

    let bestMove;

    if (player === player2) {
      let bestScore = -Infinity;
      for (const i of moves) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    } else {
      let bestScore = Infinity;
      for (const i of moves) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }
    return moves[bestMove];
  };

  return {
    changePlayer,
    addSignToCell,
    checkCells,
    changeCurrentPlayer,
    AIcheckEmptyCell,
    AIcheckCells,
    AIminimax,
    gameCell,
    gameBoard,
  };
})();

const display = (function () {
  const submitName = document.querySelector('[name="player-form"]');
  const btnStart = submitName[4];
  const winnerModal = document.querySelector('.winner-modal');
  const btnRestart = document.querySelector('.restart');
  const btnNewGame = document.querySelector('.new-game');
  const displayPlayer = document.querySelector('.display-player');
  const gameBoard = document.querySelector('.game-board');
  const modal = document.querySelector('.modal');
  const gameOverTextWinner = document.querySelector('.game-over-text-winner');
  const gameOverText = document.querySelector('.game-over-text');

  const displayCurrentPlayer = function (player) {
    const currentPlayerName = displayPlayer.children[0];
    const currentPlayerSign = displayPlayer.children[2];

    if (player === player1) {
      currentPlayerName.textContent = player2.name;
      currentPlayerSign.textContent = player2.sign;
      currentPlayerSign.classList.add('O');
      currentPlayerSign.classList.remove('X');
    } else {
      currentPlayerName.textContent = player1.name;
      currentPlayerSign.textContent = player1.sign;
      currentPlayerSign.classList.add('X');
      currentPlayerSign.classList.remove('O');
    }
  };

  const colorGameOverText = function (winner) {
    if (winner === player1) {
      gameOverTextWinner.classList.add('X');
    }
    if (winner === player2) {
      gameOverTextWinner.classList.add('O');
    }
  };

  const displayEndingModal = function (winner) {
    winnerModal.classList.remove('hidden');
    gameOverTextWinner.textContent = `${winner} WIN`;
    gameOverText.textContent = 'the game!';
  };

  const displayEndingModalDraw = function () {
    winnerModal.classList.remove('hidden');
    gameOverText.textContent = 'The game is draw!';
  };

  const restartGame = function () {
    game.gameCell.forEach((cell) => {
      cell.innerText = '';
      cell.classList.remove('X', 'O');
    });
    game.gameBoard.splice(0, Infinity, 0, 1, 2, 3, 4, 5, 6, 7, 8);
    game.changeCurrentPlayer();
    winnerModal.classList.add('hidden');
    gameOverTextWinner.classList.remove('X', 'O');
  };

  const newGame = function () {
    restartGame();
    modal.classList.remove('hidden');
    submitName[1].value = submitName[3].value = '';
    submitName[1].focus();
  };

  const colorSign = function (player, cell) {
    if (player.sign === 'X') {
      cell.classList.add('X');
    }
    if (player.sign === 'O') {
      cell.classList.add('O');
    }
  };

  btnStart.addEventListener('click', function () {
    gameBoard.classList.remove('hidden');
    modal.classList.add('hidden');
  });

  btnRestart.addEventListener('click', function () {
    restartGame();
    displayCurrentPlayer();
  });

  btnNewGame.addEventListener('click', newGame);

  return {
    displayCurrentPlayer,
    displayEndingModal,
    displayEndingModalDraw,
    colorSign,
    colorGameOverText,
    submitName,
  };
})();

const player = function () {
  let player1Name;
  let player2Name;

  const createPlayer = function (name, sign) {
    return {
      name,
      sign,
    };
  };

  const namePlayer = function () {
    const submitName = document.querySelector('[name="player-form"]');
    submitName.addEventListener('submit', function (e) {
      e.preventDefault();

      player1Name = e.currentTarget.player1.value || 'player1';
      player2Name = e.currentTarget.player2.value || 'player2';

      player1 = createPlayer(player1Name, 'X');
      player2 = createPlayer(player2Name, 'O');

      display.displayCurrentPlayer(player2);

      game.changePlayer(player1, player2);
    });
  };
  return { createPlayer, namePlayer };
};

const initGame = player();
initGame.namePlayer();
