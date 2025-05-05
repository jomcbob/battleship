import { player } from "./player"
import { AttackState } from "./gameBoard"
import { captainPrompts, typeWriter } from "../presentation"

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
    this.hplayer = new player(this)
    this.cplayer = new player(this)
    this.currentPlayer = this.cplayer
    this.refresh = refresh
  }

  start() {
    this.computerPlacesShips()
    typeWriter(captainPrompts.placeCarrier(), captainPrompts.LogInfo, 0)
  }

  setGameState(gameState) {
    this.gameState = gameState

    if (gameState === GameState.computerTurn) {
      this.computerMoves()
      this.currentPlayer = this.cplayer
    } else {
      this.currentPlayer = this.hplayer
    }

    this.refresh()
  }

  humanMoves(num) {
    this.cplayer.receiveAttack(num)
    this.setGameState(GameState.computerTurn)
  }

  computerMoves() {
    let num = Math.floor(Math.random() * 100)

    while (
      this.hplayer.board.cells[num].attackState !==
      AttackState.hasNotBeenAttacked
    ) {
      num = Math.floor(Math.random() * 100)
    }

    this.hplayer.receiveAttack(num)
    this.setGameState(GameState.humanTurn)
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

    console.log("bot", currentPlayer.board)
    currentPlayer = this.hplayer
    console.log("human", currentPlayer.board)

    this.setGameState(GameState.humanPlacesCarrier)
  }
}

export { game, GameState }
