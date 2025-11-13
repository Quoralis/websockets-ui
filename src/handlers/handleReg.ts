import { memoryDb, Player, sessions } from '../db/memoryDb.js';
import { randomUUID } from 'node:crypto';
import { RegRequest, RegResponse } from '../types.js';
import { WebSocket } from 'ws';

export function handleReq(socket: WebSocket, msg: RegRequest): RegResponse | undefined {
  if (typeof msg.data === 'string') {
    const data = JSON.parse(msg.data);
    const { name, password } = data;
    const id = randomUUID();

    const player = [...memoryDb.players.values()].find(p => p.name === name);
    if (player) {
      return {
        type: 'reg',
        data:JSON.stringify( {
          name,
          index: player.id,
          error: true,
          errorText: 'Player already exists',
        }),
        id: 0,
      };
    }

    const newPlayer: Player = { id, name, password, wins: 0 };
    memoryDb.players.set(id, newPlayer);
    sessions.set(socket, id);
    return {
      type: 'reg',
      data: JSON.stringify({
        name,
        index: id,
        error: false,
        errorText: 'Player created successfully',
      }),
      id:0,
    };
  }
}
