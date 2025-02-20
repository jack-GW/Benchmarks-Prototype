const { useRef, useEffect } = React;

const Claude_Tower = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 400;

    // Animation variables
    let time = 0;
    const cloudPositions = Array(3).fill().map(() => ({
      x: Math.random() * canvas.width,
      speed: 0.2 + Math.random() * 0.3
    }));

    // Drawing functions
    const drawTowerBase = () => {
      // Base foundation
      const gradient = ctx.createLinearGradient(150, 400, 250, 200);
      gradient.addColorStop(0, '#4a4a4a');
      gradient.addColorStop(1, '#2a2a2a');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(150, 400);
      ctx.lineTo(250, 400);
      ctx.lineTo(240, 200);
      ctx.lineTo(160, 200);
      ctx.closePath();
      ctx.fill();
    };

    const drawTowerBody = () => {
      // Main tower body
      const gradient = ctx.createLinearGradient(160, 200, 240, 50);
      gradient.addColorStop(0, '#3a3a3a');
      gradient.addColorStop(1, '#1a1a1a');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(160, 200);
      ctx.lineTo(240, 200);
      ctx.lineTo(220, 50);
      ctx.lineTo(180, 50);
      ctx.closePath();
      ctx.fill();

      // Windows
      ctx.fillStyle = '#f0c040';
      for (let y = 180; y > 60; y -= 30) {
        const wobble = Math.sin(time * 0.05 + y * 0.1) * 2;
        ctx.fillRect(190 + wobble, y, 20, 20);
      }
    };

    const drawTowerTop = () => {
      // Spire
      ctx.fillStyle = '#2a2a2a';
      ctx.beginPath();
      ctx.moveTo(180, 50);
      ctx.lineTo(220, 50);
      ctx.lineTo(200, 20);
      ctx.closePath();
      ctx.fill();

      // Top window
      ctx.fillStyle = '#f0c040';
      ctx.beginPath();
      ctx.arc(200, 40, 8, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawCloud = (x, y) => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.beginPath();
      ctx.arc(x, y, 15, 0, Math.PI * 2);
      ctx.arc(x + 10, y - 5, 12, 0, Math.PI * 2);
      ctx.arc(x + 20, y, 15, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawStars = () => {
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 50; i++) {
        const x = (Math.sin(i * 0.5 + time * 0.01) * 0.5 + 0.5) * canvas.width;
        const y = (Math.cos(i * 0.7 + time * 0.01) * 0.5 + 0.3) * canvas.height;
        const size = (Math.sin(time * 0.05 + i) * 0.5 + 1.5);
        ctx.fillRect(x, y, size, size);
      }
    };

    const drawMoon = () => {
      const gradient = ctx.createRadialGradient(50, 50, 0, 50, 50, 30);
      gradient.addColorStop(0, '#fffae6');
      gradient.addColorStop(1, 'rgba(255, 250, 230, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(50, 50, 30, 0, Math.PI * 2);
      ctx.fill();
    };

    // Animation loop
    const animate = () => {
      ctx.fillStyle = '#001429';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawStars();
      drawMoon();

      // Animate clouds
      cloudPositions.forEach((cloud, i) => {
        cloud.x += cloud.speed;
        if (cloud.x > canvas.width + 30) cloud.x = -50;
        drawCloud(cloud.x, 80 + i * 40);
      });

      drawTowerBase();
      drawTowerBody();
      drawTowerTop();

      time++;
      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return <canvas ref={canvasRef} />;
};

window.Claude_Tower = Claude_Tower;