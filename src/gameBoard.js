import { player } from "./player"
import { Ship } from "./ship"

// New Game Starts
// 1. Computer places all ships
// 2. Human Places Carrier
// 3. Human Places Battleship
// 4. Human Places Cruiser
// 5. Human Places Submarine
// 6. Human Places Patrol Boat
// 7. Start Game Loop
//      7.1 Computer makes random guess
//      7.2 Check if hit
//      7.3 Record results on cell
//      7.4 Display results to user
//      7.5 Human Clicks on cell
//      7.6 Check if hit
//      7.7 Record results on cell
//      7.8 Display results to user

const AttackState = Object.freeze({
  hasNotBeenAttacked: 0,
  miss: 1,
  hit: 2,
})

class gameBoard {
  constructor() {
    this.cords = this.makeBoard()
    this.totalShipLength = 0
  }

  makeBoard() {
    let cord = []
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        // [x, y, hasShip (bool), attackState (enum)]
        cord.push([x, y, false, AttackState.hasNotBeenAttacked])
      }
    }
    return cord
  }

  hasReceivedAnAttack(square) {
    if (this.cords[square][3] === AttackState.hasNotBeenAttacked) {
      if (this.cords[square][2] === false) {
        this.cords[square][3] = AttackState.miss
        console.log("miss")
      } else if (this.cords[square][2] === true) {
        this.cords[square][3] = AttackState.hit
        console.log("hit")
      }
      return false
    } else {
      console.log("hasBeenAttacked")
      return true
    }
  }

  colorCell(num, board) {
    const cell = document.querySelector(`.${board}Board${num}`)
    if (cell) {
      cell.style.backgroundColor = "red"
    } else {
      console.warn("Cell not found:", cell)
    }
  }

  placeShip(square, length, player) {
    if (!this.checkIfValidCoords(square, length)) {
      console.log("Invalid placement")
      return false
    }

    let boat = new Ship(length)

    for (let i = square; i < square + boat.length; i++) {
      this.cords[i][2] = true
      this.colorCell(i, player)
    }
    this.totalShipLength += length
    console.log("returning true")
    return true
  }

  checkIfValidCoords(square, length) {
    const rowStart = Math.floor(square / 10) * 10
    const rowEnd = rowStart + 9
    if (square + length - 1 > rowEnd) {
      return false
    }

    for (let i = square; i < square + length; i++) {
      if (this.cords[i] && this.cords[i][2]) {
        return false
      }
    }

    return true
  }

  hasLost() {
    let num = 0
    this.cords.forEach((cord) => {
      if (cord[2] === true && cord[3] === AttackState.hit) {
        num++
      }
    })

    if (num >= this.totalShipLength) {
      return true
    } else return false
  }

  hasShip(num) {
    if (this.cords[num][2] === true) {
      return true
    }

    return false
  }
}

export { gameBoard }
