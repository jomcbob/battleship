import { Ship } from "./ship";

class gameBoard {
  constructor() {
    this.cords = this.makeBoard();
    this.totalShipLength = 0;
  }

  makeBoard() {
    let cord = [];
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        // the first one is the x cord, the second is the y cord,
        //  the third boolen is if it has a ship on that square, and the last if it has been attacked or not
        cord.push([x, y, false, "hasNotBeenAttacked"]);
      }
    }
    return cord;
  }

  hasReceivedAnAttack(square) {
    if (this.cords[square][3] === "hasNotBeenAttacked") {
      if (this.cords[square][2] === false) {
        this.cords[square][3] = "miss";
        console.log("miss");
      } else if (this.cords[square][2] === true) {
        this.cords[square][3] = "hit";
        console.log("hit");
      }
      return false;
    } else {
      console.log("hasBeenAttacked");
      return true;
    }
  }

  placeShip(square, length) {
    let boat = new Ship(length);
    for (let i = square; i <= boat.length; i++) {
      this.cords[i][2] = true;
    }
    this.totalShipLength += length;
  }

  hasLost() {
    let num = 0;
    this.cords.forEach((cord) => {
      if (cord[2] === true && cord[3] === "hit") {
        num++;
      }
    });

    if (num >= this.totalShipLength) {
      return true;
    } else return false;
  }

  hasShip(num) {
    if (this.cords[num][2] === true) {
      return true;
    }

    return false;
  }
}

export { gameBoard };
