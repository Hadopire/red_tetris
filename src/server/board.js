const Piece = require('./piece')

const copyArray = (arr) => (
  JSON.parse(JSON.stringify(arr))
)

const placePiece = (x0, y0, grid, piece) => {
  let newGrid = copyArray(grid)

  for (let x = 0; x < piece.length; x++) {
    for (let y = 0; y < piece[0].length; y++) {
      if ((x + x0 >= newGrid.length || x + x0 < 0 || y + y0 < 0 || y + y0 >= newGrid[0].length) ||
        (piece[x][y] !== 0 && newGrid[x + x0][y + y0] !== 0)) {
        console.log('returning null');
        return null;
      }
      else if (piece[x][y] !== 0) {
        newGrid[x0 + x][y0 + y] = piece[x][y];
      }
    }
  }
  return newGrid;
}

const deleteLine = (grid, yline) => {
  for (let y = yline; y > 1; y--) {
    for (let x = 0; x < grid.length; x++) {
      grid[x][y] = grid[x][y-1]
    }
  }
  return grid
}

const checkIfFull = (grid) => {
  let fullline = true;
  for (let y = 0; y < grid[0].length; y++) {
    for (let x = 0; x < grid.length; x++) {
      if (grid[x][y] === 0)
        fullline = false
    }
    if (fullline === true)
      grid = deleteLine(grid, y);
    else
      fullline = true;
  }
  return grid
}

const emptyGrid = (x, y) => (
  new Array(x).fill(new Array(y).fill(0))
)

// Créer la petite grille de 4x4 remplie par la next piece centrée
const displayNextPiece = (nextPiece) => {
  let nextPieceGrid = copyArray(emptyGrid(4, 4))
  let vert_offset = parseInt((5 - nextPiece.length) / 2)
  let hor_offset = parseInt((4 - nextPiece[0].length) / 2)
  for (let y = vert_offset, yp = 0; yp < nextPiece.length; y++, yp++) {
    for (let x = hor_offset, xp = 0; xp < nextPiece[0].length; x++, xp++) {
      nextPieceGrid[y][x] = nextPiece[yp][xp];
    }
  }
  return nextPieceGrid;
}

const Board = function() {
  this.grid = emptyGrid(10, 20)
  this.piece = new Piece(this.grid.length / 2, 0)
  this.nextPiece = new Piece(this.grid.length / 2, 0)
  this.nextPieceGrid = displayNextPiece(this.nextPiece.piece)
  this.displayGrid = placePiece(
    this.piece.x,
    this.piece.y,
    this.grid,
    this.piece.piece
  );
  if (this.displayGrid !== null) {
    console.log("first piece placed successfully");
  }
  this.update = null

  this.rotatePiece = () => {
    this.piece.rotate()
    const newGrid = placePiece(
      this.piece.x,
      this.piece.y,
      this.grid,
      this.piece.piece
    )
    if (newGrid !== null) {
      this.displayGrid = newGrid
    }
    else {
      this.piece.revRotate()
    }
  }

  this.move = (x, y) => {

    const newdisplayGrid = placePiece(
      this.piece.x + x,
      this.piece.y + y,
      this.grid,
      this.piece.piece
    )
    if (newdisplayGrid !== null) {
      console.log("piece placed successfully")
      this.displayGrid = newdisplayGrid
      this.piece.y += y
      this.piece.x += x
    }
    else if (y > 0) {
      console.log('cant go down anymore')
      this.piece = this.nextPiece
      this.nextPiece = new Piece(this.grid.length / 2, 0)
      this.nextPieceGrid = displayNextPiece(this.nextPiece.piece)
      this.grid = copyArray(this.displayGrid)
      this.displayGrid = placePiece(
        this.piece.x,
        this.piece.y,
        this.grid,
        this.piece.piece
      )
      if (this.displayGrid === null) {
        this.grid = emptyGrid(10, 20)
        this.displayGridgrid = emptyGrid(10, 20)
        this.piece = this.nextPiece
        this.nextPiece = new Piece(this.grid.length / 2, 0)
        this.nextPieceGrid = displayNextPiece(this.nextPiece.piece)
      }
    }
    this.grid = checkIfFull(this.grid)
  }

}

module.exports = Board;
