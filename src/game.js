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

    this.computerPlacesShips()
  }

  cellClicked(num, boardstate) {
    switch (this.gameState) {
      case GameState.humanPlacesCarrier:
        break
      case GameState.humanPlacesBattleship:
        break
      case GameState.humanPlacesCruiser:
        break
      case GameState.humanPlacesSubmarine:
        break
      case GameState.humanPlacesPatrolBoat:
        break
      case GameState.computerTurn:
        break
      case GameState.humanTurn:
        break
    }
  }

  computerPlacesShips() {
    this.refresh()
    this.gameState = GameState.humanPlacesCarrier
  }
}

export { BoardState, game }
