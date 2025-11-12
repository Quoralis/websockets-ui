import { memoryDb, Room, sessions } from '../db/memoryDb.js';
import { WebSocket } from 'ws';
import { randomUUID } from 'node:crypto';
import { UpdateRoomResponse } from '../types.js';

export function handleCreateRoom(socket: WebSocket): UpdateRoomResponse | undefined {
  const playerId = sessions.get(socket);
  if(!playerId){
    return;
  }
  console.log(playerId);

  const player = [...memoryDb.players.values()].find(p => p.id === playerId);
  if (!player) {
    console.log(' Player not found');
    return;
  }
  const roomId = randomUUID();

  const room: Room = {
    id: roomId,
    players: [playerId],
  };

  memoryDb.rooms.set(roomId, room);

  console.log(`Room created: ${roomId} (owner ${playerId})`);

  const response = {
    type: 'update_room',
    data: JSON.stringify([
      {
        roomId,
        roomUsers: [
          {
            name: player.name,
            index: player.id,
          },
        ],
      },
    ]),
    id: 0,
  } satisfies UpdateRoomResponse;

  return response;
}
