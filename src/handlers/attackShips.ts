import { WebSocket } from 'ws';
import { AttackRequest } from '../types.js';
import { memoryDb } from '../db/memoryDb.js';
import { attack } from '../utils/attack.js';

export function attackShips(socket: WebSocket, msg: AttackRequest) {
  if (typeof msg.data !== 'string') return;

  const { gameId, x, y, indexPlayer } = JSON.parse(msg.data);
  const game = memoryDb.games.get(gameId);
  if (!game) return;

  if (game.currentTurn !== indexPlayer) return;

  attack(game, indexPlayer, x, y);
}

