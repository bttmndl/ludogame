import React, { memo, useEffect, useRef, useState } from "react";

/* ---------------- OFFSET HELPER ---------------- */
function getGotiOffset(index, total) {
  if (total === 1) return { dx: 0, dy: 0 };

  const radius = 12;
  const angle = (2 * Math.PI * index) / total;

  return {
    dx: Math.cos(angle) * radius,
    dy: Math.sin(angle) * radius,
  };
}

/* ---------------- JUMP + SQUASH ---------------- */
function getJumpTransform(from, to, t) {
  const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

  const x = from.x + (to.x - from.x) * ease;
  const y = from.y + (to.y - from.y) * ease;

  const lift = Math.sin(Math.PI * t) * 28;

  let scaleX = 1;
  let scaleY = 1;

  if (t > 0.85) {
    const squash = (t - 0.85) / 0.15;
    scaleX = 1 + squash * 0.25;
    scaleY = 1 - squash * 0.25;
  }

  return { x, y: y - lift, scaleX, scaleY };
}

function parsePoints(points) {
  return points.split(" ").map((point) => {
    const [x, y] = point.split(",").map(Number);
    return { x, y };
  });
}

function pointInQuad([p1, p2, p3, p4], u, v) {
  return {
    x:
      (1 - u) * (1 - v) * p1.x +
      (1 - u) * v * p2.x +
      u * v * p3.x +
      u * (1 - v) * p4.x,
    y:
      (1 - u) * (1 - v) * p1.y +
      (1 - u) * v * p2.y +
      u * v * p3.y +
      u * (1 - v) * p4.y,
  };
}

function finishedGotiLabel(goti) {
  const gotiIndex = Number(String(goti.id).split("-")[1]);
  return Number.isInteger(gotiIndex) ? `G${gotiIndex + 1}` : "G";
}

/* ---------------- COMPONENT ---------------- */
function LudoMarkerGoti({
  winBoxCordLine,
  gotis,
  markers,
  homeMarkers,
  circleCoordinates,
  moveRequest,
  onMoveComplete,
  numberWiseColor,
  currentPlayer,
  localPlayerId,
  handleAnimation,
  PLAYERS,
}) {
  const [activeGotiId, setActiveGotiId] = useState(null);
  const [stepsLeft, setStepsLeft] = useState(0);
  const [animatedBox, setAnimatedBox] = useState(null);
  const [movePath, setMovePath] = useState([]);
  const [jumpState, setJumpState] = useState(null);

  const rafRef = useRef(null);

  /* ---------- INIT MOVE ---------- */
  useEffect(() => {
    if (!moveRequest) return;

    const g = gotis.find((g) => g.id === moveRequest.gotiId);
    const player = PLAYERS.find((p) => p.id === g.playerId);

    if (!g) return;

    setActiveGotiId(moveRequest.gotiId);
    setStepsLeft(moveRequest.steps);
    setMovePath(moveRequest.path || []);

    if (g.position === -1) {
      setAnimatedBox(player.start - 1);
    } else {
      setAnimatedBox(g.position);
    }
  }, [moveRequest, gotis, PLAYERS]);

  /* ---------- STEP BY STEP MOVE ---------- */
  useEffect(() => {
    if (!activeGotiId || stepsLeft <= 0 || animatedBox === null) return;

    const fromBox = animatedBox;
    const nextBox = movePath[0];

    if (!markers[fromBox] || !markers[nextBox]) {
      // Safety check: if markers are missing, finish animation immediately
      setAnimatedBox(nextBox);
      setStepsLeft(0);
      setMovePath([]);
      onMoveComplete(activeGotiId, nextBox);
      setActiveGotiId(null);
      return;
    }

    const from = {
      x: markers[fromBox].headCircle[0],
      y: markers[fromBox].headCircle[1],
    };

    const to = {
      x: markers[nextBox].headCircle[0],
      y: markers[nextBox].headCircle[1],
    };

    let start = null;
    const duration = 260;

    function frame(time) {
      if (!start) start = time;
      const t = Math.min((time - start) / duration, 1);

      setJumpState(getJumpTransform(from, to, t));

      if (t < 1) {
        rafRef.current = requestAnimationFrame(frame);
      } else {
        setJumpState(null);
        setAnimatedBox(nextBox);
        setStepsLeft((s) => s - 1);
        setMovePath((path) => path.slice(1));

        if (stepsLeft === 1) {
          onMoveComplete(activeGotiId, nextBox);
          setMovePath([]);
          setActiveGotiId(null);
        }
      }
    }

    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, [
    activeGotiId,
    stepsLeft,
    animatedBox,
    movePath,
    markers,
    onMoveComplete,
    gotis,
    moveRequest,
    currentPlayer,
  ]);

  function isSelectable(goti) {
    return (
      goti.playerId === currentPlayer &&
      goti.playerId === localPlayerId &&
      !goti.finished
    );
  }

  /* ---------- GROUP GOTIS ---------- */
  const boardGotisByCell = {};
  const homeGotisByPlayer = {};
  const winGotisByPlayer = {};

  gotis.forEach((g) => {
    // ✅ If this goti is animating from home, treat it as if it's on the board
    if (g.id === activeGotiId && g.position === -1 && animatedBox !== null) {
      if (!boardGotisByCell[animatedBox]) boardGotisByCell[animatedBox] = [];
      boardGotisByCell[animatedBox].push(g);
    } else if (g.finished) {
      if (!winGotisByPlayer[g.playerId]) winGotisByPlayer[g.playerId] = [];
      winGotisByPlayer[g.playerId].push(g);
    } else if (g.position >= 0) {
      if (!boardGotisByCell[g.position]) boardGotisByCell[g.position] = [];
      boardGotisByCell[g.position].push(g);
    } else {
      if (!homeGotisByPlayer[g.playerId]) homeGotisByPlayer[g.playerId] = [];
      homeGotisByPlayer[g.playerId].push(g);
    }
  });
  console.log("homeGotisByPlayer", homeGotisByPlayer);
  console.log("goti", gotis);
  console.log("boardGotisByCell", boardGotisByCell);
  /* ---------- RENDER ---------- */
  return (
    <>
      {/* -------- HOME GOTIS (TRIANGLE) -------- */}
      {Object.entries(homeGotisByPlayer).map(([playerId, homeGotis]) => {
        const circles = circleCoordinates[playerId];
        if (!circles) return null;

        return homeGotis.map((goti, index) => {
          const [x, y] = circles[index];
          const homeMarker = homeMarkers[playerId][index];

          return (
            <g key={goti.id}>
              <polygon
                points={homeMarker.headCoordinates}
                fill="grey"
                stroke="black"
              />

              <circle
                cx={x - 40}
                cy={y}
                r={13}
                fill={numberWiseColor[goti.playerId]}
                stroke="black"
                style={{
                  cursor: isSelectable(goti) ? "pointer" : "default",
                  opacity: isSelectable(goti) ? 1 : 0.4,
                }}
                onClick={() => {
                  if (!isSelectable(goti) || moveRequest) return;
                  handleAnimation(goti.id);
                }}
              />
            </g>
          );
        });
      })}

      {/* -------- FINISHED GOTIS (CENTER WIN BOX) -------- */}
      {Object.entries(winGotisByPlayer).map(([playerId, winGotis]) => {
        const numericPlayerId = Number(playerId);
        const playerCount = numberWiseColor.length;
        const winBoxIndex = (numericPlayerId - 1 + playerCount) % playerCount;
        const winBox = winBoxCordLine?.[winBoxIndex];
        if (!winBox) return null;

        const quad = parsePoints(winBox);
        const slots = [
          [0.34, 0.36],
          [0.66, 0.36],
          [0.34, 0.68],
          [0.66, 0.68],
        ];

        return winGotis.map((goti, index) => {
          const [u, v] = slots[index % slots.length];
          const { x, y } = pointInQuad(quad, u, v);

          return (
            <g key={goti.id}>
              <circle
                cx={x}
                cy={y}
                r={12}
                fill={numberWiseColor[goti.playerId]}
                stroke="black"
                strokeWidth="1.5"
              />
              <text
                x={x}
                y={y + 4}
                textAnchor="middle"
                fontSize="9"
                fontWeight="900"
                fill="white"
                stroke="rgba(0,0,0,0.42)"
                strokeWidth="0.45"
                paintOrder="stroke"
              >
                {finishedGotiLabel(goti)}
              </text>
            </g>
          );
        });
      })}

      {/* -------- BOARD GOTIS -------- */}
      {Object.entries(boardGotisByCell).map(([boxIndex, cellGotis]) => {
        const marker = markers[boxIndex];
        if (!marker) return null;

        const baseX = marker.headCircle[0];
        const baseY = marker.headCircle[1];

        return cellGotis.map((goti, index) => {
          const { dx, dy } = getGotiOffset(index, cellGotis.length);
          const isActive = goti.id === activeGotiId;
          const jump = isActive ? jumpState : null;
          let transform = undefined;

          if (isActive) {
            if (jump) {
              transform = `
                    translate(${jump.x - baseX}, ${jump.y - baseY})
                    translate(${baseX}, ${baseY})
                    scale(${jump.scaleX}, ${jump.scaleY})
                    translate(${-baseX}, ${-baseY})
                  `;
            } else if (
              animatedBox !== null &&
              animatedBox !== boxIndex &&
              markers[animatedBox]
            ) {
              // Keep position between steps
              const dest = markers[animatedBox].headCircle;
              transform = `translate(${dest[0] - baseX}, ${dest[1] - baseY})`;
            }
          }

          return (
            <g key={goti.id} transform={transform}>
              {jump && (
                <ellipse
                  cx={baseX + dx}
                  cy={baseY + dy + 6}
                  rx={12}
                  ry={5}
                  fill="rgba(0,0,0,0.25)"
                />
              )}

              <polygon
                points={marker.headCoordinates}
                fill="white"
                stroke="black"
              />

              <circle
                cx={baseX + dx}
                cy={baseY + dy}
                r={14}
                fill={numberWiseColor[goti.playerId]}
                stroke="black"
                style={{
                  cursor: isSelectable(goti) ? "pointer" : "default",
                  opacity: isSelectable(goti) ? 1 : 0.4,
                }}
                onClick={() => {
                  if (!isSelectable(goti) || moveRequest) return;
                  handleAnimation(goti.id); // already exists in board
                }}
              />
            </g>
          );
        });
      })}
    </>
  );
}

export default memo(LudoMarkerGoti);
