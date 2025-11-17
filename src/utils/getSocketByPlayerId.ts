import { memoryDb } from '../db/memoryDb.js';
import {WebSocket} from 'ws';

export function getSocketByPlayerId(playerId: string): WebSocket | undefined {
  for (const [socket, id] of memoryDb.sessions.entries()) {
    if (id === playerId) {
      return socket;
    }
  }
  return undefined;
}
