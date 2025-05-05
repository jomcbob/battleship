import { Ship } from "./ship"
import { GameState } from "./game"
import { captainPrompts, typeWriter, xAxis, refresh } from "../presentation"

const AttackState = Object.freeze({
  hasNotBeenAttacked: 0,
  miss: 1,
  hit: 2,
})

class gameBoard {
  constructor(game, player) {
    this.cells = this.makeBoard()
    this.totalShipLength = 0
    this.game = game
    this.player = player
    this.sunk = 0
  }

  makeBoard() {
    let cells = []
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        cells.push({
          x,
          y,
          hasShip: false,
          attackState: AttackState.hasNotBeenAttacked,
          kindOfShip: "none",
          isHovered: false,
        })
      }
    }
    return cells
  }

  cellClicked(num) {
    switch (this.game.gameState) {
      case GameState.humanPlacesCarrier:
        if (
          this.player == this.game.currentPlayer &&
          this.placeShip(num, 5, xAxis)
        ) {
          this.game.setGameState(GameState.humanPlacesBattleship)
          typeWriter(
            captainPrompts.placeBattleShip(),
            captainPrompts.LogInfo,
            0,
          )
        }
        break
      case GameState.humanPlacesBattleship:
        if (
          this.player == this.game.currentPlayer &&
          this.placeShip(num, 4, xAxis)
        ) {
          this.game.setGameState(GameState.humanPlacesCruiser)
          typeWriter(captainPrompts.placeCruiser(), captainPrompts.LogInfo, 0)
        }
        break
      case GameState.humanPlacesCruiser:
        if (
          this.player == this.game.currentPlayer &&
          this.placeShip(num, 3, xAxis)
        ) {
          this.game.setGameState(GameState.humanPlacesSubmarine)
          typeWriter(captainPrompts.placeSubmarine(), captainPrompts.LogInfo, 0)
        }
        break
      case GameState.humanPlacesSubmarine:
        if (
          this.player == this.game.currentPlayer &&
          this.placeShip(num, 3, xAxis)
        ) {
          this.game.setGameState(GameState.humanPlacesPatrolBoat)
          typeWriter(
            captainPrompts.placePatrolBoat(),
            captainPrompts.LogInfo,
            0,
          )
        }
        break
      case GameState.humanPlacesPatrolBoat:
        if (
          this.player == this.game.currentPlayer &&
          this.placeShip(num, 2, xAxis)
        ) {
          this.game.setGameState(GameState.computerTurn)
        }
        break
      case GameState.humanTurn:
        if (this.player == this.game.currentPlayer) {
          this.game.humanMoves(num)
        }
        break
    }
  }

  markAsHovered(square, xAxis, shipLength, isHovered) {
    if (xAxis) {
      for (let i = square; i < square + shipLength; i++) {
        this.cells[i].isHovered = isHovered
      }
    } else {
      for (let i = 0; i < shipLength; i++) {
        const index = square + i * 10
        this.cells[index].isHovered = isHovered
      }
    }
  }

  cellHovered(number, isHovered) {
    switch (this.game.gameState) {
      case GameState.humanPlacesCarrier:
        if (
          this.player === this.game.currentPlayer &&
          this.checkIfValidCoords(number, 5, xAxis)
        ) {
          this.markAsHovered(number, xAxis, 5, isHovered)
          refresh()
        }
        break
      case GameState.humanPlacesBattleship:
        if (
          this.player == this.game.currentPlayer &&
          this.checkIfValidCoords(number, 4, xAxis)
        ) {
          this.markAsHovered(number, xAxis, 4, isHovered)
          refresh()
        }
        break
      case GameState.humanPlacesCruiser:
        if (
          this.player == this.game.currentPlayer &&
          this.checkIfValidCoords(number, 3, xAxis)
        ) {
          this.markAsHovered(number, xAxis, 3, isHovered)
          refresh()
        }
        break
      case GameState.humanPlacesSubmarine:
        if (
          this.player == this.game.currentPlayer &&
          this.checkIfValidCoords(number, 3, xAxis)
        ) {
          this.markAsHovered(number, xAxis, 3, isHovered)
          refresh()
        }
        break
      case GameState.humanPlacesPatrolBoat:
        if (
          this.player == this.game.currentPlayer &&
          this.checkIfValidCoords(number, 2, xAxis)
        ) {
          this.markAsHovered(number, xAxis, 2, isHovered)
          refresh()
        }
        break
      case GameState.humanTurn:
        if (this.player == this.game.currentPlayer) {
          this.markAsHovered(number, xAxis, 1, isHovered)
          refresh()
        }
        break
    }
  }

  checkIfValidCoords(square, length, isHora) {
    if (isHora) {
      const rowStart = Math.floor(square / 10) * 10
      const rowEnd = rowStart + 9

      if (square + length - 1 > rowEnd) {
        return false
      }

      for (let i = square; i < square + length; i++) {
        if (this.cells[i] && this.cells[i].hasShip) {
          return false
        }
      }
    } else if (!isHora) {
      const endSquare = square + (length - 1) * 10
      if (endSquare > 99) {
        return false
      }

      for (let i = 0; i < length; i++) {
        const index = square + i * 10
        if (this.cells[index] && this.cells[index].hasShip) {
          return false
        }
      }
    }

    return true
  }

  placeShip(square, length, isHora) {
    if (!this.checkIfValidCoords(square, length, isHora)) {
      console.log("Invalid placement")
      return false
    }

    let boat = new Ship(length)

    if (isHora) {
      for (let i = square; i < square + boat.length; i++) {
        this.cells[i].hasShip = true
        this.cells[i].ship = boat
        this.cells[i].kindOfShip = this.giveBoatKind(boat.length)
      }
    } else {
      for (let i = 0; i < boat.length; i++) {
        const index = square + i * 10
        this.cells[index].hasShip = true
        this.cells[index].ship = boat
        this.cells[index].kindOfShip = this.giveBoatKind(boat.length)
      }
    }

    this.totalShipLength += length
    return true
  }

  hasReceivedAnAttack(index) {
    if (this.cells[index].attackState === AttackState.hasNotBeenAttacked) {
      if (!this.cells[index].hasShip) {
        this.cells[index].attackState = AttackState.miss
      } else {
        this.cells[index].attackState = AttackState.hit
        const ship = this.cells[index].ship

        if (ship) {
          ship.gotHit()

          if (ship.checkIfSunk()) {
            this.sunk++
            if (this.sunk === 5) {
              setTimeout(function () {
                alert("you win!")
              }, 1000)
            }
          }
        }
      }

      return false
    } else {
      console.log("hasBeenAttacked")
      return true
    }
  }

  giveBoatKind(length) {
    if (length === 5) return "carrier"
    if (length === 4) return "battleship"
    if (length === 3) return "cruiser or submarine"
    if (length === 2) return "patrol boat"
  }

  hasLost() {
    let index = 0
    this.cells.forEach((cell) => {
      if (cell.hasShip === true && cell.attackState === AttackState.hit) {
        index++
      }
    })

    if (index >= this.totalShipLength) {
      return true
    } else return false
  }

  hasShip(index) {
    if (this.cells[index].hasShip === true) {
      return true
    }

    return false
  }
}

export { AttackState, gameBoard }
