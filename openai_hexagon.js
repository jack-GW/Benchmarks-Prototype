function OpenAIHexagon() {
    // Create a ref for the canvas element.
    const canvasRef = React.useRef(null);
    
    React.useEffect(() => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      
      // Ball properties
      let ball = { x: 200, y: 200, vx: 3, vy: 0 };
      const ballRadius = 10;
      // Hexagon properties
      const hexagonCenter = { x: 200, y: 200 };
      const hexagonRadius = 160;
      const hexagonSides = 6;
      let hexAngle = 0; // current rotation angle in radians
      
      let animationFrameId;

      function animate() {
        // 1. Clear canvas with a black background.
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, 400, 400);
        
        // 2. Update hexagon rotation angle (0.5° per frame).
        hexAngle += 0.5 * (Math.PI / 180);
        
        // 2.a Calculate hexagon vertices based on current rotation.
        const vertices = [];
        for (let i = 0; i < hexagonSides; i++) {
          // Calculate the angle for this vertex.
          const theta = hexAngle + (2 * Math.PI * i) / hexagonSides;
          const x = hexagonCenter.x + hexagonRadius * Math.cos(theta);
          const y = hexagonCenter.y + hexagonRadius * Math.sin(theta);
          vertices.push({ x, y });
        }
        
        // 2.b Draw the hexagon (white outline, 2px line width, no fill).
        ctx.beginPath();
        ctx.moveTo(vertices.x, vertices.y);
        for (let i = 1; i < vertices.length; i++) {
          ctx.lineTo(vertices[i].x, vertices[i].y);
        }
        ctx.closePath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "white";
        ctx.stroke();
        
        // 3. Update ball position with physics:
        ball.vy += 0.5;          // gravity: 0.5px/frame²
        ball.x += ball.vx;
        ball.y += ball.vy;
        
        // 4. Check for collision with each hexagon side.
        // For every edge (from vertex A to B) of the hexagon we:
        // - Compute the projection of the ball’s center onto the edge.
        // - Compute the distance to that edge.
        // - If the distance is less than ball’s radius we move the ball out and reflect its velocity.
        for (let i = 0; i < vertices.length; i++) {
          const next = (i + 1) % vertices.length;
          const A = vertices[i];
          const B = vertices[next];
          
          // Vector AB (edge) and vector from A to ball.
          const ABx = B.x - A.x;
          const ABy = B.y - A.y;
          const ballAx = ball.x - A.x;
          const ballAy = ball.y - A.y;
          
          // Project the ball’s center onto the edge to compute parameter t.
          let t = (ballAx * ABx + ballAy * ABy) / (ABx * ABx + ABy * ABy);
          t = Math.max(0, Math.min(1, t));
          
          // Closest point on the edge.
          const projX = A.x + t * ABx;
          const projY = A.y + t * ABy;
          
          // Distance from ball center to the edge.
          const dx = ball.x - projX;
          const dy = ball.y - projY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          // If the ball is penetrating the hexagon side, handle collision.
          if (dist < ballRadius) {
            const penetration = ballRadius - dist;
            // Normalize the vector (dx, dy) to get collision normal.
            const normX = dx / (dist || 0.0001);
            const normY = dy / (dist || 0.0001);
            // Correct the ball's position so it is exactly ballRadius away.
            ball.x += normX * penetration;
            ball.y += normY * penetration;
            
            // Reflect the ball's velocity only if it is moving toward the wall.
            const dot = ball.vx * normX + ball.vy * normY;
            if (dot < 0) {
              ball.vx = (ball.vx - 2 * dot * normX) * 0.8;
              ball.vy = (ball.vy - 2 * dot * normY) * 0.8;
            }
          }
        }
        
        // 5. Draw the ball (green with color #006400, radius 10px).
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = "#006400";
        ctx.fill();
        
        // 6. Request next frame.
        animationFrameId = requestAnimationFrame(animate);
      }
      
      // Begin animation.
      animate();
      
      // Cleanup on component unmount.
      return () => cancelAnimationFrame(animationFrameId);
    }, []);
    
    return <canvas ref={canvasRef} width={400} height={400} />;
  }
  
  // Export the component as window.OpenAIHexagon.
  window.OpenAIHexagon = OpenAIHexagon;
