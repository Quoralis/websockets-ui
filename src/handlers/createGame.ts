import { memoryDb } from '../db/memoryDb.js';
import { WebSocket } from 'ws';
import { randomUUID } from 'node:crypto';
import { getSocketByPlayerId } from '../utils/getSocketByPlayerId.js';

export function createGame(roomId: string) {
  const gameId = randomUUID();
  const room = memoryDb.rooms.get(roomId);
  if(!room) {
    return;
  }
  const [p1, p2] = room.roomUsers;

  const p1GameId = randomUUID();
  const p2GameId = randomUUID();

  const msgForP1 = {
    type: 'create_game',
    data: JSON.stringify({
      idGame: gameId,
      idPlayer: p1GameId,
    }),
    id: 0,
  };

  const msgForP2 = {
    type: 'create_game',
    data: JSON.stringify({
      idGame: gameId,
      idPlayer: p2GameId,
    }),
    id: 0,
  };
  const sock1 = getSocketByPlayerId(p1.index);
  const sock2 = getSocketByPlayerId(p2.index);

  if (sock1 && sock1.readyState === WebSocket.OPEN) {
    sock1.send(JSON.stringify(msgForP1));
  }
  if (sock2 && sock2.readyState === WebSocket.OPEN) {
    sock2.send(JSON.stringify(msgForP2));
  }

  memoryDb.rooms.delete(roomId);
  return;
}
