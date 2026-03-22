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

/* ---------------- COMPONENT ---------------- */
function LudoMarkerGoti({
  gotis,
  markers,
  homeMarkers,
  circleCoordinates,
  moveRequest,
  onMoveComplete,
  numberWiseColor,
  playerCount,
  currentPlayer,
  handleAnimation,
  PLAYERS,
}) {
  const [activeGotiId, setActiveGotiId] = useState(null);
  const [stepsLeft, setStepsLeft] = useState(0);
  const [animatedBox, setAnimatedBox] = useState(null);
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

    if (g.position === -1) {
      setAnimatedBox(player.start - 1);
    } else {
      setAnimatedBox(g.position);
    }
  }, [moveRequest, gotis]);

  /* ---------- STEP BY STEP MOVE ---------- */
  useEffect(() => {
    if (!activeGotiId || stepsLeft <= 0 || animatedBox === null) return;

    const g = gotis.find((g) => g.id === moveRequest.gotiId);
    const player = PLAYERS.find((p) => p.id === g.playerId);

    let fromBox;
    let nextBox;

    fromBox = animatedBox;
    nextBox =
      player.start - g.position <= 12 && player.start - g.position > 0
        ? fromBox + 1
        : fromBox % 18 === 6
          ? (fromBox + 6) % (playerCount * 18)
          : (fromBox + 1) % (playerCount * 18);

    if (!markers[fromBox] || !markers[nextBox]) {
      // Safety check: if markers are missing, finish animation immediately
      setAnimatedBox(nextBox);
      setStepsLeft(0);
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

        if (stepsLeft === 1) {
          onMoveComplete(activeGotiId, nextBox);
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
    markers,
    playerCount,
    onMoveComplete,
    gotis,
    moveRequest,
    currentPlayer,
  ]);

  function isSelectable(goti, currentPlayer) {
    return goti.playerId === currentPlayer && !goti.finished;
  }

  /* ---------- GROUP GOTIS ---------- */
  const boardGotisByCell = {};
  const homeGotisByPlayer = {};

  gotis.forEach((g) => {
    // ✅ If this goti is animating from home, treat it as if it's on the board
    if (g.id === activeGotiId && g.position === -1 && animatedBox !== null) {
      if (!boardGotisByCell[animatedBox]) boardGotisByCell[animatedBox] = [];
      boardGotisByCell[animatedBox].push(g);
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
                  cursor: isSelectable(goti, currentPlayer)
                    ? "pointer"
                    : "default",
                  opacity: isSelectable(goti, currentPlayer) ? 1 : 0.4,
                }}
                onClick={() => {
                  if (!isSelectable(goti, currentPlayer) || moveRequest) return;
                  handleAnimation(goti.id);
                }}
              />
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
                  cursor: isSelectable(goti, currentPlayer)
                    ? "pointer"
                    : "default",
                  opacity: isSelectable(goti, currentPlayer) ? 1 : 0.4,
                }}
                onClick={() => {
                  if (!isSelectable(goti, currentPlayer) || moveRequest) return;
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
