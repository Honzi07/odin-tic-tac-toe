'use strict';

let player1;
let player2;

const game = (function () {
  const gameCell = document.querySelectorAll('.game-cell');
  const gameBoard = ['', '', '', '', '', '', '', '', ''];
  let currentPlayer;

  const changePlayer = function () {
    gameCell.forEach((cell) =>
      cell.addEventListener('click', function (e) {
        if (e.target.innerText) return;

        currentPlayer = currentPlayer === player1 ? player2 : player1;
        console.log(currentPlayer);
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
        console.log(currentPlayer);
        console.log(gameBoard);
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

    console.log(currentPlayer);

    for (const arr of winCells) {
      if (arr.every((cell) => gameBoard[cell] === 'X')) {
        display.displayEndingModal(currentPlayer.name);
        gameOver = true;
        break;
      } else if (arr.every((cell) => gameBoard[cell] === 'O')) {
        display.displayEndingModal(currentPlayer.name);
        gameOver = true;
        break;
      }
    }
    if (!gameOver && gameBoard.every((cell) => cell !== '')) {
      display.displayEndingModalDraw();
    }
  };

  return {
    changePlayer,
    addSignToCell,
    checkCells,
    changeCurrentPlayer,
    gameCell,
    gameBoard,
  };
})();

const display = (function () {
  const submitName = document.querySelector('[name="player-form"]');
  const winnerModal = document.querySelector('.winner-modal');
  const btnRestart = document.querySelector('.restart');
  const btnNewGame = document.querySelector('.new-game');

  const displayEndingModal = function (winner) {
    winnerModal.classList.remove('hidden');
    winnerModal.children[0].textContent = `${winner} WIN the game!`;
  };

  const displayEndingModalDraw = function () {
    winnerModal.classList.remove('hidden');
    winnerModal.children[0].textContent = 'The game is draw!';
  };

  const restartGame = function () {
    game.gameCell.forEach((cell) => (cell.innerText = ''));
    game.gameBoard.splice(0, Infinity, '', '', '', '', '', '', '', '', '');
    game.changeCurrentPlayer();
    winnerModal.classList.add('hidden');
  };

  const newGame = function () {
    submitName[0].value = submitName[1].value = '';
    submitName[0].focus();
    restartGame();
  };

  btnRestart.addEventListener('click', restartGame);

  btnNewGame.addEventListener('click', newGame);

  return { displayEndingModal, displayEndingModalDraw, submitName };
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

      game.changePlayer(player1, player2);
    });
  };
  return { createPlayer, namePlayer };
};

const initGame = player();
initGame.namePlayer();
