export function generateTriangleCordForPlayerBox(lineCoordinates) {
    const resultCordinatesString = [];
    const resultCordinatesArray = [];
    const cord = lineCoordinates.filter((_, i) => i % 4 === 0 || i % 4 === 1);

    for (let idx = 0; idx < cord.length; idx += 2) {
      const [p1, p2] = cord[idx][0];
      const [q1, q2] = cord[idx][6];
      const [r1, r2] = cord[(idx + 1) % cord.length][6];

      const point = `${p1},${p2} ${q1},${q2} ${r1},${r2}`;
      resultCordinatesArray.push([
        [p1, p2],
        [q1, q2],
        [r1, r2],
      ]);
      resultCordinatesString.push(point);
    }

    return [resultCordinatesArray, resultCordinatesString];
  }