import { sessions } from '../db/memoryDb.js';
import {WebSocket} from 'ws';

export function getSocketByPlayerId(playerId: string): WebSocket | undefined {
  for (const [socket, id] of sessions.entries()) {
    if (id === playerId) {
      return socket;
    }
  }
  return undefined;
}
