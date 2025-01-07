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
    // TODO - Make sure given cell is not taken

    // put the current player's token in the given cell
    board[cell.row][cell.column].addToken(player);
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
}

game = GameBoard();