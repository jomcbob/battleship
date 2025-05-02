class Ship {
  constructor(length) {
    this.length = length;
    this.hits = 0;
    this.isSunk = false;
  }

  giveLength() {
    return this.length;
  }

  checkIfSunk() {
    if (this.hits >= this.length) {
      this.isSunk = true;
      return true;
    }

    return false;
  }

  gotHit() {
    this.hits++;
  }
}

export { Ship };
