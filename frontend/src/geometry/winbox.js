export function generateWinBoxCord(polygonData, polygonDataSmall) {
    let res = [];
    for (let i = 0; i < polygonData.length; i += 3) {
      const { x: x1, y: y1 } = polygonData[i];
      const { x: x2, y: y2 } = polygonDataSmall[i];
      const { x: x3, y: y3 } = polygonDataSmall[(i + 3) % polygonData.length];
      const { x: x4, y: y4 } = polygonData[(i + 3) % polygonData.length];

      res.push(`${x1},${y1} ${x2},${y2} ${x3},${y3} ${x4},${y4}`);
    }
    return res;
  }