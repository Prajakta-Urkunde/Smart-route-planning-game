import React from "react";

function GraphView({ nodes, edges, onSelect, path = [], animatedPath = [] }) {

  const radius = 150;
  const centerX = 300;
  const centerY = 200;

  const nodePositions = {};
  for (let i = 0; i < nodes; i++) {
    const angle = (2 * Math.PI * i) / nodes;
    nodePositions[i] = {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  }

  const isAnimated = (u,v) =>
    animatedPath.some(([a,b]) =>
      (a===u && b===v) || (a===v && b===u)
    );

  return (
    <svg width="600" height="400">

      {edges.map(([u,v,w],i)=>{

        const midX = (nodePositions[u].x + nodePositions[v].x)/2;
        const midY = (nodePositions[u].y + nodePositions[v].y)/2;

        return (
          <g key={i}>
            <line
              x1={nodePositions[u].x}
              y1={nodePositions[u].y}
              x2={nodePositions[v].x}
              y2={nodePositions[v].y}
              stroke={isAnimated(u,v) ? "#ff00ff" : "#00f7ff"}
              strokeWidth="2"
            />

            <text x={midX} y={midY} fill="blue" fontSize="12">
              {w}
            </text>
          </g>
        );
      })}

      {Object.keys(nodePositions).map(k=>(
        <g key={k}>
          <circle
            cx={nodePositions[k].x}
            cy={nodePositions[k].y}
            r="18"
            fill={path.includes(Number(k)) ? "#ff00ff" : "#001f2f"}
            onClick={()=>onSelect(Number(k))}
            style={{cursor:"pointer"}}
          />
          <text
            x={nodePositions[k].x - 6}
            y={nodePositions[k].y + 5}
            fill="#ffffff"
            stroke="#000"
            strokeWidth="0.5"
            fontWeight="bold"
            fontSize="14"
            >
                {k}
            </text>
        </g>
      ))}

    </svg>
  );
}

export default React.memo(GraphView);