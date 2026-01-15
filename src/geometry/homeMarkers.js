export function generateHomeDropdownMarker(circleCoordinates) {
    return circleCoordinates.map((cord) => cord.map((c)=>generateCords(c)));

    function generateCords(point) {
      

      const [midX,midY] = point;

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