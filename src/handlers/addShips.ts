import { AddShipsRequest, Ship } from '../types.js';
import { WebSocket } from 'ws';
import { memoryDb } from '../db/memoryDb.js';
import { getSocketByPlayerId } from '../utils/getSocketByPlayerId.js';

export function addShips(socket: WebSocket, msg: AddShipsRequest) {
  if (typeof msg.data !== 'string') {
    return;
  }

  const { gameId, indexPlayer, ships } = JSON.parse(msg.data) as {
    gameId: string;
    indexPlayer: string;
    ships: Ship[];
  };

  const game = memoryDb.games.get(gameId);

  if (!game) {
    console.log(`Game ${gameId} not found`);
    return;
  }

  const player = game.players.find((p) => p.gamePlayerId === indexPlayer);

  if (!player) {
    console.log(`Player ${indexPlayer} not found in game ${gameId}`);
    return;
  }
  player.ships = ships;
  player.ready = true;

  console.log(
    `Player ${indexPlayer} set ships in game ${gameId}. Ready = ${player.ready}`
  );

  const allReady = game.players.every((p) => p.ready);

  if (!allReady) {
    return;
  }

  game.players.forEach((p) => {
    const sock = getSocketByPlayerId(p.globalPlayerId);

    if (!sock || sock.readyState !== WebSocket.OPEN) {
      return;
    }

    const msgForPlayer = {
      type: 'start_game',
      data: JSON.stringify({
        gameId: game.gameId,
        yourIdPlayer: p.gamePlayerId,
        currentTurn: game.currentTurn,
      }),
      id: 0,
    };

    sock.send(JSON.stringify(msgForPlayer));
  });

  console.log(`Game ${gameId}: all players ready, start_game sent`);
}
