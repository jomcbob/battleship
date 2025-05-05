import { game } from "../data/game"
import { AttackState } from "../data/gameBoard"
import "../styles.css"

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
const captainPrompts = {
  userName: "Bob",
  namechange: document.querySelector(".name"),
  LogInfo: document.getElementById("LogInfo"),
  typing: false,
  placeCarrier: () => `Place your Carrier, captain ${captainPrompts.userName}!`,
  placeBattleShip: () =>
    `Place your Battleship, captain ${captainPrompts.userName}!`,
  placeCruiser: () => `Place your Cruiser, captain ${captainPrompts.userName}!`,
  placeSubmarine: () =>
    `Place your Submarine, captain ${captainPrompts.userName}!`,
  placePatrolBoat: () =>
    `Place your Patrol Boat, captain ${captainPrompts.userName}!`,
}

let xAxis = true
const text = document.querySelector(".text")
const changeAxis = document.querySelector("#axis")
changeAxis.addEventListener("click", () => {
  xAxis = !xAxis
  if (xAxis) {
    text.textContent = "⬅️ X - axis ➡️ "
  } else {
    text.textContent = "⬇️ Y - axis ⬇️ "
  }
})

captainPrompts.namechange.addEventListener("click", () => {
  if (!captainPrompts.typing) {
    const newName = prompt(
      "Please input your new name",
      captainPrompts.userName,
    )
    if (newName !== null) {
      captainPrompts.userName = newName
    }
    typeWriter(captainPrompts.placeCarrier(), captainPrompts.LogInfo, 0)
  }
})

let cursorInterval = null
const typeWriter = (string, toDisplay, index) => {
  if (index === 0) {
    toDisplay.value = ""
    if (cursorInterval) {
      clearInterval(cursorInterval)
      cursorInterval = null
    }
  }

  if (index < string.length) {
    captainPrompts.typing = true
    toDisplay.value = string.slice(0, index + 1)
    setTimeout(() => typeWriter(string, toDisplay, index + 1), 50)
  } else {
    captainPrompts.typing = false

    let showCursor = true
    cursorInterval = setInterval(() => {
      toDisplay.value = string + (showCursor ? "▎" : "")
      showCursor = !showCursor
    }, 500)
  }
}

let HBoard = document.getElementById("HBoard")
let CBoard = document.getElementById("CBoard")

const makeBoard = (board, boardElement) => {
  for (let i = 0; i < 100; i++) {
    let div = document.createElement("div")
    div.classList.add(`cell`, `${boardElement.id}${i}`)
    div.addEventListener("mouseenter", () => {
      board.cellHovered(i, true)
    })

    div.addEventListener("mouseleave", () => {
      board.cellHovered(i, false)
    })

    div.addEventListener("click", () => {
      board.cellClicked(i)
    })

    boardElement.appendChild(div)
  }
}

const refresh = () => {
  refreshBoard(newgame.cplayer.board, CBoard, Cheat)
  refreshBoard(newgame.hplayer.board, HBoard)
}

const refreshBoard = (board, boardElement, cheat) => {
  for (let i = 0; i < 100; i++) {
    const cell = board.cells[i]
    const cellElement = document.querySelector(`.${boardElement.id}${i}`)

    let bgColor = ""

    if (cell.isHovered) {
      bgColor = "yellow"
    }

    if (cell.hasShip) {
      if (board !== newgame.cplayer.board || cheat) {
        bgColor = cheat ? "navy" : "gray"
      }
    }

    if (cell.attackState === AttackState.miss) {
      bgColor = "white"
    } else if (cell.attackState === AttackState.hit) {
      bgColor = "red"
    }

    cellElement.style.backgroundColor = bgColor
  }
}

let Cheat = false
const cheat = () => {
  Cheat = !Cheat
  refresh()
  return
}

window.cheat = cheat

const newgame = new game(refresh)

makeBoard(newgame.cplayer.board, CBoard)
makeBoard(newgame.hplayer.board, HBoard)

newgame.start()

export { captainPrompts, typeWriter, xAxis, refresh }
