import { player } from "./player"
import { AttackState } from "./gameBoard"
import {
  captainPrompts,
  typeWriter,
  loadGame,
  difficulty,
  DifficultyState,
} from "../presentation"

const GameState = Object.freeze({
  computerPlacesShips: 0,
  humanPlacesCarrier: 1,
  humanPlacesBattleship: 2,
  humanPlacesCruiser: 3,
  humanPlacesSubmarine: 4,
  humanPlacesPatrolBoat: 5,
  computerTurn: 6,
  humanTurn: 7,
  gameEnd: 8,
})

class game {
  constructor(refresh) {
    this.gameState = GameState.computerPlacesShips
    this.hplayer = new player(this, "human")
    this.cplayer = new player(this, "bot")
    this.currentPlayer = this.cplayer
    this.refresh = refresh
  }

  start() {
    this.computerPlacesShips()
    typeWriter(captainPrompts.placeCarrier(), captainPrompts.LogInfo, 0)
  }

  setGameState(gameState) {
    this.gameState = gameState

    if (gameState === GameState.gameEnd) {
      return
    }

    if (gameState === GameState.computerTurn) {
      this.computerMoves()
      this.currentPlayer = this.cplayer
    } else {
      this.currentPlayer = this.hplayer
    }

    this.refresh()
  }

  humanMoves(num) {
    return this.cplayer.receiveAttack(num, this.hplayer)
  }

  computerMovesNormal() {
    let num = Math.floor(Math.random() * 100)

    if (this.hplayer.hits.length > 0) {
      const currentHit = this.hplayer.hits.shift()
      num = currentHit.toFind

      if (this.hplayer.board.hasShip(num)) {
        const hasHorizontal =
          (num + 1 <= 99 &&
            this.hplayer.board.hasShip(num + 1) &&
            this.hplayer.board.isSameRow(num, num + 1)) ||
          (num - 1 >= 0 &&
            this.hplayer.board.hasShip(num - 1) &&
            this.hplayer.board.isSameRow(num, num - 1))

        const hasVertical =
          (num + 10 <= 99 && this.hplayer.board.hasShip(num + 10)) ||
          (num - 10 >= 0 && this.hplayer.board.hasShip(num - 10))

        if (hasHorizontal) {
          for (let i = this.hplayer.hits.length - 1; i >= 0; i--) {
            if (this.hplayer.hits[i].isHoara === false) {
              this.hplayer.hits.splice(i, 1)
            }
          }
        }

        if (hasVertical) {
          for (let i = this.hplayer.hits.length - 1; i >= 0; i--) {
            if (this.hplayer.hits[i].isHoara === true) {
              this.hplayer.hits.splice(i, 1)
            }
          }
        }
      }
    }

    while (
      this.hplayer.board.cells[num].attackState !==
      AttackState.hasNotBeenAttacked
    ) {
      if (this.hplayer.hits.length > 0) {
        const nextHit = this.hplayer.hits.shift()
        num = nextHit.toFind
      } else {
        num = Math.floor(Math.random() * 100)
      }
    }

    this.hplayer.receiveAttack(num, this.cplayer)
    typeWriter(captainPrompts.attackTheEnemy(), captainPrompts.LogInfo, 0)
    this.setGameState(GameState.humanTurn)
  }

  computerMovesEasy() {
    let num = Math.floor(Math.random() * 100)

    while (
      this.hplayer.board.cells[num].attackState !==
      AttackState.hasNotBeenAttacked
    ) {
      num = Math.floor(Math.random() * 100)
    }

    this.hplayer.receiveAttack(num, this.cplayer)
    typeWriter(captainPrompts.attackTheEnemy(), captainPrompts.LogInfo, 0)
    this.setGameState(GameState.humanTurn)
  }

  computerMovesImpossible() {
    let board = this.hplayer.board
    for (let i = 0; i < board.cells.length; i++) {
      const element = board.cells[i]
      if (
        element.hasShip &&
        element.attackState === AttackState.hasNotBeenAttacked
      ) {
        this.hplayer.receiveAttack(i, this.cplayer)
        typeWriter(captainPrompts.attackTheEnemy(), captainPrompts.LogInfo, 0)
        this.setGameState(GameState.humanTurn)
        break
      }
    }
  }

  computerMoves() {
    if (difficulty === DifficultyState.normal) {
      this.computerMovesNormal()
    } else if (difficulty === DifficultyState.easy) {
      this.computerMovesEasy()
    } else {
      this.computerMovesImpossible()
    }
  }

  computerPlacesShips() {
    let currentPlayer = this.cplayer

    for (let i = 5; i > 1; i--) {
      if (i === 3) {
        for (let j = 0; j < 2; j++) {
          let num = Math.floor(Math.random() * 100)
          let isHora = Math.round(Math.random() * 10) > 5
          while (!currentPlayer.placeShip(num, i, isHora))
            num = Math.floor(Math.random() * 100)
        }
      } else {
        let num = Math.floor(Math.random() * 100)
        let isHora = Math.round(Math.random() * 10) > 5
        while (!currentPlayer.placeShip(num, i, isHora))
          num = Math.floor(Math.random() * 100)
      }
    }

    currentPlayer = this.hplayer

    this.setGameState(GameState.humanPlacesCarrier)
  }

  giveBoatKind(length) {
    if (length === 5) return "carrier"
    if (length === 4) return "battleship"
    if (length === 3) return "cruiser or submarine"
    if (length === 2) return "patrol boat"
  }

  checkStateAndGiveIsSunk(length, win, attacker) {
    let fontSize = 4
    let opacity = 1
    let maxFontSize = 7
    let interval

    function growAndFade() {
      if (fontSize < maxFontSize) {
        fontSize += 0.1
        opacity -= 0.01
        sunk.style.fontSize = fontSize + "vh"
        sunk.style.opacity = opacity
      } else {
        fontSize = 4
        opacity = 1
        sunk.style.display = "none"
        clearInterval(interval)
      }
    }

    const sunk = document.querySelector("#sunk")
    sunk.style.display = "flex"

    if (win) {
      if (attacker.name === "human") {
        sunk.style.opacity = 0.8
        sunk.style.display = "flex"
        sunk.innerHTML = `You Win! <button id="newGame">New Game</button>`
        sunk.addEventListener("click", () => {
          loadGame()
          sunk.style.display = "none"
        })
      } else if (attacker.name === "bot") {
        sunk.style.opacity = 0.7
        sunk.style.display = "flex"
        sunk.innerHTML = `You lose <button id="newGame">New Game</button>`
        sunk.addEventListener("click", () => {
          loadGame()
          sunk.style.display = "none"
        })
      }
      return
    }

    if (attacker.name === "human") {
      sunk.textContent = `You sunk the computer\'s ${this.giveBoatKind(length)}!`
      interval = setInterval(growAndFade, 50)
    } else if (attacker.name === "bot") {
      sunk.textContent = `The computer sunk your ${this.giveBoatKind(length)}`
      interval = setInterval(growAndFade, 50)
    }
  }
}

export { game, GameState }
