import {WebSocket} from 'ws';

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

type Ship = {
  position: {
    x: number;
    y:number;
  };
  direction: boolean;
  length: number;
  type: "small"|"medium"|"large"|"huge"
}
export type PlayerInGame = {
  gamePlayerId: string;
  globalPlayerId: string;
  ships: Ship[];
  ready: boolean;
};

export type Game = {
  gameId: string;
  roomId: string;
  players: PlayerInGame[];
  currentTurn?: string;
};

export const memoryDb = {
  players: new Map<string, Player>(),
  rooms: new Map<string, Room>(),
  sessions:new Map<WebSocket, string>(),
  games: new Map<string,Game>()

};


