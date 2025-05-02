import { Ship } from "./ship";
import { gameBoard } from "./gameBoard";

let boat = new Ship(4);
test("makes ships", () => {
  boat.gotHit();
  boat.gotHit();
  boat.gotHit();
  boat.gotHit();
  expect(boat.giveLength()).toBe(4);
  expect(boat.checkIfSunk()).toBe(true);
});

let boat2 = new Ship(2);
test("makes a ship of length 2 and checks if it is sunk", () => {
  expect(boat2.giveLength()).toBe(2);
  expect(boat2.checkIfSunk()).toBe(false);
  boat2.gotHit();
  boat2.gotHit();
  expect(boat2.checkIfSunk()).toBe(true);
});

let board = new gameBoard();

test("makes board", () => {
  expect(board.cords[99].slice(0, 2)).toEqual([9, 9]);
  expect(board.cords[0].slice(0, 2)).toEqual([0, 0]);
  expect(board.cords[12].slice(0, 2)).toEqual([2, 1]);
});

test("places ship", () => {
  board.placeShip(1, 4);
  expect(board.hasShip(1)).toBe(true);
  expect(board.hasShip(2)).toBe(true);
  expect(board.hasShip(3)).toBe(true);
  expect(board.hasShip(4)).toBe(true);
  expect(board.hasShip(5)).toBe(false);
  expect(board.hasShip(14)).toBe(false);
});

test("receives an attack", () => {
  board.hasReceivedAnAttack(1);
  board.hasReceivedAnAttack(2);
  board.hasReceivedAnAttack(3);
  board.hasReceivedAnAttack(4);
  expect(board.hasReceivedAnAttack(1)).toBe(true);
});

test("checks if lost", () => {
  expect(board.hasLost()).toBe(true);
});
