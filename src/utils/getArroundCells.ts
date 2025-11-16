import { Ship } from '../types.js';

export function getCellsAroundShip(ship:Ship) {
  const around = [];

  for (const cell of ship.shipsCell) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const x = cell.x + dx;
        const y = cell.y + dy;

        around.push({ x, y });
      }
    }
  }

  return around;
}
