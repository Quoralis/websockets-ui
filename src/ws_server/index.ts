import { WebSocketServer } from 'ws';
import { httpServer } from '../http_server/index.js'

export const wws = new WebSocketServer({ server: httpServer });

wws.on('connection', (socket, req) => {
  console.log(
    `WebSocket connected\n  url: ${req.url}\n  from: ${req.socket.remoteAddress}`,
  );

  socket.on('message', (message) => {
    try {
      const msgStr = message.toString();
      const msgJson = JSON.parse(msgStr);
      console.log('Received:', msgJson);
    } catch (err) {
      console.error('JSON parse error:', err);
    }
  });

  socket.on('close', () => {
    console.log('WebSocket closed');
  });
});
