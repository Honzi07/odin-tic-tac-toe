'use strict';

let player1;
let player2;
let currentPlayer;
let ai;

const game = (function () {
  const gameCell = document.querySelectorAll('.game-cell');
  const gameBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  let allowPlayerClicks = true;
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

  const changePlayer = function (player) {
    if (player === player1) {
      currentPlayer = player2;
    }
    if (player === player2) {
      currentPlayer = player1;
    }
  };

  const AIplay = function (player) {
    if (AIcheckEmptyCell(gameBoard).length === 0) return;

    const { index } = AIminimax(gameBoard, player2);
    gameBoard[index] = player.sign;
    gameCell[index].innerText = player.sign;
    display.colorSign(currentPlayer, index);
  };

  const addSignToCell = function (e) {
    const i = e.target.dataset.index;

    if (typeof gameBoard[i] === 'number') {
      gameBoard[i] = currentPlayer.sign;
    }

    e.target.innerText = gameBoard[i];
  };

  const checkCells = function () {
    let gameOver = false;

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
    if (!gameOver && gameBoard.every((cell) => typeof cell !== 'number')) {
      display.displayEndingModalDraw();
    }
  };

  const AIcheckEmptyCell = function (board) {
    return board.filter((cell) => cell != 'O' && cell != 'X');
  };

  const AIcheckCells = function (board, player) {
    for (const arr of winCells) {
      if (arr.every((cell) => board[cell] === player.sign)) {
        return true;
      }
    }
    return false;
  };

  const AIminimax = function (newBoard, currentPlayer) {
    let emptyCellArr = AIcheckEmptyCell(newBoard);

    if (AIcheckCells(newBoard, player1)) {
      return { score: -10 };
    } else if (AIcheckCells(newBoard, player2)) {
      return { score: 10 };
    } else if (emptyCellArr.length === 0) {
      return { score: 0 };
    }

    const moves = [];

    for (const index of emptyCellArr) {
      const move = {};
      move.index = index;

      const newBoardCopy = [...newBoard];
      newBoardCopy[index] = currentPlayer.sign;

      let result = AIminimax(
        newBoardCopy,
        currentPlayer === player1 ? player2 : player1
      );
      move.score = result.score;

      moves.push(move);
    }

    let bestMove;
    if (currentPlayer === player2) {
      let bestScore = -Infinity;
      for (const move of moves) {
        if (move.score > bestScore) {
          bestScore = move.score;
          bestMove = move;
        }
      }
    } else {
      let bestScore = Infinity;
      for (const move of moves) {
        if (move.score < bestScore) {
          bestScore = move.score;
          bestMove = move;
        }
      }
    }
    return bestMove;
  };

  const getRandomDelay = function () {
    return Math.floor(Math.random() * (1100 - 300)) + 300;
  };

  gameCell.forEach((cell) =>
    cell.addEventListener('click', function (e) {
      if ((!allowPlayerClicks && ai) || e.target.innerText) return;

      !ai ? (allowPlayerClicks = true) : (allowPlayerClicks = false);

      let index = e.target.dataset.index;
      const randomDelay = getRandomDelay();

      addSignToCell(e);
      display.colorSign(currentPlayer, index);
      display.displayCurrentPlayer(currentPlayer);
      checkCells();
      changePlayer(currentPlayer);

      if (ai && currentPlayer === player2) {
        setTimeout(() => {
          AIplay(currentPlayer);
          display.displayCurrentPlayer(currentPlayer);
          checkCells();
          changePlayer(player2);
          allowPlayerClicks = true;
        }, randomDelay);
      }
    })
  );

  return {
    gameCell,
    gameBoard,
    allowPlayerClicks,
  };
})();

const display = (function () {
  const btnAi = document.querySelector('.ai-button');
  const btnPvp = document.querySelector('.pvp-button');
  const modeModal = document.querySelector('.mode-modal');
  const submitName = document.querySelector('[name="player-form"]');
  const btnStart = submitName[4];
  const winnerModal = document.querySelector('.winner-modal');
  const btnRestart = document.querySelector('.restart');
  const btnNewGame = document.querySelector('.new-game');
  const displayPlayer = document.querySelector('.display-player');
  const inputModal = document.querySelector('.input-modal');
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
    gameOverTextWinner.textContent = '';
    winnerModal.classList.remove('hidden');
    gameOverText.textContent = 'The game is draw!';
  };

  const restartGame = function () {
    game.gameCell.forEach((cell) => {
      cell.innerText = '';
      cell.classList.remove('X', 'O');
    });
    game.gameBoard.splice(0, Infinity, 0, 1, 2, 3, 4, 5, 6, 7, 8);
    // game.changeCurrentPlayer();
    currentPlayer = player1;
    displayCurrentPlayer(currentPlayer);
    winnerModal.classList.add('hidden');
    gameOverTextWinner.classList.remove('X', 'O');
  };

  const newGame = function () {
    restartGame();
    modeModal.classList.remove('hidden');
    submitName[1].value = submitName[3].value = '';
  };

  const colorSign = function (player, i) {
    if (player.sign === 'X') {
      game.gameCell[i].classList.add('X');
    }
    if (player.sign === 'O') {
      game.gameCell[i].classList.add('O');
    }
  };

  btnAi.addEventListener('click', function () {
    inputModal.classList.remove('hidden');
    modeModal.classList.add('hidden');
    const player2Input = document.querySelector('#player2');
    player2Input.value = 'Computer';
    player2Input.setAttribute('readonly', '');
    ai = true;
  });

  btnPvp.addEventListener('click', function () {
    const player2Input = document.querySelector('#player2');
    inputModal.classList.remove('hidden');
    modeModal.classList.add('hidden');
    player2Input.removeAttribute('readonly');
    player2Input.removeAttribute('value');
    player2Input.placeholder = 'Change name';
    ai = false;
  });

  btnStart.addEventListener('click', function () {
    document.querySelector('main').classList.remove('hidden');
    inputModal.classList.add('hidden');
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

      currentPlayer = player1;
      display.displayCurrentPlayer(player2);
    });
  };
  return { createPlayer, namePlayer };
};

const initGame = player();
initGame.namePlayer();
