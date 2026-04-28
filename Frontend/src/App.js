import React, { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import LudoBoard from "./LudoBoard";
import { createRealtimeClient } from "./realtime";

function makeRoomCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

function getClientId() {
  return Math.random().toString(36).slice(2, 10);
}

const App = () => {
  const [playerCount, setPlayerCount] = useState(4);
  const [svgSize] = useState(800);
  const [roomCode, setRoomCode] = useState("");
  const [playerName, setPlayerName] = useState("Player");
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [room, setRoom] = useState(null);
  const [localPlayerId, setLocalPlayerId] = useState(null);
  const [robotMatch, setRobotMatch] = useState(false);
  const [gameKey, setGameKey] = useState(0);
  const [remoteGameState, setRemoteGameState] = useState(null);
  const [remoteAction, setRemoteAction] = useState(null);
  const [error, setError] = useState("");
  const [roomModalMode, setRoomModalMode] = useState(null);
  const [authModalMode, setAuthModalMode] = useState(null);
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [user, setUser] = useState(null);
  const [navOpen, setNavOpen] = useState(false);
  const clientRef = useRef(null);

  const clientId = useMemo(getClientId, []);

  useEffect(() => {
    clientRef.current = createRealtimeClient(
      ({ type, payload }) => {
        if (type === "joined_room") {
          setError("");
          setRobotMatch(false);
          setRoom(payload);
          setLocalPlayerId(payload.playerId);
          setPlayerCount(payload.playerCount || 4);
          setRemoteGameState(payload.gameState || null);
          setRoomModalMode(null);
          return;
        }

        if (type === "room_update") {
          setRoom(payload);
          if (payload.playerCount) setPlayerCount(payload.playerCount);
          return;
        }

        if (type === "state_synced") {
          if (payload.playerCount) setPlayerCount(payload.playerCount);
          setRemoteGameState(payload.gameState || null);
          return;
        }

        if (type === "dice_rolled") {
          setRemoteAction({
            id: `${Date.now()}-${Math.random()}`,
            type: "roll",
            playerId: payload.playerId,
            dice: payload.dice,
          });
          return;
        }

        if (type === "goti_moved") {
          setRemoteAction({
            id: `${Date.now()}-${Math.random()}`,
            type: "move",
            playerId: payload.playerId,
            gotiId: payload.gotiId,
          });
          return;
        }

        if (type === "error") {
          setError(payload.message || "Realtime error.");
        }
      },
      setConnectionStatus,
    );

    return () => clientRef.current?.close();
  }, []);

  function joinRoom(nextRoomCode = roomCode) {
    const cleanRoomCode = nextRoomCode.trim().toUpperCase();
    if (!cleanRoomCode) {
      setError("Enter a room code.");
      return;
    }

    setError("");
    setRoomCode(cleanRoomCode);
    clientRef.current?.send("join_room", {
      roomId: cleanRoomCode,
      clientId,
      name: playerName.trim() || "Player",
      playerCount,
    });
  }

  function createRoom() {
    const nextRoomCode = makeRoomCode();
    setRoomCode(nextRoomCode);
    joinRoom(nextRoomCode);
  }

  function startRobotMatch() {
    setError("");
    setRoom(null);
    setRobotMatch(true);
    setLocalPlayerId(0);
    setRemoteGameState(null);
    setRemoteAction(null);
    setGameKey((key) => key + 1);
    setRoomModalMode(null);
  }

  function openRoomModal(mode) {
    setError("");
    setNavOpen(false);
    setRoomModalMode(mode);
  }

  function openAuthModal(mode) {
    setError("");
    setNavOpen(false);
    setAuthModalMode(mode);
  }

  function handleSocialAuth(provider) {
    const name = provider === "google" ? "Google Player" : "Meta Player";
    setUser({
      name,
      email: `${provider}@example.com`,
    });
    setPlayerName(name);
    setAuthModalMode(null);
  }

  function submitAuth(event) {
    event.preventDefault();
    const name = authForm.name.trim() || authForm.email.split("@")[0] || "Player";
    setUser({
      name,
      email: authForm.email.trim(),
    });
    setPlayerName(name);
    setAuthModalMode(null);
    setAuthForm((prev) => ({ ...prev, password: "" }));
  }

  function sendRoll(dice) {
    clientRef.current?.send("roll_dice", { dice });
  }

  function sendMove(gotiId) {
    clientRef.current?.send("move_goti", { gotiId });
  }

  function syncState(gameState) {
    clientRef.current?.send("sync_state", {
      gameState,
      playerCount,
    });
  }

  const online = Boolean(room);

  return (
    <div className="App">
      <header className="appHeader">
        <div className="brandBlock">
          <span className="brandMark">L</span>
          <div>
            <strong>Ludo Mania</strong>
            <small>Realtime Play</small>
          </div>
        </div>

        <button
          className="menuButton"
          onClick={() => setNavOpen((open) => !open)}
          aria-label="Toggle navigation"
          aria-expanded={navOpen}
        >
          <span />
          <span />
          <span />
        </button>

        <nav
          className={`topNav ${navOpen ? "topNavOpen" : ""}`}
          aria-label="Game navigation"
        >
          <span className={`status status-${connectionStatus}`}>
            {connectionStatus}
          </span>
          {room && (
            <span className="roomBadge">
              Room <b>{room.roomId}</b> | P{localPlayerId + 1}
            </span>
          )}
          {robotMatch && (
            <span className="roomBadge">
              Robot Match | P1 vs {playerCount - 1} bots
            </span>
          )}
          <button
            className="navButton navButtonPrimary"
            onClick={() => openRoomModal("join")}
            disabled={online}
          >
            Room
          </button>
          <button className="navButton" disabled title="Coming soon">
            Leaderboard
          </button>
          {user ? (
            <span className="userBadge">{user.name}</span>
          ) : (
            <button
              className="navButton"
              onClick={() => openAuthModal("login")}
            >
              Account
            </button>
          )}
        </nav>
      </header>

      <main className="gameStage">
        {(room || robotMatch) && (
          <div className="playersDock">
            {room
              ? room.players?.map((player) => (
                  <span key={player.id}>
                    P{player.playerId + 1}: {player.name}
                  </span>
                ))
              : Array.from({ length: playerCount }, (_, index) => (
                  <span key={index}>
                    P{index + 1}: {index === 0 ? playerName : "Robot"}
                  </span>
                ))}
          </div>
        )}
        <LudoBoard
          key={`${playerCount}-${room?.roomId || "local"}-${gameKey}`}
          playerCount={playerCount}
          SVG_SIZE={svgSize}
          online={online}
          enableBots={robotMatch}
          localPlayerId={robotMatch ? 0 : localPlayerId}
          remoteGameState={remoteGameState}
          remoteAction={remoteAction}
          onRollDice={sendRoll}
          onMoveGoti={sendMove}
          onGameStateChange={syncState}
        />
      </main>

      {roomModalMode && (
        <div className="modalOverlay" role="presentation">
          <section className="roomModal" role="dialog" aria-modal="true">
            <button
              className="modalClose"
              onClick={() => setRoomModalMode(null)}
              aria-label="Close room dialog"
            >
              x
            </button>

            <div className="modalHeader">
              <span className="modalEyebrow">Game room</span>
              <h2>
                {roomModalMode === "create"
                  ? "Create a room"
                  : roomModalMode === "robot"
                    ? "Play with AI"
                    : "Join a room"}
              </h2>
              <p>
                {roomModalMode === "create"
                  ? "Set up a room and invite friends with the generated code."
                  : roomModalMode === "robot"
                    ? "Choose how many players and let the robots handle the rest."
                    : "Enter your name and the room code shared by the host."}
              </p>
            </div>

            <div className="authTabs" role="tablist" aria-label="Room mode">
              <button
                className={roomModalMode === "join" ? "active" : ""}
                onClick={() => setRoomModalMode("join")}
                type="button"
              >
                Join
              </button>
              <button
                className={roomModalMode === "create" ? "active" : ""}
                onClick={() => setRoomModalMode("create")}
                type="button"
              >
                Create
              </button>
              <button
                className={roomModalMode === "robot" ? "active" : ""}
                onClick={() => setRoomModalMode("robot")}
                type="button"
              >
                AI
              </button>
            </div>

            <div className="modalFields">
              <label>
                Your name
                <input
                  value={playerName}
                  onChange={(event) => setPlayerName(event.target.value)}
                  placeholder="Player name"
                />
              </label>

              {roomModalMode === "join" && (
                <label>
                  Room code
                  <input
                    value={roomCode}
                    onChange={(event) =>
                      setRoomCode(event.target.value.toUpperCase())
                    }
                    placeholder="ABC123"
                  />
                </label>
              )}

              {(roomModalMode === "create" || roomModalMode === "robot") && (
                <label>
                  Players
                  <select
                    value={playerCount}
                    onChange={(event) => setPlayerCount(Number(event.target.value))}
                  >
                    {[2, 4, 6, 8].map((count) => (
                      <option key={count} value={count}>
                        {count} players
                      </option>
                    ))}
                  </select>
                </label>
              )}
            </div>

            {error && <p className="error">{error}</p>}

            <div className="modalActions">
              <button className="navButton" onClick={() => setRoomModalMode(null)}>
                Cancel
              </button>
              <button
                className="navButton navButtonPrimary"
                onClick={
                  roomModalMode === "create"
                    ? createRoom
                    : roomModalMode === "robot"
                      ? startRobotMatch
                      : () => joinRoom()
                }
                disabled={
                  roomModalMode !== "robot" && connectionStatus !== "connected"
                }
              >
                {roomModalMode === "create"
                  ? "Create Room"
                  : roomModalMode === "robot"
                    ? "Play with AI"
                    : "Join Room"}
              </button>
            </div>
          </section>
        </div>
      )}

      {authModalMode && (
        <div className="modalOverlay" role="presentation">
          <section className="roomModal authModal" role="dialog" aria-modal="true">
            <button
              className="modalClose"
              onClick={() => setAuthModalMode(null)}
              aria-label="Close auth dialog"
            >
              x
            </button>

            <div className="modalHeader">
              <span className="modalEyebrow">Player account</span>
              <h2>{authModalMode === "login" ? "Login" : "Sign up"}</h2>
              <p>Use a player profile for rooms and future leaderboard stats.</p>
            </div>

            <div className="authTabs" role="tablist" aria-label="Account mode">
              <button
                className={authModalMode === "login" ? "active" : ""}
                onClick={() => setAuthModalMode("login")}
                type="button"
              >
                Login
              </button>
              <button
                className={authModalMode === "signup" ? "active" : ""}
                onClick={() => setAuthModalMode("signup")}
                type="button"
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={submitAuth}>
              <div className="modalFields">
                {authModalMode === "signup" && (
                  <label>
                    Display name
                    <input
                      value={authForm.name}
                      onChange={(event) =>
                        setAuthForm((prev) => ({
                          ...prev,
                          name: event.target.value,
                        }))
                      }
                      placeholder="Your name"
                    />
                  </label>
                )}

                <label>
                  Email
                  <input
                    type="email"
                    value={authForm.email}
                    onChange={(event) =>
                      setAuthForm((prev) => ({
                        ...prev,
                        email: event.target.value,
                      }))
                    }
                    placeholder="you@example.com"
                    required
                  />
                </label>

                <label>
                  Password
                  <input
                    type="password"
                    value={authForm.password}
                    onChange={(event) =>
                      setAuthForm((prev) => ({
                        ...prev,
                        password: event.target.value,
                      }))
                    }
                    placeholder="Password"
                    required
                    minLength={4}
                  />
                </label>
              </div>

              <div className="dividerText">or continue with</div>

              <div className="socialAuth">
                <button type="button" onClick={() => handleSocialAuth("google")}>
                  <span>G</span>
                  Continue with Gmail
                </button>
                <button type="button" onClick={() => handleSocialAuth("meta")}>
                  <span>f</span>
                  Continue with Meta
                </button>
              </div>

              <div className="modalActions">
                <button
                  type="button"
                  className="navButton"
                  onClick={() => setAuthModalMode(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="navButton navButtonPrimary">
                  {authModalMode === "login" ? "Login" : "Create Account"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
};

export default App;
