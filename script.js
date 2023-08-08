'use strict';

let player1;
let player2;

const game = (function () {
  const gameCell = document.querySelectorAll('.game-cell');
  const gameBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8];
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
  let currentPlayer;

  const changePlayer = function () {
    gameCell.forEach((cell) =>
      cell.addEventListener('click', function (e) {
        if (e.target.innerText) return;

        currentPlayer = currentPlayer === player1 ? player2 : player1;
        console.log(currentPlayer);

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

        if (typeof gameBoard[i] === 'number') {
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
  const submitNameVsAI = document.querySelector('[name="cpu-form"]');
  const btnStart = submitNameVsAI[2];
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
    // console.log(game.gameCell);
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

  const AInaming = function () {
    const submitNameVsAI = document.querySelector('[name="cpu-form"]');

    submitNameVsAI.addEventListener('submit', function (e) {
      e.preventDefault();

      player1Name = e.currentTarget.player1.value || 'player1';

      player1 = createPlayer(player1Name, 'X');
      player2 = createPlayer('computer', 'O');

      display.displayCurrentPlayer(player2);

      game.changePlayer(player1, player2);
    });
  };

  // const namePlayer = function () {
  //   const submitName = document.querySelector('[name="player-form"]');
  //   submitName.addEventListener('submit', function (e) {
  //     e.preventDefault();

  //     player1Name = e.currentTarget.player1.value || 'player1';
  //     player2Name = e.currentTarget.player2.value || 'player2';

  //     player1 = createPlayer(player1Name, 'X');
  //     player2 = createPlayer(player2Name, 'O');

  //     display.displayCurrentPlayer(player2);

  //     game.changePlayer(player1, player2);
  //   });
  // };
  return { createPlayer, AInaming };
};

const initGame = player();
initGame.AInaming();
