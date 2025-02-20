const { useRef, useEffect } = React;

const Deepseek_Tower = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    canvas.width = 400;
    canvas.height = 400;

    // Tower parameters
    const drawTower = () => {
      // Gradient background
      const gradient = ctx.createRadialGradient(200, 400, 10, 200, 0, 400);
      gradient.addColorStop(0, '#2c3e50');
      gradient.addColorStop(1, '#3498db');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 400, 400);

      // Main tower structure
      ctx.beginPath();
      ctx.moveTo(160, 400);
      ctx.bezierCurveTo(100, 380, 100, 120, 160, 100);
      ctx.lineTo(240, 100);
      ctx.bezierCurveTo(300, 120, 300, 380, 240, 400);
      ctx.closePath();
      
      // Tower gradient
      const towerGradient = ctx.createLinearGradient(0, 400, 0, 0);
      towerGradient.addColorStop(0, '#e67e22');
      towerGradient.addColorStop(1, '#f1c40f');
      ctx.fillStyle = towerGradient;
      ctx.fill();

      // Architectural details
      for(let y = 380; y > 100; y -= 30) {
        ctx.beginPath();
        ctx.arc(200, y, 18 + Math.random()*4, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${45}, 70%, ${50 - (y/10)}%)`;
        ctx.fill();
      }

      // Windows pattern
      for(let i = 0; i < 8; i++) {
        const angle = (i * Math.PI * 2) / 8;
        ctx.save();
        ctx.translate(200 + Math.cos(angle)*50, 200 + Math.sin(angle)*100);
        ctx.rotate(angle);
        ctx.fillStyle = '#2980b9';
        ctx.fillRect(-8, -20, 16, 40);
        ctx.restore();
      }

      // Decorative filigree
      ctx.strokeStyle = '#ecf0f1';
      ctx.lineWidth = 2;
      for(let i = 0; i < 20; i++) {
        ctx.beginPath();
        ctx.moveTo(180 + i*2, 400 - i*15);
        ctx.lineTo(220 - i*2, 400 - i*15);
        ctx.stroke();
      }
    };

    // Animated particles
    const particles = Array.from({length: 50}, () => ({
      x: Math.random() * 400,
      y: Math.random() * 400,
      vx: Math.random() - 0.5,
      vy: -Math.random() * 2 - 1,
      size: Math.random() * 3 + 1
    }));

    const animate = () => {
      ctx.clearRect(0, 0, 400, 400);
      drawTower();

      // Draw particles
      ctx.fillStyle = '#ecf0f1';
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if(p.y < 0) {
          p.y = 400;
          p.x = Math.random() * 400;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Create golden shimmer
      ctx.beginPath();
      ctx.arc(200 + Math.sin(Date.now()/500)*10, 150, 20, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
      ctx.fill();

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return <canvas ref={canvasRef} />;
};

window.Deepseek_Tower = Deepseek_Tower;
