const GameBoard = function () {
  const rows = 3;
  const columns = 3;
  let board = [];

  for(i = 0; i < rows; i++) {
    board[i] = [];
    for(j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  const placeToken = (cell, player) => {
    if (board[cell.row][cell.column].getValue() !== 0) return; // Cannot play in a non-empty full cell.

    board[cell.row][cell.column].addToken(player.token);
  };

  const printBoard = () => {
    const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
    console.log(boardWithCellValues);
  };

  return {
    getBoard,
    placeToken,
    printBoard
  };
};

function Cell() {
  let value = 0;
  const addToken = (player) => {
    value = player;
  }

  const getValue = () => value;

  return {
    addToken,
    getValue
  };
};

const GameController = function (
  playerOneName = "Player One",
  playerTwoName = "Player Two"
) {
  const gameBoard = GameBoard();
  const players = [
    {
      name: playerOneName,
      token: "X"
    },
    {
      name: playerTwoName,
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
    gameBoard.printBoard();
  }

  const playRound = (cell) => {
    let gameResult = '';
    // Don't accept a non-empty cell
    // if (gameBoard.getBoard()[cell.row][cell.column].getValue() !== 0) {
    //   console.log("You cannot play in a non-empty cell");
    //   printNewRound();
    //   return;
    // } 

    gameBoard.placeToken(cell, getActivePlayer());
    printNewRound();
    
    gameResult = checkResult(gameBoard.getBoard());
    if (gameResult === 'win') {
      return `${activePlayer.name} wins!`
    } else if (gameResult === 'draw') {
      return `It's a draw`;
    };

    switchPlayerTurn();
  };

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
  
  printNewRound();


  return {
    getActivePlayer,
    playRound,
    getBoard: gameBoard.getBoard
  };
}

game = GameController();


//run test game

// game.playRound({row:0, column:2}) // Player 1 first turn
// game.playRound({row:1, column:0}) // Player 2 first turn
// game.playRound({row:1, column:1}) // Player 1 2nd turn
// game.playRound({row:1, column:2}) // Player 2 2nd turn
// game.playRound({row:2, column:0}) // Player 1 first turn - PLAYER 1 SHOULD WIN!


//test game should be a draw
game.playRound({row:0, column:0}) // Player 1 first turn
game.playRound({row:0, column:1}) // Player 2 first turn
game.playRound({row:1, column:0}); // 1
game.playRound({row:1, column:1}); // 2
game.playRound({row:2, column:2}); // 1
game.playRound({row:2, column:0}); // 2
game.playRound({row:2, column:1}); // 1
game.playRound({row:1, column:2}); // 2
game.playRound({row:0, column:2}); // 1