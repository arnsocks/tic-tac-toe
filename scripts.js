const GameBoard = (function () {
  const rows = 3;
  const columns = 3;
  let board = [];

  const setBoard = () => {
    board = [];
    for(i = 0; i < rows; i++) {
      board[i] = [];
      for(j = 0; j < columns; j++) {
        board[i].push(Cell());
      }
    }
  }

  const getBoard = () => board;

  const placeToken = (cell, player) => {
    board[cell.row][cell.column].addToken(player.token);
  };

  const printBoard = () => {
    const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
    console.log(boardWithCellValues);
  };

  function Cell() {
    let value = '';
    const addToken = (token) => {
      value = token;
    }

    const getValue = () => value;

    return {
      addToken,
      getValue
    };
  };

  setBoard();

  return {
    getBoard,
    placeToken,
    printBoard,
    setBoard
  };
})();

const GameController = (() => {
  //const gameBoard = GameBoard();

  let gameStatus = '';
  
  const players = [
    {
      name: 'Player One',
      token: "X"
    },
    {
      name: 'Player Two',
      token: "O"
    }
  ];

  let activePlayer = players[0];
  

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  }
  const getActivePlayer = () => activePlayer;
  
  const printNewRound = () => {
    console.log(activePlayer.name + "'s turn!");
    gameStatus = `${activePlayer.name}'s turn!`;
    GameBoard.printBoard();
  }

  const playRound = (cell) => {
    let gameResult = '';
    // Don't accept a non-empty cell
    if (GameBoard.getBoard()[cell.row][cell.column].getValue()) {
      console.log("You cannot play in a non-empty cell");
      printNewRound();
      return;
    } 

    GameBoard.placeToken(cell, getActivePlayer());
    // switchPlayerTurn();
    // printNewRound();
    
    gameResult = checkResult(GameBoard.getBoard());
    if (gameResult === 'win') {
      console.log(`${activePlayer.name} wins!`);
      gameStatus = `${activePlayer.name} wins!`;
      return;
    } else if (gameResult === 'draw') {
      console.log(`It's a draw`);
      gameStatus = `It's a draw!`;
      return;
    }
    switchPlayerTurn();
    printNewRound();
  };

  const setPlayerName = (index, playerName) => {
    players[index].name = playerName;
  }
  
  function checkResult(board) {
    
    const boardSize = board.length;

    // If every item on the line matches and is non-zero then the line is a win
    const lineMatches = (cellArray) => {
      if (
        cellArray[0] &&
        cellArray.every( (cell) => cell === cellArray[0])
      ) {
        return true;
      }
    }

    // Check each row for a win
    for ( let i = 0; i < boardSize; i++) {
      let testRow = [];
      for (let j = 0; j < boardSize; j++) {
        testRow.push(board[i][j].getValue());
      }
      if (lineMatches(testRow)) {
        return `win`;
      }
    }

    // Check each column for a win
    for ( let i = 0; i < boardSize; i++) {
      let testCol = [];
      for (let j = 0; j < boardSize; j++) {
        testCol.push(board[j][i].getValue());
      }
      if (lineMatches(testCol)) {
        return 'win';
      }
    }
    
    // Check TOP-LEFT to BOTTOM-RIGHT diagonal
    const diagTest1 = function () {
      let testDiag = [];
      for (let i = 0; i < boardSize; i ++) {
        testDiag.push(board[i][i].getValue());
      }
      if (lineMatches(testDiag)) {
        return true;
      }
    };
    if (diagTest1()) return 'win';
    
    // check TOP-RIGHT to BOTTOM-LEFT diagonal
    const diagTest2 = function () {
      let testDiag = [];
      for (let i = 0; i < boardSize; i ++) {
        testDiag.push(board[i][boardSize - (i+1)].getValue());
      }
      if (lineMatches(testDiag)) {
        return true;
      }
    };
    if (diagTest2()) return 'win';

    // check for a DRAW 
    // if every cell is non zero and there's no winner then it's a draw
    if (board.flat().every( (cell) => cell.getValue())) return 'draw';
  };

  const getGameStatus = () => gameStatus;

  const resetGame = () => {
    activePlayer = players[0];
    GameBoard.setBoard();
    gameStatus = '';
    printNewRound();

  }

  printNewRound(); //Print the board for the first round

  return {
    getActivePlayer,
    playRound,
    setPlayerName,
    getGameStatus,
    resetGame
  };
})();

const ScreenController = (() => {
  // DECLARE DOM objects into variables
  const outputDiv = document.querySelector('#output');
  const boardDiv = document.querySelector('#game-board');
  const resetBtn = document.querySelector('#reset');

  // ** METHODS **
  const updateScreen = () => {
    boardDiv.textContent = ''; //clear the board

    const board = GameBoard.getBoard();
    const activePlayer = GameController.getActivePlayer();

    outputDiv.textContent = GameController.getGameStatus();

    // Render the board grid cells
    board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");

        cellButton.dataset.row = rowIndex;
        cellButton.dataset.col = colIndex;
        cellButton.textContent = cell.getValue();
        if (!cell.getValue()) {
          cellButton.classList.add('empty');
        } else {
          cellButton.classList.add(cell.getValue());
        }
        boardDiv.append(cellButton);
      })
    })
  };

  // ** EVENT HANDLER FUNCTIONS **
  function clickHandlerBoard(e) {
    const selectedCell = {
      row: e.target.dataset.row,
      column: e.target.dataset.col
    };
    console.log({selectedCell})

    if (!selectedCell.row) return; // Make sure user clicked an actual cell

    GameController.playRound(selectedCell);
    updateScreen();
  }
  function resetGame() {
    GameController.resetGame();
    updateScreen();
  }

  // ** EVENT HANDLERS **

  boardDiv.addEventListener("click", clickHandlerBoard);
  resetBtn.addEventListener("click", resetGame);

  updateScreen();

  return {
    updateScreen
  }
})();

//run test game

// GameController.playRound({row:0, column:2}) // Player 1 first turn
// GameController.playRound({row:1, column:0}) // Player 2 first turn
// GameController.playRound({row:1, column:1}) // Player 1 2nd turn
// GameController.playRound({row:1, column:2}) // Player 2 2nd turn
// GameController.playRound({row:2, column:0}) // Player 1 first turn - PLAYER 1 SHOULD WIN!


// //test game should be a draw
// game.playRound({row:0, column:0}) // Player 1 first turn
// game.playRound({row:0, column:1}) // Player 2 first turn
// game.playRound({row:1, column:0}); // 1
// game.playRound({row:1, column:1}); // 2
// game.playRound({row:2, column:2}); // 1
// game.playRound({row:2, column:0}); // 2
// game.playRound({row:2, column:1}); // 1
// game.playRound({row:1, column:2}); // 2
// game.playRound({row:0, column:2}); // 1