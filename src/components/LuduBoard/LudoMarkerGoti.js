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
    if (!g || g.position < 0) return;

    setActiveGotiId(moveRequest.gotiId);
    setStepsLeft(moveRequest.steps);
    setAnimatedBox(g.position);
  }, [moveRequest, gotis]);

  /* ---------- STEP BY STEP MOVE ---------- */
  useEffect(() => {
    if (!activeGotiId || stepsLeft <= 0 || animatedBox === null) return;

    const fromBox = animatedBox;
    const nextBox = (fromBox + 1) % (playerCount * 18);

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
  ]);

  /* ---------- GROUP GOTIS ---------- */
  const boardGotisByCell = {};
  const homeGotisByPlayer = {};

  gotis.forEach((g) => {
    if (g.position >= 0) {
      if (!boardGotisByCell[g.position]) boardGotisByCell[g.position] = [];
      boardGotisByCell[g.position].push(g);
    } else {
      if (!homeGotisByPlayer[g.playerId]) homeGotisByPlayer[g.playerId] = [];
      homeGotisByPlayer[g.playerId].push(g);
    }
  });

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
            <g>
              <polygon
                points={homeMarker.headCoordinates}
                fill="white"
                stroke="black"
              />

              <circle
                cx={x}
                cy={y}
                r={14}
                fill={numberWiseColor[goti.playerId]}
                stroke="black"
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

          return (
            <g
              key={goti.id}
              transform={
                jump
                  ? `
                    translate(${jump.x - baseX}, ${jump.y - baseY})
                    translate(${baseX}, ${baseY})
                    scale(${jump.scaleX}, ${jump.scaleY})
                    translate(${-baseX}, ${-baseY})
                  `
                  : undefined
              }
            >
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
              />
            </g>
          );
        });
      })}
    </>
  );
}

export default memo(LudoMarkerGoti);
