const { useRef, useEffect } = React;

const Claude_Hexagon = () => {
  const canvasRef = useRef(null);
  const requestIdRef = useRef(null);
  
  // Physics and animation state
  const state = useRef({
    ballX: 0,
    ballY: 0,
    velocityX: 2,
    velocityY: 0,
    gravity: 0.5,
    damping: 0.8,
    rotation: 0
  });

  // Initialize the canvas and start animation
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set initial ball position to center
    state.current.ballX = canvas.width / 2;
    state.current.ballY = canvas.height / 2;

    const animate = () => {
      // Clear canvas
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Save context for rotation
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(state.current.rotation);
      
      // Draw hexagon
      ctx.beginPath();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 3;
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI * 2) / 6;
        const x = 150 * Math.cos(angle);
        const y = 150 * Math.sin(angle);
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.stroke();
      
      // Restore context for ball physics
      ctx.restore();
      
      // Update ball physics
      state.current.velocityY += state.current.gravity;
      state.current.ballY += state.current.velocityY;
      state.current.ballX += state.current.velocityX;
      
      // Check collisions with rotated hexagon boundaries
      const ballPos = rotatePoint(
        state.current.ballX - canvas.width / 2,
        state.current.ballY - canvas.height / 2,
        -state.current.rotation
      );
      
      // Collision detection with hexagon sides
      for (let i = 0; i < 6; i++) {
        const angle1 = (i * Math.PI * 2) / 6;
        const angle2 = ((i + 1) * Math.PI * 2) / 6;
        const p1 = { x: 150 * Math.cos(angle1), y: 150 * Math.sin(angle1) };
        const p2 = { x: 150 * Math.cos(angle2), y: 150 * Math.sin(angle2) };
        
        const collision = lineCircleCollision(
          p1, p2,
          { x: ballPos.x, y: ballPos.y },
          10
        );
        
        if (collision) {
          const normal = normalizeVector({
            x: -(p2.y - p1.y),
            y: p2.x - p1.x
          });
          
          const rotatedVelocity = rotatePoint(
            state.current.velocityX,
            state.current.velocityY,
            -state.current.rotation
          );
          
          // Reflect velocity
          const dot = rotatedVelocity.x * normal.x + rotatedVelocity.y * normal.y;
          rotatedVelocity.x = (rotatedVelocity.x - 2 * dot * normal.x) * state.current.damping;
          rotatedVelocity.y = (rotatedVelocity.y - 2 * dot * normal.y) * state.current.damping;
          
          const finalVelocity = rotatePoint(
            rotatedVelocity.x,
            rotatedVelocity.y,
            state.current.rotation
          );
          
          state.current.velocityX = finalVelocity.x;
          state.current.velocityY = finalVelocity.y;
          
          // Adjust position to prevent sticking
          const adjustedPos = rotatePoint(
            ballPos.x + normal.x * 2,
            ballPos.y + normal.y * 2,
            state.current.rotation
          );
          
          state.current.ballX = adjustedPos.x + canvas.width / 2;
          state.current.ballY = adjustedPos.y + canvas.height / 2;
        }
      }
      
      // Draw ball
      ctx.beginPath();
      ctx.fillStyle = 'orange';
      ctx.arc(state.current.ballX, state.current.ballY, 10, 0, Math.PI * 2);
      ctx.fill();
      
      // Update rotation
      state.current.rotation += 0.005;
      
      requestIdRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(requestIdRef.current);
    };
  }, []);
  
  return React.createElement('canvas', {
    ref: canvasRef,
    width: 400,
    height: 400,
    style: {
      display: 'block'
    }
  });
};

// Helper functions
function rotatePoint(x, y, angle) {
  return {
    x: x * Math.cos(angle) - y * Math.sin(angle),
    y: x * Math.sin(angle) + y * Math.cos(angle)
  };
}

function normalizeVector(v) {
  const length = Math.sqrt(v.x * v.x + v.y * v.y);
  return {
    x: v.x / length,
    y: v.y / length
  };
}

function lineCircleCollision(p1, p2, circle, radius) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  const dot = (((circle.x - p1.x) * dx) + ((circle.y - p1.y) * dy)) / Math.pow(length, 2);
  const closestX = p1.x + (dot * dx);
  const closestY = p1.y + (dot * dy);
  
  if (dot < 0 || dot > 1) return false;
  
  const distance = Math.sqrt(
    Math.pow(closestX - circle.x, 2) + Math.pow(closestY - circle.y, 2)
  );
  
  return distance <= radius;
}

window.Claude_Hexagon = Claude_Hexagon;