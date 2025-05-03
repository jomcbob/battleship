import { game, BoardState } from "./game"
import "./styles.css"

let HBoard = document.getElementById("HBoard")
let CBoard = document.getElementById("CBoard")

const makeBoard = (game, boardElement) => {
  const boardState = boardElement == HBoard ? game.human : game.computer

  for (let i = 0; i < 100; i++) {
    let div = document.createElement("div")
    div.classList.add(`cell`, `${boardElement.id}${i}`)
    div.addEventListener("click", () => {
      game.cellClicked(i, boardState)
    })

    boardElement.appendChild(div)
  }
}

const refresh = () => {
  const newgame = new game(refresh)

  makeBoard(newgame, HBoard)
  makeBoard(newgame, CBoard)

  newgame.computerPlacesShips()
}

refresh()
