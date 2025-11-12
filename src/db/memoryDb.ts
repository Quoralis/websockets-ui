import {WebSocket} from 'ws';

export type Player = {
  id: string;
  name: string;
  password: string;
  wins: number;
}

export type Room = {
  id: string;
  players: string[];
}

export const memoryDb = {
  players: new Map<string, Player>(),
  rooms: new Map<string, Room>(),
};

export const sessions = new Map<WebSocket, string>();


