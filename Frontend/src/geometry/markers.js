export function generateDropdownMarker(boxes) {
    return boxes.map((cord) => generateCords(cord));

    function generateCords(rectanglePoints) {
      //converting cord from string array of floats
      const point = rectanglePoints
        .split(" ")
        .map((cord) => cord.split(","))
        .flat()
        .map((p) => parseFloat(p));

      const [x1, y1, , , x3, y3, , ] = point;

      const midX = (x1 + x3) / 2;
      const midY = (y1 + y3) / 2;

      // Define the size and appearance of the pin drop marker
      const headRadius = 20.3;// calculating radius based on the width of the rectangle
      const leftShift =  55;
      // Generate the coordinates for the pin head
      const headCoordinates = generateCircleCoordinates(
        midX - leftShift,
        midY,
        headRadius,
        leftShift
      );

      return {
        headCoordinates,
        headCircle: [midX - leftShift, midY],
        tailCircle: [midX, midY],
      };
    }

    function generateCircleCoordinates(centerX, centerY, radius, leftShift) {
      const numPoints = 20; // Number of points to approximate the circle
      const points = [];

      //intial marker starting point
      points.push([centerX + leftShift + 4, centerY]);

      for (let i = 0; i < numPoints; i++) {
        if (i >= 4 && i <= 16) {
          const angle = (i * Math.PI * 2) / numPoints;
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);
          points.push([x, y]);
        }
      }
      points.push([centerX + leftShift + 4, centerY]);

      // Convert the points array back to a single string
      const coordinates = points.map((point) => point.join(",")).join(" ");

      return coordinates;
    }
  }