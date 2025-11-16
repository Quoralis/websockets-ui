import { AddShipsRequest, Ship } from "../types.js";
import { WebSocket } from "ws";
import { memoryDb } from "../db/memoryDb.js";
import { getSocketByPlayerId } from "../utils/getSocketByPlayerId.js";
import { getShipCells } from "../utils/getShipCells.js";

export function addShips(socket: WebSocket, msg: AddShipsRequest) {
  if (typeof msg.data !== "string") return;

  const { gameId, indexPlayer, ships } = JSON.parse(msg.data);
  const game = memoryDb.games.get(gameId);

  if (!game) return;

  const player = game.players.find((p) => p.gamePlayerId === indexPlayer);
  if (!player) return;

  player.ships = ships.map((ship:Ship) => {
    const cells = getShipCells(ship).map((c) => ({
      ...c,
      hits: false,
    }));

    return {
      ...ship,
      shipsCell: cells,
      hits: 0,
      kill: false,
    };
  });

  player.ready = true;

  const allReady = game.players.every((p) => p.ready);
  if (!allReady) return;

  game.currentTurn = game.players[0].gamePlayerId;

  for (const p of game.players) {
    const sock = getSocketByPlayerId(p.globalPlayerId);
    if (!sock || sock.readyState !== WebSocket.OPEN) continue;

    sock.send(
      JSON.stringify({
        type: "start_game",
        data: JSON.stringify({
          gameId: game.gameId,
          yourIdPlayer: p.gamePlayerId,
          currentTurn: game.currentTurn,
        }),
        id: 0,
      })
    );
  }

  console.log(`Game ${gameId}: all ships set, game started`);
}
