import { gameBoard } from "./gameBoard";
import "./styles.css";

let HBoard = document.getElementById("HBoard");
let CBoard = document.getElementById("CBoard");

const makeBoard = (appendto, kind) => {
  kind = new gameBoard();
  for (let i = 0; i < 100; i++) {
    let div = document.createElement("div");
    div.classList.add(`cell`, `${appendto.id + i}`);

    appendto.appendChild(div);
  }
};

makeBoard(HBoard, "HBoard");
makeBoard(CBoard, "CBoard");
