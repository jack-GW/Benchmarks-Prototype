const { useRef, useState, useEffect } = React;

const Deepseek_Pool = () => {
  const canvasRef = useRef(null);
  const requestId = useRef(null);
  const [balls, setBalls] = useState([]);
  const [dragStart, setDragStart] = useState(null);
  const [currentDrag, setCurrentDrag] = useState(null);
  const cueBallIndex = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Initialize balls
    const initialBalls = [];
    // Add cue ball (blue)
    initialBalls.push({ x: 300, y: 300, vx: 0, vy: 0, color: '#00f' });
    
    // Create pyramid rack
    const startX = 200;
    const startY = 100;
    const radius = 10;
    const sqrt3 = Math.sqrt(3);
    
    for(let row = 0; row < 4; row++) {
      for(let i = 0; i <= row; i++) {
        const x = startX + (i - row/2) * (radius * 2 + 2);
        const y = startY + row * (radius * sqrt3);
        initialBalls.push({ x, y, vx: 0, vy: 0, color: '#fff' });
      }
    }

    setBalls(initialBalls);

    const animate = () => {
      updatePhysics();
      draw(ctx);
      requestId.current = requestAnimationFrame(animate);
    };
    
    animate();
    return () => cancelAnimationFrame(requestId.current);
  }, []);

  const updatePhysics = () => {
    setBalls(prevBalls => {
      const newBalls = prevBalls.map(ball => ({ ...ball }));
      const damping = 0.99;
      const radius = 10;

      // Update positions
      newBalls.forEach(ball => {
        ball.x += ball.vx;
        ball.y += ball.vy;

        // Wall collisions
        if(ball.x < radius || ball.x > 400 - radius) ball.vx *= -damping;
        if(ball.y < radius || ball.y > 400 - radius) ball.vy *= -damping;
        
        ball.x = Math.max(radius, Math.min(400 - radius, ball.x));
        ball.y = Math.max(radius, Math.min(400 - radius, ball.y));
        
        // Friction
        ball.vx *= 0.99;
        ball.vy *= 0.99;
      });

      // Ball collisions
      for(let i = 0; i < newBalls.length; i++) {
        for(let j = i + 1; j < newBalls.length; j++) {
          const b1 = newBalls[i];
          const b2 = newBalls[j];
          const dx = b2.x - b1.x;
          const dy = b2.y - b1.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if(distance < radius * 2) {
            const angle = Math.atan2(dy, dx);
            const sin = Math.sin(angle);
            const cos = Math.cos(angle);
            
            // Rotate velocities
            const v1x = b1.vx * cos + b1.vy * sin;
            const v1y = b1.vy * cos - b1.vx * sin;
            const v2x = b2.vx * cos + b2.vy * sin;
            const v2y = b2.vy * cos - b2.vx * sin;

            // Swap velocities (simple collision)
            [b1.vx, b2.vx] = [v2x * cos - v1y * sin, v1x * cos - v2y * sin];
            [b1.vy, b2.vy] = [v1y * cos + v2x * sin, v2y * cos + v1x * sin];

            // Position correction
            const overlap = (radius * 2 - distance) / 2;
            b1.x -= overlap * dx / distance;
            b1.y -= overlap * dy / distance;
            b2.x += overlap * dx / distance;
            b2.y += overlap * dy / distance;
          }
        }
      }
      
      return newBalls;
    });
  };

  const draw = (ctx) => {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, 400, 400);
    
    balls.forEach((ball, index) => {
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, 10, 0, Math.PI * 2);
      ctx.fillStyle = ball.color;
      ctx.fill();
      
      if(index === 0 && currentDrag) {
        ctx.strokeStyle = '#fff';
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(ball.x, ball.y);
        ctx.lineTo(currentDrag.x, currentDrag.y);
        ctx.stroke();
      }
    });
  };

  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Check if clicking cue ball
    const cueBall = balls[0];
    const dx = x - cueBall.x;
    const dy = y - cueBall.y;
    if(Math.sqrt(dx*dx + dy*dy) < 10) {
      setDragStart({ x: cueBall.x, y: cueBall.y });
      setCurrentDrag({ x, y });
    }
  };

  const handleMouseMove = (e) => {
    if(dragStart) {
      const rect = canvasRef.current.getBoundingClientRect();
      setCurrentDrag({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleMouseUp = () => {
    if(dragStart && currentDrag) {
      const cueBall = balls[0];
      const power = 0.15;
      cueBall.vx += (dragStart.x - currentDrag.x) * power;
      cueBall.vy += (dragStart.y - currentDrag.y) * power;
      setDragStart(null);
      setCurrentDrag(null);
    }
  };

  return React.createElement('div', { style: { textAlign: 'center' } },
    React.createElement('canvas', {
      ref: canvasRef,
      width: 400,
      height: 400,
      style: { border: 'none' },
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp
    }),
    React.createElement('p', {
      style: {
        color: 'white',
        fontFamily: 'monospace',
        fontSize: '14px'
      }
    }, 'Click and drag from cue ball to shoot')
  );
};

window.Deepseek_Pool = Deepseek_Pool;
