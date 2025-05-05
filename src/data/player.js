import { gameBoard } from "./gameBoard"

class player {
  constructor(game) {
    this.game = game
    this.board = new gameBoard(game, this)
  }

  placeShip(position, size, isHora) {
    return this.board.placeShip(position, size, isHora)
  }

  checkIfValidCoords(square, length) {
    return this.board.checkIfValidCoords(square, length)
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
