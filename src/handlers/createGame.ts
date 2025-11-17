import { memoryDb } from '../db/memoryDb.js';
import { WebSocket } from 'ws';
import { randomUUID } from 'node:crypto';
import { getSocketByPlayerId } from '../utils/getSocketByPlayerId.js';
import { Game } from '../types.js';

export function createGame(roomId: string) {
  const room = memoryDb.rooms.get(roomId);
  if (!room) {
    console.log(`Room ${roomId} not found`);
    return;
  }

  if (room.roomUsers.length < 2) {
    console.log(`Not enough players to create game`);
    return;
  }

  const gameId = randomUUID();
  const [p1, p2] = room.roomUsers;

  const p1GameId = String(p1.index);
  const p2GameId = String(p2.index);

  const newGame = {
    gameId,
    roomId,
    players: [
      {
        gamePlayerId: p1GameId,
        globalPlayerId: String(p1.index),
        ships: [],
        ready: false,
      },
      {
        gamePlayerId: p2GameId,
        globalPlayerId: String(p2.index),
        ships: [],
        ready: false,
      },
    ],
    currentTurn: p1GameId,
    attackedCells: []
  } as Game;

  memoryDb.games.set(gameId, newGame);

  console.log(`Game ${gameId} created for room ${roomId}`);


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
}
