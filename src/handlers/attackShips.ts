import { WebSocket } from 'ws';
import { AttackRequest } from '../types.js';
import { memoryDb } from '../db/memoryDb.js';
import { getSocketByPlayerId } from '../utils/getSocketByPlayerId.js';
import { getCellsAroundShip } from '../utils/getArroundCells.js';

export function attackShips(socket: WebSocket, msg: AttackRequest) {
  if (typeof msg.data !== 'string') return;

  const { gameId, x, y, indexPlayer } = JSON.parse(msg.data);
  const game = memoryDb.games.get(gameId);
  if (!game) return;

  if (game.currentTurn !== indexPlayer) return;

  const shooter = game.players.find((p) => p.gamePlayerId === indexPlayer);
  const target = game.players.find((p) => p.gamePlayerId !== indexPlayer);

  if (!shooter || !target) return;

  let status = "miss";
  const hitShip = target.ships.find(ship =>
    ship.shipsCell.some(c => c.x === x && c.y === y)
  );

  if (hitShip) {
    const cell = hitShip.shipsCell.find(c => c.x === x && c.y === y);

    if (cell && !cell.hits) {
      cell.hits = true;
      hitShip.hits++;
    }

    if (hitShip.hits === hitShip.length) {
      hitShip.kill = true;
      status = "killed";
    } else {
      status = "shot";
    }
  }

  for (const p of game.players) {
    const sock = getSocketByPlayerId(p.globalPlayerId);
    if (!sock || sock.readyState !== WebSocket.OPEN) continue;

    sock.send(JSON.stringify({
      type: "attack",
      data:JSON.stringify( {
        position: { x, y },
        currentPlayer: indexPlayer,
        status
      }),
      id: 0
    }));
  }

  if (status === "killed" && hitShip) {
    let around = getCellsAroundShip(hitShip);

    around = around.filter(pos =>
      !hitShip.shipsCell.some(c => c.x === pos.x && c.y === pos.y)
    );

    for (const pos of around) {
      for (const p of game.players) {
        const sock = getSocketByPlayerId(p.globalPlayerId);
        if (!sock || sock.readyState !== WebSocket.OPEN) continue;

        sock.send(JSON.stringify({
          type: "attack",
          data:JSON.stringify({
            position: pos,
            currentPlayer: indexPlayer,
            status: "miss"
          }),
          id: 0
        }));
      }
    }
  }

  const allDead = target.ships.every(s => s.kill);
  if (allDead) {
    for (const p of game.players) {
      const sock = getSocketByPlayerId(p.globalPlayerId);
      if (!sock || sock.readyState !== WebSocket.OPEN) continue;

      sock.send(JSON.stringify({
        type: "finish",
        data: JSON.stringify({ winPlayer: shooter.gamePlayerId }),
        id: 0
      }));
    }
    return;
  }

  if (status === "miss") {
    game.currentTurn = target.gamePlayerId;
  }

  for (const p of game.players) {
    const sock = getSocketByPlayerId(p.globalPlayerId);
    if (!sock || sock.readyState !== WebSocket.OPEN) continue;

    sock.send(JSON.stringify({
      type: "turn",
      data: JSON.stringify({ currentPlayer: game.currentTurn }),
      id: 0
    }));
  }
}
