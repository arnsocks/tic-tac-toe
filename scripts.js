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
  const board = GameBoard();
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
    board.printBoard();
  }

  const playRound = (cell) => {

    // Don't accept a non-empty cell
    if (board.getBoard()[cell.row][cell.column].getValue() !== 0) {
      console.log("You cannot play in a non-empty cell");
      printNewRound();
      return;
    } 

    board.placeToken(cell, getActivePlayer());
    
    

    // TODO - Logic to determine if there is a result
    if (checkResult(board.getBoard())) return;
    switchPlayerTurn();
    printNewRound();
  };

  function checkResult(board) {
    
    let gameResult = '';

    // const matchesFirstToken = (cell, firstToken) => cell === firstToken;
    const arrayTest = (cellArray) => {
      console.log(`Testing the array: ${cellArray}`);
      if (
        cellArray[0] &&
        // cellArray.every( (cell) => matchesFirstToken(cell, cellArray[0]))
        cellArray.every( (cell) => cell === cellArray[0])
      ) {
        return true;
      }
    }

    // Check each row for a win
    for ( let i = 0; i < board.length; i++) {
      let testArray = [];
      for (let j = 0; j < board[0].length; j++) {
        testArray.push(board[i][j].getValue());
      }
      if (arrayTest(testArray)) {
        console.log(`${activePlayer.name} won on a row`);
        return true;
      }
    }

    // Check each column for a win
    for ( let i = 0; i < board.length; i++) {
      let testArray = [];
      for (let j = 0; j < board[0].length; j++) {
        testArray.push(board[j][i].getValue());
      }
      if (arrayTest(testArray)) {
        console.log(`${activePlayer.name} won on a column`);
        return true;
      }
    }

    // Check TOP-LEFT to BOTTOM-RIGHT diagonal
    const diagonalTest1 = (function () {
      let testArray = [];
      for (let i = 0; i < board.length; i ++) {
        testArray.push(board[i][i].getValue());
      }
      if (arrayTest(testArray)) {
        console.log(`${activePlayer.name} won on a diagonal1`);
        return true;
      }
    })();
    
    // check TOP-RIGHT to BOTTOM-LEFT diagonal
    const diagonalTest2 = function () {
      let testArray = [];
      for (let i = 0; i < board.length; i ++) {
        testArray.push(board[i][board.length - (i+1)].getValue());
      }
      if (arrayTest(testArray)) {
        console.log(`${activePlayer.name} won on a reverse diagonal`);
        return true;
      }
    };
    if (diagonalTest2()) return true;
    
  };
  
  printNewRound();


  return {
    getActivePlayer,
    playRound,
    getBoard: board.getBoard
  };
}

game = GameController();


//run test game

game.playRound({row:0, column:2}) // Player 1 first turn
game.playRound({row:0, column:1}) // Player 2 first turn
game.playRound({row:1, column:1}) // Player 1 2nd turn
game.playRound({row:1, column:2}) // Player 2 2nd turn
game.playRound({row:2, column:0}) // Player 1 first turn - PLAYER 1 SHOULD WIN!