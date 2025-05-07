import { game } from "../data/game"
import { AttackState } from "../data/gameBoard"
import "../styles.css"

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
  attackTheEnemy: () => `Attack captain ${captainPrompts.userName}!`,
}

const DifficultyState = Object.freeze({
  impossible: "Impossible",
  normal: "Normal",
  easy: "Easy",
})

let difficulty = DifficultyState.normal
let changeDifficulty = document.getElementById("changeDifficulty")
let texDifficulty = document.querySelector(".textDifficulty")

changeDifficulty.addEventListener("click", () => {
  if (difficulty === DifficultyState.impossible) {
    texDifficulty.textContent = "Difficulty:" + " " + DifficultyState.normal
    difficulty = DifficultyState.normal
  } else if (difficulty === DifficultyState.normal) {
    texDifficulty.textContent = "Difficulty:" + " " + DifficultyState.easy
    difficulty = DifficultyState.easy
  } else if (difficulty === DifficultyState.easy) {
    texDifficulty.textContent = "Difficulty:" + " " + DifficultyState.impossible
    difficulty = DifficultyState.impossible
  }
})

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
    typeWriter("", captainPrompts.LogInfo, 0)
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
    setTimeout(() => typeWriter(string, toDisplay, index + 1), 30) // speed
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
  boardElement.innerHTML = ""
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
const W = () => {
  Cheat = !Cheat
  refresh()
  return
}

let newgame = new game(refresh)
const loadGame = () => {
  window.W = W
  window.loadGame = loadGame
  newgame = new game(refresh)
  makeBoard(newgame.cplayer.board, CBoard)
  makeBoard(newgame.hplayer.board, HBoard)
  newgame.start()
}
loadGame()

let newGame = document.getElementById("newGame")
newGame.addEventListener("click", () => {
  if (captainPrompts.typing === false) {
    loadGame()
  }
})

export {
  captainPrompts,
  typeWriter,
  xAxis,
  refresh,
  loadGame,
  difficulty,
  DifficultyState,
}
