const { useRef, useEffect } = React;

const Claude_Rocket = () => {
  const canvasRef = useRef(null);
  const requestIdRef = useRef(null);
  
  // Animation state
  const rocketRef = useRef({
    x: 200,
    y: 380,
    velocity: 0,
    acceleration: 0.2
  });
  
  const particlesRef = useRef([]);
  
  const createParticle = (x, y) => ({
    x,
    y,
    vx: (Math.random() - 0.5) * 3,
    vy: Math.random() * 4 + 2,
    life: 1,
    color: `hsl(${Math.random() * 60 + 10}, 100%, 60%)`
  });
  
  const updateParticles = (ctx) => {
    const particles = particlesRef.current;
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.02;
      
      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.life * 3, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life;
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  };
  
  const drawRocket = (ctx) => {
    const rocket = rocketRef.current;
    
    // Draw rocket body
    ctx.fillStyle = '#e6e6e6';
    ctx.beginPath();
    ctx.moveTo(rocket.x, rocket.y - 30);
    ctx.lineTo(rocket.x - 10, rocket.y);
    ctx.lineTo(rocket.x + 10, rocket.y);
    ctx.closePath();
    ctx.fill();
    
    // Draw fins
    ctx.fillStyle = '#cc0000';
    ctx.beginPath();
    ctx.moveTo(rocket.x - 10, rocket.y);
    ctx.lineTo(rocket.x - 15, rocket.y + 10);
    ctx.lineTo(rocket.x - 10, rocket.y + 10);
    ctx.closePath();
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(rocket.x + 10, rocket.y);
    ctx.lineTo(rocket.x + 15, rocket.y + 10);
    ctx.lineTo(rocket.x + 10, rocket.y + 10);
    ctx.closePath();
    ctx.fill();
    
    // Add flame particles
    for (let i = 0; i < 3; i++) {
      particlesRef.current.push(
        createParticle(
          rocket.x + (Math.random() - 0.5) * 6,
          rocket.y + 10
        )
      );
    }
  };
  
  const animate = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.fillStyle = '#000033';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Update rocket position
    const rocket = rocketRef.current;
    rocket.velocity += rocket.acceleration;
    rocket.y -= rocket.velocity;
    
    // Draw stars
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x, y, 1, 1);
    }
    
    // Update and draw particles
    updateParticles(ctx);
    
    // Draw rocket if still in view
    if (rocket.y > -50) {
      drawRocket(ctx);
      requestIdRef.current = requestAnimationFrame(animate);
    }
  };
  
  useEffect(() => {
    requestIdRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(requestIdRef.current);
    };
  }, []);
  
  return React.createElement('canvas', {
    ref: canvasRef,
    width: 400,
    height: 400,
    style: {
      border: '1px solid #000'
    }
  });
};

window.Claude_Rocket = Claude_Rocket;