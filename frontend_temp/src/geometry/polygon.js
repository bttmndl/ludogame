export function generatePolygonCordinates(cx, cy, sides, size) {
  const points = [];
  const angleStep = (2 * Math.PI) / sides;

  const x0 = cx + size * Math.cos(0);
  const y0 = cy + size * Math.sin(0);
  points.push({ x: x0, y: y0 });

  for (let i = 1; i < sides; i++) {
    const x = cx + size * Math.cos(i * angleStep);
    const y = cy + size * Math.sin(i * angleStep);

    const [m1, n1, m2, n2] = splitLine(points.at(-1), { x, y });
    points.push({ x: m1, y: n1 }, { x: m2, y: n2 }, { x, y });
  }

  const [m1, n1, m2, n2] = splitLine(points.at(-1), points[0]);
  points.push({ x: m1, y: n1 }, { x: m2, y: n2 });

  return points;
}

function splitLine(p1, p2) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return [
    p1.x + dx / 3,
    p1.y + dy / 3,
    p1.x + (2 * dx) / 3,
    p1.y + (2 * dy) / 3,
  ];
}
