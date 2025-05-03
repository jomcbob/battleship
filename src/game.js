import { player } from "./player"

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

const BoardState = Object.freeze({
  human: 0,
  computer: 1,
})

class game {
  constructor(refresh) {
    this.gameState = GameState.computerPlacesShips
    this.hplayer = new player()
    this.cplayer = new player()
    this.refresh = refresh
  }

  cellClicked(num, boardstate) {
    const currentPlayer =
      boardstate === BoardState.human ? this.hplayer : this.cplayer

    switch (this.gameState) {
      case GameState.humanPlacesCarrier:
        if (currentPlayer.placeShip(num, 5, "H", currentPlayer)) {
          console.log(true)
          this.gameState = GameState.humanPlacesBattleship
        }
        break
      case GameState.humanPlacesBattleship:
        if (currentPlayer.placeShip(num, 4, "H")) {
          this.gameState = GameState.humanPlacesCruiser
        }
        break
      case GameState.humanPlacesCruiser:
        if (currentPlayer.placeShip(num, 3, "H")) {
          this.gameState = GameState.humanPlacesSubmarine
        }
        break
      case GameState.humanPlacesSubmarine:
        if (currentPlayer.placeShip(num, 3, "H")) {
          this.gameState = GameState.humanPlacesPatrolBoat
        }
        break
      case GameState.humanPlacesPatrolBoat:
        if (currentPlayer.placeShip(num, 2, "H")) {
          this.gameState = GameState.computerTurn
        }
        break
      case GameState.computerTurn:
        break
      case GameState.humanTurn:
        break
    }
  }

  computerPlacesShips() {
    let currentPlayer = this.cplayer

    for (let i = 5; i > 1; i--) {
      if (i === 3) {
        for (let j = 0; j < 2; j++) {
          let num = Math.floor(Math.random() * 100)
          while (!currentPlayer.placeShip(num, i, "C"))
            num = Math.floor(Math.random() * 100)
        }
      } else {
        let num = Math.floor(Math.random() * 100)
        while (!currentPlayer.placeShip(num, i, "C"))
          num = Math.floor(Math.random() * 100)
      }
    }

    console.log("bot", currentPlayer.board)
    currentPlayer = this.hplayer
    console.log("human", currentPlayer.board)

    this.gameState = GameState.humanPlacesCarrier
  }
}

export { BoardState, game }
