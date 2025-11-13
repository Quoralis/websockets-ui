import { memoryDb } from '../db/memoryDb.js';
import { WebSocket } from 'ws';
import { wws } from '../ws_server/index.js';

export function createGame(roomId: string) {
  const room = memoryDb.rooms.get(roomId);
  if (!room) return;

  if (room.roomUsers.length !== 2) return;

  const msg = {
    type: 'start_game',
    data: JSON.stringify({
      roomId,
      players: room.roomUsers,
    }),
    id: 0,
  };

  wws.clients.forEach((client: WebSocket) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(msg));
    }
  });

  console.log(`🎮 Game started in room ${roomId}`);
}
