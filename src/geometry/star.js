export function generateStarPolygon(boxes, playerCount) {
    return boxes
      .filter((_, idx) => idx % 18 === 3)
      .map((cord, idx) => generateCords(cord, idx));

    function generateCords(coordinates, idx) {
      // Split the coordinates string into an array of values
      const coordsArray = coordinates
        .split(" ")
        .map((coord) => coord.split(",").map(parseFloat));

      const outerRange =
        idx === 0 ||
        idx === playerCount / 2 ||
        idx === playerCount / 2 - 1 ||
        idx === playerCount - 1
          ? 2 * playerCount * 0.16
          : 1;

      // Destructure the coordinates into individual variables
      const [x1, y1, x2, y2, x3, y3, x4, y4] = coordsArray.flat();

      // Calculate the center of the rectangle
      const centerX = (x1 + x3) / 2;
      const centerY = (y1 + y3) / 2;

      // Calculate the width and height of the rectangle
      const width = Math.abs(x2 - x1);
      const height = Math.abs(y4 - y1);

      // Calculate the maximum radius that will fit within the rectangle
      const maxRadius = Math.min(width / 2, height / 2);

      // Define the number of points for the star
      const numPoints = 5;

      // Define the length of the inner and outer points based on maxRadius
      const innerRadius = maxRadius / 2; // Adjust this value for the inner radius
      const outerRadius = maxRadius * outerRange; // Adjust this value for the outer radius

      // Initialize an array to store the polygon points
      const points = [];

      for (let i = 0; i < numPoints * 2; i++) {
        const angle = (i * Math.PI) / numPoints; // Angle between points

        // Calculate coordinates for inner and outer points
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const pointX = centerX + radius * Math.cos(angle);
        const pointY = centerY + radius * Math.sin(angle);

        points.push([pointX, pointY]);
      }

      // Convert the points array back to a single string
      const pointsString = points.map((point) => point.join(",")).join(" ");

      return pointsString;
    }
  }
