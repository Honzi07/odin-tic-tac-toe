const game = (function () {
  const gameCell = document.querySelectorAll('.game-cell');
  const gameBoard = ['X', 'O', 'X', , , , 'X', 'O'];

  const renderGameCellContent = function () {
    gameBoard.forEach((el, i) => (gameCell[i].textContent = el));
    gameBoard.forEach((el, i) => console.log(el, i));
  };

  const addSignToCell = function () {
    gameCell.forEach((cell) =>
      cell.addEventListener('click', function (e) {
        let i = e.target.dataset.index;

        if (!gameBoard[i]) {
          gameBoard[i] = 'X';
        }

        e.target.innerText = gameBoard[i];

        console.log(e.target.dataset);
        console.dir(e.target);
      })
    );
  };

  console.log(gameBoard);
  console.log(gameCell);
  return { renderGameCellContent, addSignToCell, gameCell, gameBoard };
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

      player1Name = e.currentTarget.player1.value || 'player1';
      player2Name = e.currentTarget.player2.value || 'player2';

      const player1 = createPlayer(player1Name, 'X');
      const player2 = createPlayer(player2Name, 'O');

      console.log(player1);
      console.log(player2);
    });
  };

  return { createPlayer, namePlayer };
};

const test = player();
test.namePlayer();
