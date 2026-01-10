import React, { memo, useEffect, useRef, useState } from "react";

/* ---------------- JUMP + SQUASH HELPER ---------------- */
function getJumpTransform(from, to, t) {
  const ease =
    t < 0.5
      ? 2 * t * t
      : 1 - Math.pow(-2 * t + 2, 2) / 2;

  const x = from.x + (to.x - from.x) * ease;
  const y = from.y + (to.y - from.y) * ease;

  const jumpHeight = 28;
  const lift = Math.sin(Math.PI * t) * jumpHeight;

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
  numberWiseColor,
  polygonData,
  markers,
  playerCount,
  moveRequest,
}) {
  const [currentBox, setCurrentBox] = useState(null);
  const [stepsLeft, setStepsLeft] = useState(0);
  const [jumpState, setJumpState] = useState(null);
  const [trail, setTrail] = useState([]);

  const rafRef = useRef(null);

  /* ---------------- INIT MOVE ---------------- */
  useEffect(() => {
    if (!moveRequest) return;

    setCurrentBox(moveRequest.from);
    setStepsLeft(moveRequest.steps);
  }, [moveRequest]);

  /* ---------------- STEP BY STEP MOVE ---------------- */
  useEffect(() => {
    if (stepsLeft <= 0 || currentBox === null) return;

    const from = {
      x: markers[currentBox].headCircle[0],
      y: markers[currentBox].headCircle[1],
    };

    const nextBox = (currentBox + 1) % (playerCount * 18);

    const to = {
      x: markers[nextBox].headCircle[0],
      y: markers[nextBox].headCircle[1],
    };

    let start = null;
    const duration = 260;

    function frame(time) {
      if (!start) start = time;
      const t = Math.min((time - start) / duration, 1);

      const nextJump = getJumpTransform(from, to, t);
      setJumpState(nextJump);

      setTrail((prev) => {
        const updated = [...prev, nextJump];
        return updated.length > 6 ? updated.slice(-6) : updated;
      });

      if (t < 1) {
        rafRef.current = requestAnimationFrame(frame);
      } else {
        setJumpState(null);
        setTrail([]);
        setCurrentBox(nextBox);
        setStepsLeft((s) => s - 1);
      }
    }

    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, [stepsLeft, currentBox, markers, playerCount]);

  if (currentBox === null || !markers[currentBox]) return null;

  const marker = markers[currentBox];
  const baseX = marker.headCircle[0];
  const baseY = marker.headCircle[1];

  return (
    <g
      transform={
        jumpState
          ? `
            translate(${jumpState.x - baseX}, ${jumpState.y - baseY})
            translate(${baseX}, ${baseY})
            scale(${jumpState.scaleX}, ${jumpState.scaleY})
            translate(${-baseX}, ${-baseY})
          `
          : undefined
      }
    >
      {/* Shadow */}
      {jumpState && (
        <ellipse
          cx={baseX}
          cy={baseY + 6}
          rx={14 * (1 - Math.abs(jumpState.y - baseY) / 60)}
          ry={6}
          fill="rgba(0,0,0,0.25)"
        />
      )}

      {/* Motion trail */}
      {trail.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={10 - i}
          fill="rgba(0,0,0,0.15)"
        />
      ))}

      {/* Polygon carrier */}
      <polygon
        points={marker.headCoordinates}
        fill="white"
        stroke="black"
        strokeWidth="1"
      />

      {/* Goti */}
      <circle
        cx={baseX}
        cy={baseY}
        r={14}
        fill={
          numberWiseColor[
            Math.floor(currentBox / 18) % numberWiseColor.length
          ]
        }
        stroke="black"
        strokeWidth="1"
      />
    </g>
  );
}

export default memo(LudoMarkerGoti);
