import { gameBoard } from "./gameBoard"

class player {
  constructor() {
    this.board = new gameBoard()
  }

  placeShip(position, size, board) {
    if (this.board.placeShip(position, size, board)) {
      return true
    }
    return false
  }

  colorCell(num, board) {
    this.board.colorCell(num, board)
  }

  checkIfValidCoords(square, length) {
    if (this.board.checkIfValidCoords(square, length)) {
      return true
    }
    return false
  }

  receiveAttack(position) {
    return this.board.hasReceivedAnAttack(position)
  }

  hasLost() {
    return this.board.hasLost()
  }

  hasShip(num) {
    return this.board.hasShip(num)
  }

  getBoard() {
    return this.board
  }
}

export { player }
