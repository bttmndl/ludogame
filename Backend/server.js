const http = require("http");
const WebSocket = require("ws");

const PORT = process.env.PORT || 3001;
const rooms = new Map();

function createRoom(roomId) {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, {
      id: roomId,
      players: new Map(),
      gameState: null,
      playerCount: 4,
    });
  }

  return rooms.get(roomId);
}

function roomPayload(room) {
  return {
    roomId: room.id,
    players: Array.from(room.players.values()).map(({ id, name, playerId }) => ({
      id,
      name,
      playerId,
    })),
    playerCount: room.playerCount,
    gameState: room.gameState,
  };
}

function send(ws, type, payload = {}) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type, payload }));
  }
}

function broadcast(room, type, payload = {}) {
  room.players.forEach((player) => send(player.ws, type, payload));
}

function nextPlayerId(room, preferredPlayerId) {
  const used = new Set(
    Array.from(room.players.values()).map((player) => player.playerId),
  );

  if (
    Number.isInteger(preferredPlayerId) &&
    preferredPlayerId >= 0 &&
    preferredPlayerId < room.playerCount &&
    !used.has(preferredPlayerId)
  ) {
    return preferredPlayerId;
  }

  for (let i = 0; i < room.playerCount; i++) {
    if (!used.has(i)) return i;
  }

  return null;
}

function removeClientFromCurrentRoom(ws) {
  if (!ws.roomId || !rooms.has(ws.roomId) || !ws.clientId) return;

  const room = rooms.get(ws.roomId);
  room.players.delete(ws.clientId);

  if (room.players.size === 0) {
    rooms.delete(ws.roomId);
  } else {
    broadcast(room, "room_update", roomPayload(room));
  }
}

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Ludo realtime server is running.\n");
});

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  ws.on("message", (raw) => {
    let message;

    try {
      message = JSON.parse(raw.toString());
    } catch (error) {
      send(ws, "error", { message: "Invalid message format." });
      return;
    }

    const { type, payload = {} } = message;

    if (type === "join_room") {
      const roomId = String(payload.roomId || "").trim().toUpperCase();
      if (!roomId) {
        send(ws, "error", { message: "Room code is required." });
        return;
      }

      const room = createRoom(roomId);
      if (payload.playerCount && !room.gameState && room.players.size === 0) {
        room.playerCount = Number(payload.playerCount);
      }

      const clientId = payload.clientId || ws.clientId || cryptoRandomId();
      const existingPlayer = room.players.get(clientId);
      const playerId =
        existingPlayer?.playerId ?? nextPlayerId(room, payload.preferredPlayerId);

      if (playerId === null) {
        send(ws, "error", { message: "Room is full." });
        return;
      }

      if (ws.roomId && ws.roomId !== roomId) {
        removeClientFromCurrentRoom(ws);
      }

      ws.roomId = roomId;
      ws.clientId = clientId;

      room.players.set(ws.clientId, {
        id: ws.clientId,
        name: payload.name || `Player ${playerId + 1}`,
        playerId,
        ws,
      });

      send(ws, "joined_room", {
        clientId: ws.clientId,
        playerId,
        ...roomPayload(room),
      });
      broadcast(room, "room_update", roomPayload(room));
      return;
    }

    if (!ws.roomId || !rooms.has(ws.roomId)) {
      send(ws, "error", { message: "Join a room first." });
      return;
    }

    const room = rooms.get(ws.roomId);
    const player = room.players.get(ws.clientId);
    if (!player) return;

    if (type === "sync_state") {
      room.gameState = payload.gameState;
      room.playerCount = payload.playerCount || room.playerCount;
      broadcast(room, "state_synced", {
        gameState: room.gameState,
        playerCount: room.playerCount,
      });
      return;
    }

    if (type === "roll_dice") {
      broadcast(room, "dice_rolled", {
        playerId: player.playerId,
        dice: payload.dice,
      });
      return;
    }

    if (type === "move_goti") {
      broadcast(room, "goti_moved", {
        playerId: player.playerId,
        gotiId: payload.gotiId,
      });
    }
  });

  ws.on("close", () => {
    removeClientFromCurrentRoom(ws);
  });
});

function cryptoRandomId() {
  return Math.random().toString(36).slice(2, 10);
}

server.listen(PORT, () => {
  console.log(`Ludo realtime server listening on http://localhost:${PORT}`);
});
