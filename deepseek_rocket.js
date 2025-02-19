const { useRef, useEffect } = React;

const DeepSeek_Rocket = () => {
  const canvasRef = useRef(null);
  const rocketY = useRef(400);
  const particles = useRef([]);
  const animationId = useRef(null);

  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.vx = (Math.random() - 0.5) * 3;
      this.vy = Math.random() * -5 - 2;
      this.life = 1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.15;
      this.life -= 0.02;
    }

    draw(ctx) {
      ctx.fillStyle = `rgba(255, ${Math.random() * 100 + 155}, 0, ${this.life})`;
      ctx.fillRect(this.x, this.y, 3, 3);
    }
  }

  const drawRocket = (ctx, y) => {
    ctx.fillStyle = '#ff3333';
    ctx.beginPath();
    ctx.moveTo(200, y);
    ctx.lineTo(190, y + 20);
    ctx.lineTo(210, y + 20);
    ctx.closePath();
    ctx.fill();
  };

  const animate = (ctx) => {
    // Clear canvas with semi-transparent background for motion blur
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, 400, 400);

    // Update rocket position
    rocketY.current -= 3 + (rocketY.current * 0.015);
    if (rocketY.current < -20) rocketY.current = 400;

    // Create new particles
    if (rocketY.current > 0) {
      particles.current.push(
        new Particle(200 + (Math.random() - 0.5) * 6, rocketY.current + 20)
      );
    }

    // Update and draw particles
    particles.current = particles.current.filter(p => p.life > 0);
    particles.current.forEach(p => {
      p.update();
      p.draw(ctx);
    });

    // Draw rocket
    drawRocket(ctx, rocketY.current);

    animationId.current = requestAnimationFrame(() => animate(ctx));
  };

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    animate(ctx);

    return () => cancelAnimationFrame(animationId.current);
  }, []);

  return React.createElement('canvas', {
    ref: canvasRef,
    width: 400,
    height: 400,
    style: { backgroundColor: '#000' }
  });
};

window.DeepSeek_Rocket = DeepSeek_Rocket;
