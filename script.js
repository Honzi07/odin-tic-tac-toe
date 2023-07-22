'use strict';

const game = (function () {
  const gameCell = document.querySelectorAll('.game-cell');
  const gameBoard = [];
  let currentPlayer;

  const changePlayer = function (player1, player2) {
    gameCell.forEach((cell) =>
      cell.addEventListener('click', function (e) {
        if (e.target.innerText) return;

        currentPlayer = currentPlayer === player1 ? player2 : player1;
        console.log(currentPlayer);
      })
    );
    addSignToCell();
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
      })
    );
  };

  return { changePlayer, addSignToCell, gameCell, gameBoard };
})();

const player = function () {
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

      const player1Name = e.currentTarget.player1.value || 'player1';
      const player2Name = e.currentTarget.player2.value || 'player2';

      const player1 = createPlayer(player1Name, 'X');
      const player2 = createPlayer(player2Name, 'O');

      game.changePlayer(player1, player2);
    });
  };
  return { createPlayer, namePlayer };
};

const initGame = player();
initGame.namePlayer();
