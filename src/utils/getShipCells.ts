import { Ship } from '../types.js';

export function getShipCells(ship: Ship) {
  const cells = [];

  for (let i = 0; i < ship.length; i++) {
    if (!ship.direction) {  //  horizontal
      cells.push({
        x: ship.position.x + i,
        y: ship.position.y
      });
    } else { // vertical
      cells.push({
        x: ship.position.x,
        y: ship.position.y + i
      });
    }
  }

  return cells;
}
