const { useRef, useEffect } = React;

const ClaudeHexagon = () => {
  const canvasRef = useRef(null);
  const ballRef = useRef({
    x: 200,
    y: 200,
    vx: 3,
    vy: 0,
    radius: 10
  });
  const hexagonRef = useRef({
    angle: 0,
    radius: 160,
    rotation: 0.5 * Math.PI / 180
  });

  const drawHexagon = (ctx, center, radius, angle) => {
    ctx.beginPath();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    
    for (let i = 0; i < 6; i++) {
      const theta = angle + (i * Math.PI / 3);
      const x = center.x + radius * Math.cos(theta);
      const y = center.y + radius * Math.sin(theta);
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.closePath();
    ctx.stroke();
  };

  const checkHexagonCollision = (ball, hexagon) => {
    const center = { x: 200, y: 200 };
    
    for (let i = 0; i < 6; i++) {
      const theta1 = hexagon.angle + (i * Math.PI / 3);
      const theta2 = hexagon.angle + ((i + 1) * Math.PI / 3);
      
      const p1 = {
        x: center.x + hexagon.radius * Math.cos(theta1),
        y: center.y + hexagon.radius * Math.sin(theta1)
      };
      
      const p2 = {
        x: center.x + hexagon.radius * Math.cos(theta2),
        y: center.y + hexagon.radius * Math.sin(theta2)
      };

      // Line segment vector
      const segmentX = p2.x - p1.x;
      const segmentY = p2.y - p1.y;
      const length = Math.sqrt(segmentX * segmentX + segmentY * segmentY);
      
      // Normalized perpendicular vector
      const nx = -segmentY / length;
      const ny = segmentX / length;
      
      // Vector from line to ball
      const dx = ball.x - p1.x;
      const dy = ball.y - p1.y;
      
      // Distance from line
      const distance = dx * nx + dy * ny;
      
      if (Math.abs(distance) < ball.radius) {
        // Project ball's velocity onto the normal
        const dotProduct = ball.vx * nx + ball.vy * ny;
        
        // Apply bounce with energy loss
        ball.vx -= 2 * dotProduct * nx * 0.8;
        ball.vy -= 2 * dotProduct * ny * 0.8;
        
        // Move ball out of collision
        ball.x += nx * (ball.radius - Math.abs(distance));
        ball.y += ny * (ball.radius - Math.abs(distance));
        
        return true;
      }
    }
    return false;
  };

  const animate = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const ball = ballRef.current;
    const hexagon = hexagonRef.current;

    // Clear canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw rotating hexagon
    drawHexagon(ctx, { x: 200, y: 200 }, hexagon.radius, hexagon.angle);
    hexagon.angle += hexagon.rotation;

    // Update ball position with gravity
    ball.vy += 0.5; // Gravity
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Check collision
    checkHexagonCollision(ball, hexagon);

    // Draw ball
    ctx.beginPath();
    ctx.fillStyle = 'red';
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();

    requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 400;
    canvas.height = 400;
    
    // Start animation
    animate();
  }, []);

  return (
    React.createElement('div', { className: 'w-[400px] h-[400px]' },
      React.createElement('canvas', { ref: canvasRef, className: 'border border-gray-300' })
    )
  );
};

window.ClaudeHexagon = ClaudeHexagon;