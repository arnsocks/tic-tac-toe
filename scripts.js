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
    
    

    // TODO - Logic to determine if there is an endstate
    // if (checkForWinner(board.getBoard())) return;
    switchPlayerTurn();
    printNewRound();
  };

  // const checkForWinner = (board) => {
  //   //Check each of the rows
  //   for (let i = 0; i < board.length; i++) {
  //     const firstToken = board[i][0].getValue();
  //     const matchesFirstToken = (cell) => cell.getValue() === firstToken;
  //     if (!firstToken) return;
  //     console.log({firstToken});
  //     if (board[i].every( (cell) => matchesFirstToken(cell))) {
  //       console.log(`${getActivePlayer().name} wins!`)
  //       return true;
  //     }
  //   };

  //   //Check each of the columns
  //   //for (let i = 0; i < board.length
  // };
  
  printNewRound();


  return {
    getActivePlayer,
    playRound,
    getBoard: board.getBoard
  };
}

game = GameController();


//run test game

game.playRound({row:0, column:0}) // Player 1 first turn
game.playRound({row:1, column:0}) // Player 2 first turn
game.playRound({row:0, column:1}) // Player 1 2nd turn
game.playRound({row:1, column:1}) // Player 2 2nd turn
game.playRound({row:0, column:2}) // Player 1 first turn - PLAYER 1 SHOULD WIN!