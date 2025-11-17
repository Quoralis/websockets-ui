import { WebSocketServer, WebSocket } from 'ws';
import { httpServer } from '../http_server/index.js';
import { MsgRouter } from '../msgRouter.js';

const router = new MsgRouter();
export const wws = new WebSocketServer({ server: httpServer });

wws.on('connection', (socket: WebSocket, req) => {
  console.log(
    `WebSocket connected\n  url: ${req.url}\n  from: ${req.socket.remoteAddress}`,
  );

  socket.on('message', (message) => {
    try {
      const msg = JSON.parse(message.toString('utf8'));
      console.log('Received', msg);
      router.handle(socket, msg);

    } catch (err) {
      console.error('JSON parse error:', err);
    }
  });

  socket.on('close', () => {
    console.log('WebSocket closed');
  });
});
