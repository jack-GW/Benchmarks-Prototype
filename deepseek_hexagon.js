const { useRef, useEffect } = React;
const Deepseek_Hexagon = () => {
  const canvasRef = useRef(null);
  const rotation = useRef(0);
  const ballPos = useRef({ x: 0, y: 0 });
  const ballVel = useRef({ x: 0, y: 0 });
  const lastTime = useRef(performance.now());

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const center = { x: canvas.width/2, y: canvas.height/2 };
    let animationFrameId;
    
    // Hexagon geometry
    const hexRadius = 150;
    const ballRadius = 10;
    const gravity = 0.5;
    const damping = 0.8;
    
    // Initialize ball position
    ballPos.current = { x: center.x, y: center.y - hexRadius * 0.8 };
    ballVel.current = { x: 2, y: 0 };

    const drawHexagon = (angle) => {
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const x = center.x + hexRadius * Math.cos(angle + i * Math.PI/3);
        const y = center.y + hexRadius * Math.sin(angle + i * Math.PI/3);
        ctx[i === 0 ? 'moveTo' : 'lineTo'](x, y);
      }
      ctx.closePath();
      ctx.stroke();
    };

    const checkHexagonCollision = (pos, angle) => {
      const rotatedX = (pos.x - center.x) * Math.cos(-angle) - (pos.y - center.y) * Math.sin(-angle);
      const rotatedY = (pos.x - center.x) * Math.sin(-angle) + (pos.y - center.y) * Math.cos(-angle);
      const distance = Math.sqrt(rotatedX**2 + rotatedY**2);
      const maxDist = hexRadius - ballRadius - 2;

      if (distance > maxDist) {
        const angleToCenter = Math.atan2(rotatedY, rotatedX);
        const collisionPoint = {
          x: maxDist * Math.cos(angleToCenter),
          y: maxDist * Math.sin(angleToCenter)
        };
        
        const surfaceNormal = {
          x: collisionPoint.x / maxDist,
          y: collisionPoint.y / maxDist
        };
        
        const rotatedNormal = {
          x: surfaceNormal.x * Math.cos(angle) - surfaceNormal.y * Math.sin(angle),
          y: surfaceNormal.x * Math.sin(angle) + surfaceNormal.y * Math.cos(angle)
        };

        const dotProduct = ballVel.current.x * rotatedNormal.x + ballVel.current.y * rotatedNormal.y;
        ballVel.current.x = (ballVel.current.x - 2 * dotProduct * rotatedNormal.x) * damping;
        ballVel.current.y = (ballVel.current.y - 2 * dotProduct * rotatedNormal.y) * damping;

        pos.x = center.x + collisionPoint.x * Math.cos(angle) - collisionPoint.y * Math.sin(angle);
        pos.y = center.y + collisionPoint.x * Math.sin(angle) + collisionPoint.y * Math.cos(angle);
      }
    };

    const animate = (timestamp) => {
      const deltaTime = (timestamp - lastTime.current) / 16;
      lastTime.current = timestamp;
      
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update physics
      ballVel.current.y += gravity * (deltaTime / 16);
      ballPos.current.x += ballVel.current.x * (deltaTime / 16);
      ballPos.current.y += ballVel.current.y * (deltaTime / 16);
      
      // Update rotation
      rotation.current += Math.PI / 360 * (deltaTime / 16);
      
      // Collision detection
      checkHexagonCollision(ballPos.current, rotation.current);
      
      // Draw elements
      drawHexagon(rotation.current);
      
      // Draw ball
      ctx.beginPath();
      ctx.arc(ballPos.current.x, ballPos.current.y, ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#00f';
      ctx.fill();
      
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return React.createElement('canvas', {
    ref: canvasRef,
    width: 400,
    height: 400,
    style: { display: 'block' }
  });
};

window.Deepseek_Hexagon = Deepseek_Hexagon;
