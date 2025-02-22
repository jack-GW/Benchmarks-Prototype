const { useRef, useEffect } = React;

const OpenAI_Pool = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    const radius = 10; // 20px diameter

    // Create ball objects: each ball has position, velocity, radius and color.
    const balls = [];

    // Cue ball (red) – start it on the left quarter of the table.
    balls.push({
      x: width * 0.25,
      y: height / 2,
      vx: 0,
      vy: 0,
      radius: radius,
      color: "red",
      isCue: true
    });

    // Arrange 10 white balls in a pyramid (triangle: 1+2+3+4 = 10).
    // Use precise geometry for an equilateral triangle formation.
    const startX = width * 0.75;
    const startY = height / 2;
    // For balls touching in an equilateral triangle:
    // horizontal offset per row = radius (10px) and vertical spacing = sqrt((2r)^2 - r^2)
    const spacingX = radius; // 10px horizontal offset per row
    const spacingY = Math.sqrt((2 * radius) ** 2 - (radius) ** 2); // ~17.32px vertical spacing

    const rows = 4;
    for (let row = 0; row < rows; row++) {
      const rowX = startX + row * spacingX;
      // Center the row vertically around startY
      const rowYStart = startY - (row * spacingY) / 2;
      for (let i = 0; i <= row; i++) {
        balls.push({
          x: rowX,
          y: rowYStart + i * spacingY,
          vx: 0,
          vy: 0,
          radius: radius,
          color: "white",
          isCue: false
        });
      }
    }

    // Physics constants
    const friction = 0.99; // slows the balls gradually
    const collisionElasticity = 0.9; // energy loss on collision

    // Dragging state for cue ball control
    let dragging = false;
    let dragStart = null;
    let dragCurrent = null;

    // Convert mouse event to canvas coordinates.
    function getMousePos(e) {
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }

    // Event listeners for dragging the cue ball.
    const onMouseDown = (e) => {
      const pos = getMousePos(e);
      const cueBall = balls[0];
      const dx = pos.x - cueBall.x;
      const dy = pos.y - cueBall.y;
      if (Math.sqrt(dx * dx + dy * dy) < cueBall.radius) {
        dragging = true;
        dragStart = pos;
        dragCurrent = pos;
      }
    };

    const onMouseMove = (e) => {
      if (dragging) {
        dragCurrent = getMousePos(e);
      }
    };

    const onMouseUp = (e) => {
      if (dragging) {
        // Calculate the vector from drag start to current position.
        const dx = dragStart.x - dragCurrent.x;
        const dy = dragStart.y - dragCurrent.y;
        // Apply a scaling factor to set the velocity.
        balls[0].vx = dx * 0.1;
        balls[0].vy = dy * 0.1;
        dragging = false;
        dragStart = null;
        dragCurrent = null;
      }
    };

    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseup", onMouseUp);

    // Update positions of balls with friction and wall collisions.
    function updateBalls() {
      for (let ball of balls) {
        ball.x += ball.vx;
        ball.y += ball.vy;
        ball.vx *= friction;
        ball.vy *= friction;

        // Collision with walls
        if (ball.x - ball.radius < 0) {
          ball.x = ball.radius;
          ball.vx = -ball.vx * collisionElasticity;
        }
        if (ball.x + ball.radius > width) {
          ball.x = width - ball.radius;
          ball.vx = -ball.vx * collisionElasticity;
        }
        if (ball.y - ball.radius < 0) {
          ball.y = ball.radius;
          ball.vy = -ball.vy * collisionElasticity;
        }
        if (ball.y + ball.radius > height) {
          ball.y = height - ball.radius;
          ball.vy = -ball.vy * collisionElasticity;
        }
      }
    }

    // Handle collisions between balls.
    function handleCollisions() {
      for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
          const ball1 = balls[i];
          const ball2 = balls[j];
          const dx = ball2.x - ball1.x;
          const dy = ball2.y - ball1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist = ball1.radius + ball2.radius;

          if (dist < minDist) {
            // Calculate overlap and normalize the vector.
            const overlap = minDist - dist;
            const nx = dx / dist;
            const ny = dy / dist;

            // Separate balls by half the overlap each.
            ball1.x -= nx * overlap * 0.5;
            ball1.y -= ny * overlap * 0.5;
            ball2.x += nx * overlap * 0.5;
            ball2.y += ny * overlap * 0.5;

            // Relative velocity along the collision normal.
            const dvx = ball1.vx - ball2.vx;
            const dvy = ball1.vy - ball2.vy;
            const dot = dvx * nx + dvy * ny;

            // Only adjust velocities if balls are moving toward each other.
            if (dot > 0) {
              const impulse = (2 * dot) / 2; // masses assumed equal (1 each)
              ball1.vx -= impulse * nx;
              ball1.vy -= impulse * ny;
              ball2.vx += impulse * nx;
              ball2.vy += impulse * ny;
            }
          }
        }
      }
    }

    // Render the pool table and balls.
    function render() {
      // Clear canvas with black background.
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, width, height);

      // Draw each ball.
      for (let ball of balls) {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = ball.color;
        ctx.fill();
      }

      // If dragging, draw a minimalistic line indicator.
      if (dragging && dragStart && dragCurrent) {
        ctx.strokeStyle = "yellow";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(balls[0].x, balls[0].y);
        ctx.lineTo(dragCurrent.x, dragCurrent.y);
        ctx.stroke();
      }

      // Display minimal text with monospace font.
      ctx.font = "12px monospace";
      ctx.fillStyle = "white";
      ctx.fillText("Click and drag the red ball", 10, 20);
    }

    // Main animation loop.
    function loop() {
      updateBalls();
      handleCollisions();
      render();
      requestAnimationFrame(loop);
    }
    loop();

    // Clean up event listeners on unmount.
    return () => {
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  // Return a 400x400 canvas element created with React.createElement.
  return React.createElement("canvas", {
    ref: canvasRef,
    width: 400,
    height: 400,
    style: { display: "block", background: "black" }
  });
};

window.OpenAI_Pool = OpenAI_Pool;
