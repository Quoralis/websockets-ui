import { AddUserToRoomRequest } from '../types.js';
import { WebSocket } from 'ws';
import { memoryDb, RoomUser } from '../db/memoryDb.js';
import { createGame } from './createGame.js';

export function addUserToRoom(socket: WebSocket, msg: AddUserToRoomRequest) {
  if (typeof msg.data === 'string') {
    const dataRoom = JSON.parse(msg.data);
    const roomId = dataRoom.indexRoom;
    const playerId = memoryDb.sessions.get(socket);

    const player = [...memoryDb.players.values()].find(p => p.id === playerId);
    if (!player) {
      console.log(`Player ${playerId} does not exist`);
      return;
    }
    if (!playerId) {
      console.log(`User  #${playerId} does not exist`);
      return;
    }
    const roomUser: RoomUser = {
      name: player.name,
      index: playerId,
    };
    const room = memoryDb.rooms.get(roomId);
    if (!room) {
      console.log(`Room  ${room} does not exist`);
      return;
    }
    const users = room.roomUsers;


    users.push(roomUser);
    console.log(`User ${playerId} added to room ${roomId}`);

    if (users.length === 2) {
      createGame(roomId)
      return;
    }
  }
}