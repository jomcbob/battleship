### My plan
```js
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
```
# ⚓ Battleship Command

> A classic Battleship strategy game with a captain's twist — written in JavaScript, no frameworks!

## 🕹️ Demo -> [Live here](jomcbob.github.io/battleship)

Play the game by opening the `index.html` in your browser. Ships away!

## 📦 Project Structure

This game is built from scratch using vanilla JavaScript, HTML, and CSS. It features an interactive UI, a bot opponent, and dynamic prompts from your digital captain.

```
/project-root
├── data/ # Core game logic (game, player, gameBoard, ship)
├── presentation/ # UI helpers (text typing, prompts, board rendering)
├── styles.css # Styling
├── template.html # Entry point
└── README.md # This file
```


## 🚢 Features

- 🎯 **Turn-based gameplay**: Human vs. AI  
- 🧠 **AI ship placement and attacks** using random logic  
- ✍️ **Typewriter effect** and dynamic captain prompts  
- 🧭 **Mouse hover previews** for ship placement  
- 🛠️ **Cheat mode**: Toggle computer's ship visibility for debugging  
- 🎉 **Victory/Defeat animations and restart option**  

## 🧩 Modules Breakdown

### `game.js`

Main game controller. Manages game state transitions, player turns, and victory logic.

Key States:
```js
GameState = {
  computerPlacesShips,
  humanPlacesCarrier,
  humanPlacesBattleship,
  humanPlacesCruiser,
  humanPlacesSubmarine,
  humanPlacesPatrolBoat,
  computerTurn,
  humanTurn,
  gameEnd
}

gameBoard.js
Represents each player's 10x10 board. Handles ship placement, cell attacks, and hover logic.

placeShip(position, length, isHorizontal)

cellClicked(index) - Handles click logic by game state

checkIfValidCoords() - Prevents illegal placement

hasReceivedAnAttack() - Resolves hit/miss

player.js
Encapsulates both human and bot players.

Delegates all board actions to gameBoard

Tracks name and board instance

ship.js
Defines a simple Ship object with:

gotHit()

checkIfSunk()

presentation/index.js
UI interactions:

Axis toggle (X ↔ Y)

Name change prompt

typeWriter() effect

Board rendering via DOM

Visual effects for hover, hits, and sunk ships

loadGame() to initialize everything

🔧 How to Run
Clone or download the repository

Open index.html in your browser

Use the buttons and follow the prompts to play!

No build tools, frameworks, or servers required.

💻 Tech Stack
HTML5

Vanilla JavaScript (ES6)

CSS3 (Flexbox)

🎮 Controls & Gameplay
Mouse Hover: Preview ship placement

Mouse Click: Place ships or attack

Axis Button: Toggle ship orientation

Name Button: Rename yourself mid-game

New Game: Restart the battle

🧙 Developer Cheats
Open your browser console and use:

cheat()       // Toggles visibility of the bot's ships
loadGame()    // Restarts the game
