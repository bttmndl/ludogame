export function generateCircleCordForPlayer(triangleCoordsArray) {
    return triangleCoordsArray.map((cord) => {
      return calculateInnerEquilateralTriangle(cord);
    });

    function calculateInnerEquilateralTriangle(vertices) {
      const center = calculateCenter(vertices);

      // Calculate the coordinates of the midpoints between the center and the vertices
      const p1 = [
        (vertices[0][0] + center[0]) / 2,
        (vertices[0][1] + center[1]) / 2,
      ];

      const p2 = [
        (vertices[1][0] + center[0]) / 2,
        (vertices[1][1] + center[1]) / 2,
      ];

      const p3 = [
        (vertices[2][0] + center[0]) / 2,
        (vertices[2][1] + center[1]) / 2,
      ];

      return [p1, p2, p3, center];
    }

    function calculateCenter(vertices) {
      // Calculate the average x and y coordinates of the vertices
      const sumX = vertices.reduce((sum, vertex) => sum + vertex[0], 0);
      const sumY = vertices.reduce((sum, vertex) => sum + vertex[1], 0);
      const centerX = sumX / vertices.length;
      const centerY = sumY / vertices.length;
      return [centerX, centerY];
    }
  }