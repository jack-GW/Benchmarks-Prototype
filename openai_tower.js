const { useRef, useEffect } = React;

const OpenAI_Tower = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');

    // Draw a beautiful sky background with a soft gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 0, 400);
    bgGradient.addColorStop(0, '#a0c4ff');
    bgGradient.addColorStop(1, '#dbe9f4');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 400, 400);

    // Define tower dimensions and position
    const towerWidth = 100;
    const towerHeight = 250;
    const towerX = (400 - towerWidth) / 2;
    const towerY = 400 - towerHeight - 50; // leaving a margin at the bottom

    // Draw the main tower body (a stone-like structure)
    ctx.fillStyle = '#8d99ae';
    ctx.fillRect(towerX, towerY, towerWidth, towerHeight);

    // Add horizontal brick lines for texture
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    const brickHeight = 20;
    for (let y = towerY + brickHeight; y < towerY + towerHeight; y += brickHeight) {
      ctx.beginPath();
      ctx.moveTo(towerX, y);
      ctx.lineTo(towerX + towerWidth, y);
      ctx.stroke();
    }

    // Add vertical brick lines with an alternating offset
    const brickWidth = 20;
    for (let y = towerY; y < towerY + towerHeight; y += brickHeight) {
      const offset = (Math.floor((y - towerY) / brickHeight) % 2) * (brickWidth / 2);
      for (let x = towerX + offset; x < towerX + towerWidth; x += brickWidth) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + brickHeight);
        ctx.stroke();
      }
    }

    // Draw a welcoming door at the base of the tower
    const doorWidth = 30;
    const doorHeight = 40;
    const doorX = towerX + (towerWidth - doorWidth) / 2;
    const doorY = towerY + towerHeight - doorHeight;
    ctx.fillStyle = '#3a3a3a';
    ctx.fillRect(doorX, doorY, doorWidth, doorHeight);

    // Draw battlements on the top of the tower for a classic look
    const battlementCount = 5;
    const battlementWidth = towerWidth / battlementCount;
    const battlementHeight = 20;
    for (let i = 0; i < battlementCount; i++) {
      const bx = towerX + i * battlementWidth;
      const by = towerY - battlementHeight;
      ctx.fillStyle = '#8d99ae';
      ctx.fillRect(bx, by, battlementWidth - 2, battlementHeight);
    }
  }, []);

  return <canvas ref={canvasRef} />;
};

window.OpenAI_Tower = OpenAI_Tower;
