import { WebSocket } from 'ws';
import { handleReq } from './handlers/handleReg.js';
import { ClientToServer } from './types.js';
import { handleCreateRoom } from './handlers/handleCreateRoom.js';
import { memoryDb } from './db/memoryDb.js';
import { wws } from './ws_server/index.js';
import { addUserToRoom } from './handlers/addUserToRoom.js';
import { addShips } from './handlers/addShips.js';
import { attackShips } from './handlers/attackShips.js';

type HandlerFn = (socket: WebSocket, msg?: any) => any;

export class MsgRouter {
  private handlers: Record<string, HandlerFn> = {};

  constructor() {
    this.handlers['reg'] = handleReq;
    this.handlers['create_room'] = handleCreateRoom;
    this.handlers['add_user_to_room'] = addUserToRoom;
    this.handlers['add_ships'] = addShips
    this.handlers['attack'] = attackShips
    // this.handlers['randomAttack'] = randomAttack

  }

  updateRoom() {
    const rooms = Array.from(memoryDb.rooms.values());
    const availableRooms = rooms.filter(room => room.roomUsers.length < 2);
    const msg = {
      type: 'update_room',
      data: JSON.stringify(availableRooms),
      id: 0,
    };
    wws.clients.forEach((client: WebSocket) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(msg));
      }
    });
  }

  handle(socket: WebSocket, msg: ClientToServer) {
    const handler = this.handlers[msg.type];
    switch (msg.type) {
      case 'reg': {
        const res = handler(socket, msg);
        socket.send(JSON.stringify(res));
        this.updateRoom();
        break;
      }
      case 'create_room': {
        handler(socket);
        this.updateRoom();
        break;
      }
      case 'add_user_to_room': {
        handler(socket, msg);
        break;
      }
      case 'add_ships': {
        handler(socket, msg);
        break;
      }
      case 'attack': {
        handler(socket, msg);
        break;
      }
      case 'randomAttack':{
        handler(socket, msg);
        break;
      }

      default:
        console.log(`No handler found for type: ${msg}`);
        break;
    }
  }
}
