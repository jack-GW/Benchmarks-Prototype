const ClaudeRocket = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Rocket properties
    let rocketY = 400;
    let particles = [];
    
    // Particle class for flame effects
    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = Math.random() * 3 + 1;
        this.alpha = 1;
        this.size = Math.random() * 3 + 2;
      }
      
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= 0.02;
        this.size -= 0.1;
      }
      
      draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = `rgba(255, ${Math.random() * 100 + 100}, 0, ${this.alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
    
    // Animation loop
    const animate = () => {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, 400, 400);
      
      // Draw rocket
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.moveTo(190, rocketY);
      ctx.lineTo(210, rocketY);
      ctx.lineTo(200, rocketY - 30);
      ctx.closePath();
      ctx.fill();
      
      // Add new particles
      if (rocketY > 100) {
        for (let i = 0; i < 3; i++) {
          particles.push(new Particle(
            200 + (Math.random() - 0.5) * 10,
            rocketY + 5
          ));
        }
      }
      
      // Update and draw particles
      particles = particles.filter(particle => particle.alpha > 0);
      particles.forEach(particle => {
        particle.update();
        particle.draw(ctx);
      });
      
      // Move rocket
      if (rocketY > 100) {
        rocketY -= 2;
      }
      
      // Request next frame
      requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
    // Cleanup
    return () => {
      particles = [];
    };
  }, []);
  
  return React.createElement('canvas', {
    ref: canvasRef,
    width: 400,
    height: 400,
    style: {
      border: '1px solid #333'
    }
  });
};

window.ClaudeRocket = ClaudeRocket;