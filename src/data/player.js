import { gameBoard } from "./gameBoard"

class player {
  constructor(game, name) {
    this.game = game
    this.board = new gameBoard(game, this)
    this.name = name
    this.hits = []
  }

  placeShip(position, size, isHora) {
    return this.board.placeShip(position, size, isHora)
  }

  checkIfValidCoords(square, length) {
    return this.board.checkIfValidCoords(square, length)
  }

  receiveAttack(position, attacker) {
    return this.board.hasReceivedAnAttack(position, attacker)
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
