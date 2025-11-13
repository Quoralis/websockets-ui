// ===== BASE =====
export interface BaseMessage {
  id: 0;
  type: string;
}

// ===== PLAYER =====
export interface RegRequest extends BaseMessage {
  type: 'reg';
  data: {
    name: string;
    password: string;
  } | string;
}

export interface RegResponse extends BaseMessage {
  type: 'reg';
  data: {
    name: string;
    index: number | string;
    error: boolean;
    errorText: string;
  } | string;
}

export interface UpdateWinnersResponse extends BaseMessage {
  type: 'update_winners';
  data: {
    name: string;
    wins: number;
  }[];
}

// ===== ROOM =====
export interface CreateRoomRequest extends BaseMessage {
  type: 'create_room';
  data: '';
}

export interface AddUserToRoomRequest extends BaseMessage {
  type: 'add_user_to_room';
  data: {
    indexRoom: string;
  };
}

export interface CreateGameResponse extends BaseMessage {
  type: 'create_game' | string;
  data: {
    idGame: number | string;
    idPlayer: number | string;
  };
}

export interface UpdateRoomResponse extends BaseMessage {
  type: 'update_room';
  data:| {
    roomId: number | string;
    roomUsers: {
      name: string;
      index: number | string;
    }[];
  }[] |string;
}


// ===== SHIPS =====
export type Ship = {
  position: { x: number; y: number };
  direction: boolean;
  length: number;
  type: 'small' | 'medium' | 'large' | 'huge';
};

export interface AddShipsRequest extends BaseMessage {
  type: 'add_ships';
  data: {
    gameId: number | string;
    ships: Ship[];
    indexPlayer: number | string;
  };
}

export interface StartGameResponse extends BaseMessage {
  type: 'start_game';
  data: {
    ships: Ship[]; // player's ships
    currentPlayerIndex: number | string;
  };
}

// ===== GAME =====
export interface AttackRequest extends BaseMessage {
  type: 'attack';
  data: {
    gameId: number | string;
    x: number;
    y: number;
    indexPlayer: number | string;
  };
}

export interface AttackResponse extends BaseMessage {
  type: 'attack';
  data: {
    position: { x: number; y: number };
    currentPlayer: number | string;
    status: 'miss' | 'killed' | 'shot';
  };
}

export interface RandomAttackRequest extends BaseMessage {
  type: 'randomAttack';
  data: {
    gameId: number | string;
    indexPlayer: number | string;
  };
}

export interface TurnResponse extends BaseMessage {
  type: 'turn';
  data: {
    currentPlayer: number | string;
  };
}

export interface FinishResponse extends BaseMessage {
  type: 'finish';
  data: {
    winPlayer: number | string;
  };
}

// ===== UNIONS =====
export type ClientToServer =
  | RegRequest
  | CreateRoomRequest
  | AddUserToRoomRequest
  | AddShipsRequest
  | AttackRequest
  | RandomAttackRequest;

export type ServerToClient =
  | RegResponse
  | UpdateWinnersResponse
  | CreateGameResponse
  | UpdateRoomResponse
  | StartGameResponse
  | AttackResponse
  | TurnResponse
  | FinishResponse;
