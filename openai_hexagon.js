const { useRef, useEffect } = React;
const OpenAI_Hexagon = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    
    // Ball state: starting at center with initial velocity.
    const ball = { x: 200, y: 200, vx: 2, vy: -2 };
    const ballRadius = 10;
    // Gravity acceleration and restitution coefficient for bounces.
    const g = 0.5;
    const restitution = 0.9;
    
    // Hexagon parameters.
    const center = { x: 200, y: 200 };
    const hexagonRadius = 150; // distance from center to vertex
    const lineWidth = 3;
    let hexagonAngle = 0;
    const hexagonAngularVelocity = 0.01; // rotation speed in radians per frame
    
    // Compute vertices of a regular hexagon given a center, radius, and rotation angle.
    function getHexagonVertices(cx, cy, radius, rotation) {
      const vertices = [];
      for (let i = 0; i < 6; i++) {
        const angle = rotation + (Math.PI / 3) * i;
        vertices.push({
          x: cx + radius * Math.cos(angle),
          y: cy + radius * Math.sin(angle)
        });
      }
      return vertices;
    }
    
    // For a given edge from point A to B, compute the signed distance from a point
    // to the line defined by A and B, and the inward normal of the edge.
    function getEdgeCollisionData(A, B, point) {
      const edgeVec = { x: B.x - A.x, y: B.y - A.y };
      // Compute a perpendicular vector.
      let normal = { x: -edgeVec.y, y: edgeVec.x };
      const len = Math.hypot(normal.x, normal.y);
      if (len === 0) return { distance: Infinity, normal: { x: 0, y: 0 } };
      normal.x /= len;
      normal.y /= len;
      // Ensure the normal points inward by comparing to the vector from A to the hexagon center.
      const toCenter = { x: center.x - A.x, y: center.y - A.y };
      if (normal.x * toCenter.x + normal.y * toCenter.y < 0) {
        normal.x = -normal.x;
        normal.y = -normal.y;
      }
      // Compute the signed distance from the point to the line.
      const dx = point.x - A.x;
      const dy = point.y - A.y;
      const distance = dx * normal.x + dy * normal.y;
      return { distance, normal };
    }
    
    // Main animation loop.
    function render() {
      // Update ball physics.
      ball.vy += g; // apply gravity
      ball.x += ball.vx;
      ball.y += ball.vy;
      
      // Update hexagon rotation.
      hexagonAngle += hexagonAngularVelocity;
      const hexVertices = getHexagonVertices(center.x, center.y, hexagonRadius, hexagonAngle);
      
      // Collision detection for each hexagon edge.
      for (let i = 0; i < 6; i++) {
        const A = hexVertices[i];
        const B = hexVertices[(i + 1) % 6];
        const { distance, normal } = getEdgeCollisionData(A, B, ball);
        if (distance < ballRadius) {
          // Reposition ball to avoid clipping.
          const penetration = ballRadius - distance;
          ball.x += normal.x * penetration;
          ball.y += normal.y * penetration;
          // Reflect the ball's velocity if it's moving toward the edge.
          const dot = ball.vx * normal.x + ball.vy * normal.y;
          if (dot < 0) {
            ball.vx = ball.vx - (1 + restitution) * dot * normal.x;
            ball.vy = ball.vy - (1 + restitution) * dot * normal.y;
          }
        }
      }
      
      // Draw the background.
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw the rotating hexagon.
      ctx.strokeStyle = "white";
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      ctx.moveTo(hexVertices[0].x, hexVertices[0].y);
      for (let i = 1; i < hexVertices.length; i++) {
        ctx.lineTo(hexVertices[i].x, hexVertices[i].y);
      }
      ctx.closePath();
      ctx.stroke();
      
      // Draw the bouncing ball.
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
      ctx.fill();
      
      animationFrameId = requestAnimationFrame(render);
    }
    
    render();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return React.createElement("canvas", { ref: canvasRef, width: 400, height: 400 });
};
window.OpenAI_Hexagon = OpenAI_Hexagon;
