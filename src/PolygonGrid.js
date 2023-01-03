import React from "react";

function PolygonGrid() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(6, 1fr)",
        gridTemplateRows: "repeat(3, 1fr)",
      }}
    >
      {[...Array(3)].map((_, row) =>
        [...Array(6)].map((_, col) => (
          <svg width="100%" height="100%">
            <polygon
              points="250,250 320,200 195,35 130,80"
              style={{ stroke: "#000", strokeWidth: 2 }}
            />
          </svg>
        ))
      )}
    </div>
  );
}

export default PolygonGrid;
