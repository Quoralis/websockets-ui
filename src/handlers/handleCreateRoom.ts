import { memoryDb, Room, RoomUser, sessions } from '../db/memoryDb.js';
import { WebSocket } from 'ws';
import { randomUUID } from 'node:crypto';
import { UpdateRoomResponse } from '../types.js';

export function handleCreateRoom(socket: WebSocket): UpdateRoomResponse | undefined {
  const playerId = sessions.get(socket);
  const roomId = randomUUID();

  if (!playerId) {
    return;
  }

  const player = [...memoryDb.players.values()].find(p => p.id === playerId);
  if (!player) {
    console.log(' Player not found');
    return;
  }
  const roomUser: RoomUser = {
    name:player.name,
    index:playerId,
  };


  const room: Room = {
    roomId: roomId,
    roomUsers:[]
  };
  room.roomUsers.push(roomUser)

  memoryDb.rooms.set(roomId, room);

  console.log(`Room created: ${roomId} (owner ${playerId}),${memoryDb}`);

  return;
}
