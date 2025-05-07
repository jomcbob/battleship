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
          captainPrompts.typing === false &&
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
          captainPrompts.typing === false &&
          this.player == this.game.currentPlayer &&
          this.placeShip(num, 4, xAxis)
        ) {
          this.game.setGameState(GameState.humanPlacesCruiser)
          typeWriter(captainPrompts.placeCruiser(), captainPrompts.LogInfo, 0)
        }
        break
      case GameState.humanPlacesCruiser:
        if (
          captainPrompts.typing === false &&
          this.player == this.game.currentPlayer &&
          this.placeShip(num, 3, xAxis)
        ) {
          this.game.setGameState(GameState.humanPlacesSubmarine)
          typeWriter(captainPrompts.placeSubmarine(), captainPrompts.LogInfo, 0)
        }
        break
      case GameState.humanPlacesSubmarine:
        if (
          captainPrompts.typing === false &&
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
          captainPrompts.typing === false &&
          this.player == this.game.currentPlayer &&
          this.placeShip(num, 2, xAxis)
        ) {
          this.game.setGameState(GameState.computerTurn)
        }
        break
      case GameState.humanTurn:
        if (
          this.player == this.game.currentPlayer &&
          captainPrompts.typing === false &&
          this.cells[num].attackState === AttackState.hasNotBeenAttacked
        ) {
          this.game.humanMoves(num)
          refresh()
          this.game.setGameState(GameState.computerTurn)
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

    refresh()
  }

  cellHovered(number, isHovered) {
    switch (this.game.gameState) {
      case GameState.humanPlacesCarrier:
        if (
          this.player === this.game.currentPlayer &&
          this.checkIfValidCoords(number, 5, xAxis)
        ) {
          this.markAsHovered(number, xAxis, 5, isHovered)
        }
        break
      case GameState.humanPlacesBattleship:
        if (
          this.player == this.game.currentPlayer &&
          this.checkIfValidCoords(number, 4, xAxis)
        ) {
          this.markAsHovered(number, xAxis, 4, isHovered)
        }
        break
      case GameState.humanPlacesCruiser:
        if (
          this.player == this.game.currentPlayer &&
          this.checkIfValidCoords(number, 3, xAxis)
        ) {
          this.markAsHovered(number, xAxis, 3, isHovered)
        }
        break
      case GameState.humanPlacesSubmarine:
        if (
          this.player == this.game.currentPlayer &&
          this.checkIfValidCoords(number, 3, xAxis)
        ) {
          this.markAsHovered(number, xAxis, 3, isHovered)
        }
        break
      case GameState.humanPlacesPatrolBoat:
        if (
          this.player == this.game.currentPlayer &&
          this.checkIfValidCoords(number, 2, xAxis)
        ) {
          this.markAsHovered(number, xAxis, 2, isHovered)
        }
        break
      case GameState.humanTurn:
        if (this.player == this.game.currentPlayer) {
          this.markAsHovered(number, xAxis, 1, isHovered)
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
      return false
    }

    let boat = new Ship(length)

    if (isHora) {
      for (let i = square; i < square + boat.length; i++) {
        this.cells[i].hasShip = true
        this.cells[i].ship = boat
        this.cells[i].kindOfShip = this.game.giveBoatKind(boat.length)
      }
    } else {
      for (let i = 0; i < boat.length; i++) {
        const index = square + i * 10
        this.cells[index].hasShip = true
        this.cells[index].ship = boat
        this.cells[index].kindOfShip = this.game.giveBoatKind(boat.length)
      }
    }

    this.totalShipLength += length
    return true
  }

  hasReceivedAnAttack(index, attacker) {
    const isWithinBounds = (i) => i >= 0 && i <= 99
    if (this.cells[index].attackState !== AttackState.hasNotBeenAttacked) {
      return true
    }

    if (!this.cells[index].hasShip) {
      this.cells[index].attackState = AttackState.miss
    } else {
      this.cells[index].attackState = AttackState.hit
      const ship = this.cells[index].ship

      if (ship) {
        ship.gotHit()

        const isHorizontal = this.isShipLikelyHorizontal(index)

        if (isHorizontal === "none") {
          console.log("no ships in bounds")
        } else if (isHorizontal) {
          if (isWithinBounds(index - 1) && this.isSameRow(index, index - 1)) {
            this.player.hits.push({
              toFind: index - 1,
              origin: index,
              direction: "horizontal",
            })
          }
          if (isWithinBounds(index + 1) && this.isSameRow(index, index + 1)) {
            this.player.hits.push({
              toFind: index + 1,
              origin: index,
              direction: "horizontal",
            })
          }
        } else if (isWithinBounds(index - 10) || isWithinBounds(index + 10)) {
          if (isWithinBounds(index - 10))
            this.player.hits.push({
              toFind: index - 10,
              origin: index,
              direction: "vertical",
            })
          if (isWithinBounds(index + 10))
            this.player.hits.push({
              toFind: index + 10,
              origin: index,
              direction: "vertical",
            })
        }

        if (ship.checkIfSunk()) {
          this.player.hits = []
          console.log(this.player.hits)
          this.sunk++
          this.game.checkStateAndGiveIsSunk(ship.length, false, attacker)

          if (this.sunk === 5) {
            setTimeout(() => {
              this.game.checkStateAndGiveIsSunk(ship.length, true, attacker)
            }, 2000)
            return this.game.setGameState(
              (this.game.gameState = GameState.gameEnd),
            )
          }
        }
      }
    }

    return false
  }

  isShipLikelyHorizontal(index) {
    const isWithinBounds = (i) => i >= 0 && i <= 99
    const notAttacked = (i) =>
      this.cells[i].attackState === AttackState.hasNotBeenAttacked

    const left = index - 1
    const right = index + 1

    if (
      isWithinBounds(left) &&
      this.isSameRow(index, left) &&
      notAttacked(left) &&
      this.hasShip(left)
    ) {
      return true
    }

    if (
      isWithinBounds(right) &&
      this.isSameRow(index, right) &&
      notAttacked(right) &&
      this.hasShip(right)
    ) {
      return true
    }

    const up = index - 10
    const down = index + 10

    if (isWithinBounds(up) && notAttacked(up) && this.hasShip(up)) {
      return false
    }

    if (isWithinBounds(down) && notAttacked(down) && this.hasShip(down)) {
      return false
    }

    return "none"
  }

  isSameRow(a, b) {
    return Math.floor(a / 10) === Math.floor(b / 10)
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
