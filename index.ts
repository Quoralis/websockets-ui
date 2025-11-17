import { httpServer } from './src/http_server/index.js';
import * as dotenv from 'dotenv';
import { wws } from './src/ws_server/index.js';

dotenv.config();

const HTTP_PORT = process.env.PORT || 3000;

httpServer.listen(HTTP_PORT, () => {
  console.log(`HTTP and WS server started`);
  console.log(`Port: ${HTTP_PORT}`);
  console.log(`URL: ws://localhost:${HTTP_PORT}`);
});

process.on('SIGINT', () => {
  httpServer.close(() => {
  });
  wws.close(() => {
    console.log('WS and HTTP closed');
    process.exit();
  });

});