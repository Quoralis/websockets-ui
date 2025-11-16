import {WebSocket} from 'ws';
import { Game } from '../types.js';

export type Player = {
  id: string;
  name: string;
  password: string;
  wins: number;
}

export type Room = {
  roomId: string;
  roomUsers: RoomUser[];
}
export type RoomUser = {
  name: string;
  index: string;
};

export const memoryDb = {
  players: new Map<string, Player>(),
  rooms: new Map<string, Room>(),
  sessions:new Map<WebSocket, string>(),
  games: new Map<string,Game>()

};


