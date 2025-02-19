const { useRef, useEffect } = React;

const BouncingBall = () => {
    const canvasRef = React.useRef(null);
    const animationRef = React.useRef(null);
    const rotationRef = React.useRef(0);
    
    const stateRef = React.useRef({
      pos: { x: 200, y: 200 },
      vel: { x: 3, y: 0 },
      gravity: 0.5,
      dampen: 0.8,
      radius: 10,
      hexRadius: 160
    });
  
    const getHexagonPoints = (angle) => {
      const points = [];
      const center = { x: 200, y: 200 };
      for (let i = 0; i < 6; i++) {
        const theta = angle + (i * Math.PI / 3);
        points.push({
          x: center.x + stateRef.current.hexRadius * Math.sin(theta),
          y: center.y + stateRef.current.hexRadius * Math.cos(theta)
        });
      }
      return points;
    };
  
    const checkCollision = (ctx) => {
      const points = getHexagonPoints(rotationRef.current * Math.PI / 180);
      const ball = stateRef.current;
      
      for (let i = 0; i < 6; i++) {
        const p1 = points[i];
        const p2 = points[(i+1)%6];
        
        // Line equation: ax + by + c = 0
        const a = p2.y - p1.y;
        const b = p1.x - p2.x;
        const c = p2.x * p1.y - p1.x * p2.y;
        
        // Distance from ball center to line
        const dist = (a * ball.pos.x + b * ball.pos.y + c) / Math.sqrt(a*a + b*b);
        
        if (Math.abs(dist) <= ball.radius) {
          // Reflect velocity vector
          const normal = { x: a, y: b };
          const dot = ball.vel.x * normal.x + ball.vel.y * normal.y;
          ball.vel.x = (ball.vel.x - 2 * dot * normal.x / (normal.x**2 + normal.y**2)) * ball.dampen;
          ball.vel.y = (ball.vel.y - 2 * dot * normal.y / (normal.x**2 + normal.y**2)) * ball.dampen;
        }
      }
    };
  
    const animate = () => {
      const ctx = canvasRef.current.getContext('2d');
      const ball = stateRef.current;
      
      // Clear canvas
      ctx.clearRect(0, 0, 400, 400);
      
      // Draw hexagon
      ctx.save();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.beginPath();
      const points = getHexagonPoints(rotationRef.current * Math.PI / 180);
      points.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
      
      // Update physics
      ball.vel.y += ball.gravity;
      ball.pos.x += ball.vel.x;
      ball.pos.y += ball.vel.y;
      
      // Check collisions
      checkCollision(ctx);
      
      // Draw ball
      ctx.beginPath();
      ctx.arc(ball.pos.x, ball.pos.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'blue';
      ctx.fill();
      
      rotationRef.current += 0.5;
      animationRef.current = requestAnimationFrame(animate);
    };
  
    React.useEffect(() => {
      animationRef.current = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationRef.current);
    }, []);
  
    return (
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        style={{ backgroundColor: 'black' }}
      />
    );
  };
  
  window.DeepSeekHexagon = BouncingBall;
  