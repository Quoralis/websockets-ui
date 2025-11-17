import { RandomAttackRequest } from '../types.js';
import { WebSocket } from 'ws';
import { memoryDb } from '../db/memoryDb.js';
import { attack } from '../utils/attack.js';

const boardSize = 10;

export function randomAttack(socket: WebSocket, msg: RandomAttackRequest) {
  if (typeof msg.data !== 'string') return;

  const { gameId, indexPlayer } = JSON.parse(msg.data);
  const game = memoryDb.games.get(gameId);
  if (!game) return;

  if (game.currentTurn !== indexPlayer) return;

  let x:number, y:number;

  while (true) {
    x = Math.floor(Math.random() * boardSize);
    y = Math.floor(Math.random() * boardSize);

    const attackedCell =game.attackedCells.some(cell => cell.x === x && cell.y === y);
    if(!attackedCell) break;
  }

  attack(game, indexPlayer, x, y);

}
