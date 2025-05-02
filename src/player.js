import { gameBoard } from "./gameBoard";

class player {
  constructor(kind) {
    this.board = new gameBoard();
    this.kind = kind;
  }
}

export { player };
