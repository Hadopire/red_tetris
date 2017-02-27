var Board = require('./board')

const RIGHT = 37
const LEFT = 39
const UP = 38
const DOWN = 40
const SPACE = 32

var Player = function(socket, name) {
  this.socket = socket
  this.name = name
  this.board = null
  this.room = null
  this.inGame = false

  this.socket.on('game', (data) => {
    if (!this.inGame) {
      return
    }

    switch (data.type) {
      case 'KEY_PRESS':
        this.board.update = data.payload;
        break ;
      default:
        console.log(`Unexpected action ${action.type}`)
        break ;
    }
  })

  this.updateScreen = (enemyShadow) => {
    let shadow = this.board.shadow
    for (let i = 0; i < this.room.players.length; i++) {
      if (this.room.players[i].socket != this.socket) {
        shadow = this.room.players[i].board.shadow;
      }
    }

    this.socket.emit('game', {
      type: 'BOARD_UPDATE',
      payload: {
        displayGrid: this.board.displayGrid,
        nextPiece: this.board.nextPieceGrid,
        shadow: shadow,
      },
    })
  }

  this.startGame = () => {
    if (this.inGame === false) {
      this.board = new Board()
      this.updateScreen()
      this.inGame = true
      this.loop()
      return true
    }
    return false
  }

  this.endGame = () => {
    if (this.inGame) {
      clearInterval(this.loopID)
      this.board = null
    }
    this.inGame = false
  }

  this.loop = () => {

    this.dropSpeed = 500
    let dropDownCallback = () => {
      setTimeout(() => {
        if (this.inGame) {
          this.board.move(0, 1);
          dropDownCallback()
        }
      }, this.dropSpeed)
    }
    dropDownCallback()

    let previousBoard = this.board.displayGrid
    this.loopID = setInterval(() => {
      this.loopCount ++

      if (this.board.update !== null) {

        const update = this.board.update
        this.board.update = null

        switch (update) {
          case LEFT:
            this.board.move(1, 0)
            break
          case RIGHT:
            this.board.move(-1, 0)
            break
          case DOWN:
            this.board.move(0, 1)
            break
          case UP:
          case SPACE:
            this.board.rotatePiece()
            break
        }
      }

      //console.log(this.board.displayGrid)
      if (this.board.displayGrid != previousBoard) {
        this.updateScreen()
      }
      previousBoard = this.board.displayGrid
    }, 16) // 60 tickrate (should be enough for tetris kek)
  }

  this.toRawData = () => ({
    name: this.name,
  })

}

module.exports = Player;
