'use strict';

const game = (function () {
  const gameCell = document.querySelectorAll('.game-cell');
  const gameBoard = ['X', 'O', , , , , 'X', 'O'];

  const addSignToCell = function (player1, player2) {
    console.log(player1, player2);

    gameCell.forEach((cell) =>
      cell.addEventListener('click', function (e) {
        const i = e.target.dataset.index;

        if (!gameBoard[i]) {
          gameBoard[i] = player1.sign;
        }

        e.target.innerText = gameBoard[i];
        console.log(gameBoard);
      })
    );
  };

  console.log(gameBoard);
  return { addSignToCell, gameCell, gameBoard };
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

      game.addSignToCell(player1, player2);
    });
  };
  return { createPlayer, namePlayer };
};

const initGame = player();
initGame.namePlayer();
