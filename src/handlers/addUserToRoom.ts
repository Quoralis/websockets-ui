import { AddUserToRoomRequest } from '../types.js';
import { WebSocket } from 'ws';
import { memoryDb, RoomUser, sessions } from '../db/memoryDb.js';
import { randomUUID } from 'node:crypto';
import { getSocketByPlayerId } from '../utils/getSocketByPlayerId.js';

export function addUserToRoom(socket: WebSocket, msg: AddUserToRoomRequest) {
  if (typeof msg.data === 'string') {
    const dataRoom = JSON.parse(msg.data);
    const roomId = dataRoom.indexRoom;
    const playerId = sessions.get(socket);

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
      const gameId = randomUUID();
      const [p1, p2] = room.roomUsers;

      const p1GameId = randomUUID();
      const p2GameId = randomUUID();

      const msgForP1 = {
        type: 'create_game',
        data:JSON.stringify( {
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
  }
}