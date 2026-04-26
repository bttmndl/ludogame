const WS_URL = process.env.REACT_APP_WS_URL || "ws://localhost:3001";

export function createRealtimeClient(onMessage, onStatusChange) {
  let socket = null;
  let reconnectTimer = null;

  function setStatus(status) {
    if (onStatusChange) onStatusChange(status);
  }

  function connect() {
    socket = new WebSocket(WS_URL);
    setStatus("connecting");

    socket.addEventListener("open", () => setStatus("connected"));

    socket.addEventListener("message", (event) => {
      try {
        onMessage(JSON.parse(event.data));
      } catch (error) {
        console.warn("Invalid realtime message", event.data);
      }
    });

    socket.addEventListener("close", () => {
      setStatus("disconnected");
      reconnectTimer = window.setTimeout(connect, 1500);
    });

    socket.addEventListener("error", () => setStatus("error"));
  }

  connect();

  return {
    send(type, payload = {}) {
      const message = JSON.stringify({ type, payload });
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(message);
      }
    },
    close() {
      window.clearTimeout(reconnectTimer);
      if (socket) socket.close();
    },
  };
}
