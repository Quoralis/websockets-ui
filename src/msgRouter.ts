import { WebSocket } from 'ws';
import { handleReq } from './handlers/handleReg.js';
import { ClientToServer, RegRequest, RegResponse } from './types.js';
import { handleCreateRoom } from './handlers/handleCreateRoom.js';

type HandlerFn = (...args: any[]) => any;

export class MsgRouter {
  private handlers: Record<string, HandlerFn> = {};

  constructor() {
    this.handlers['reg'] = handleReq;
    this.handlers['create_room'] = handleCreateRoom;

  }

  handle(socket: WebSocket, msg: ClientToServer) {
    switch (msg.type) {
      case 'reg': {
        const handler = this.handlers[msg.type];
        console.log('Incoming message:', msg);
        const res = handler(socket, msg);
        console.log('Ответ', res);
        socket.send(JSON.stringify(res));
        break;
      }
      case 'create_room': {
        const handler = this.handlers[msg.type];
        const res = handler(socket);
        socket.send(JSON.stringify(res));
        break;
      }

      default:
        console.log(`No handler found for type: ${msg.type}`);
        break;
    }
  }
}
