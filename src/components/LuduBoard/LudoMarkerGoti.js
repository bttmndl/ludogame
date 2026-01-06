import React, { memo, useEffect, useRef, useState } from "react";

/* ---------------- JUMP + SQUASH HELPER ---------------- */
function getJumpTransform(from, to, t) {
  // ease-in-out
  const ease =
    t < 0.5
      ? 2 * t * t
      : 1 - Math.pow(-2 * t + 2, 2) / 2;

  const x = from.x + (to.x - from.x) * ease;
  const y = from.y + (to.y - from.y) * ease;

  // jump arc
  const jumpHeight = 28;
  const lift = Math.sin(Math.PI * t) * jumpHeight;

  // squash on landing
  let scaleX = 1;
  let scaleY = 1;

  if (t > 0.85) {
    const squash = (t - 0.85) / 0.15;
    scaleX = 1 + squash * 0.25;
    scaleY = 1 - squash * 0.25;
  }

  return {
    x,
    y: y - lift,
    scaleX,
    scaleY,
  };
}

/* ---------------- COMPONENT ---------------- */
function LudoMarkerGoti({
  numberWiseColor,
  polygonData,
  markers,
  playerCount,
}) {
  const [currentBox, setCurrentBox] = useState(45);
  const [toggle, setToggle] = useState(true);

  const rafRef = useRef(null);

  /* ---------------- JUMP ANIMATION ---------------- */
  useEffect(() => {
    if (!polygonData?.length || !markers?.length) return;
    if (currentBox === null) return;

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
    const duration = 240;

    function frame(time) {
      if (!start) start = time;
      const t = Math.min((time - start) / duration, 1);

      markers[currentBox].__jump = getJumpTransform(from, to, t);

      setToggle((p) => !p);

      if (t < 1) {
        rafRef.current = requestAnimationFrame(frame);
      } else {
        delete markers[currentBox].__jump;
        setCurrentBox(nextBox);
      }
    }

    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, [currentBox, markers, polygonData, playerCount]);

  /* ---------------- SAFE RENDER ---------------- */
  if (!polygonData?.length || !markers?.length) return null;

  const marker = markers[currentBox];
  if (!marker) return null;

  /* ---------------- RADIUS ---------------- */
  const { x: x1, y: y1 } = polygonData[0];
  const { x: x2, y: y2 } = polygonData[1];
  const boxRadius =
    Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2) / 3;

  const baseX = marker.headCircle[0];
  const baseY = marker.headCircle[1];
  const jump = marker.__jump;

  /* ---------------- RENDER ---------------- */
  return (
    <g
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
      {/* Polygon (carrier) */}
      <polygon
        points={marker.headCoordinates}
        fill="white"
        stroke="black"
        strokeWidth="1"
      />

      {/* Circle fixed inside polygon */}
      <circle
        cx={baseX}
        cy={baseY}
        r={(toggle ? 4 : 0) + boxRadius}
        fill={
          numberWiseColor[
            (Math.floor(currentBox / 18) + 1) % 6
          ]
        }
        stroke="black"
        strokeWidth="1"
      />
    </g>
  );
}

export default memo(LudoMarkerGoti);
