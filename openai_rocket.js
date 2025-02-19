const { useRef, useEffect } = React;

const OpenAI_Rocket = () => {
// Create a ref for the canvas element
const canvasRef = useRef(null);

useEffect(() => {
const canvas = canvasRef.current;
const ctx = canvas.getContext('2d');
// Ensure canvas size is 400x400
canvas.width = 400;
canvas.height = 400;

// Define the rocket starting properties
const rocket = {
  x: canvas.width / 2,      // Center horizontally
  y: canvas.height - 20,    // Start near bottom
  width: 20,
  height: 50,
  speed: 2                  // Upward speed in pixels per frame
};

// Array to hold flame particles
let particles = [];

// Utility: generate a random number between min and max
function random(min, max) {
  return Math.random() * (max - min) + min;
}

// Create flame particles at the rocket's engine
function addParticles() {
  for (let i = 0; i < 5; i++) { // Create 5 particles per frame
    const particle = {
      // Start at rocket's bottom with a slight horizontal randomness
      x: rocket.x + random(-rocket.width / 2, rocket.width / 2),
      y: rocket.y,
      // Velocity: slightly spread horizontally; moving downward
      vx: random(-1, 1),
      vy: random(1, 3),
      // Each particle lives for 30 frames
      life: 30,
      maxLife: 30,
      // Random size between 2 and 4 pixels
      size: random(2, 4)
    };
    particles.push(particle);
  }
}

// Function to draw the rocket onto the canvas
function drawRocket(ctx, rocket) {
  const { x, y, width, height } = rocket;
  ctx.save();

  // Draw the body of the rocket (a simple rectangle)
  ctx.fillStyle = '#888';
  ctx.fillRect(x - width / 2, y - height, width, height);

  // Draw the nose cone as a triangle
  ctx.fillStyle = 'red';
  ctx.beginPath();
  ctx.moveTo(x - width / 2, y - height);
  ctx.lineTo(x + width / 2, y - height);
  ctx.lineTo(x, y - height - width); // Nose height equal to width
  ctx.closePath();
  ctx.fill();

  // Draw fins on each side of the rocket
  ctx.fillStyle = 'blue';
  // Left fin
  ctx.beginPath();
  ctx.moveTo(x - width / 2, y);
  ctx.lineTo(x - width / 2 - 10, y);
  ctx.lineTo(x - width / 2, y - 10);
  ctx.closePath();
  ctx.fill();
  // Right fin
  ctx.beginPath();
  ctx.moveTo(x + width / 2, y);
  ctx.lineTo(x + width / 2 + 10, y);
  ctx.lineTo(x + width / 2, y - 10);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

// The main animation loop using requestAnimationFrame for smooth rendering
let animationFrameId;
function animate() {
  // Clear the entire canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update the rocket's position (moving upwards)
  rocket.y -= rocket.speed;
  // Reset the rocket to the bottom if it completely leaves the view
  if (rocket.y + 10 < 0) {
    rocket.y = canvas.height - 20;
  }

  // Generate new flame particles under the rocket's engine
  addParticles();

  // Update and draw each particle
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    // Update particle position based on its velocity
    p.x += p.vx;
    p.y += p.vy;
    // Decrease its lifetime
    p.life -= 1;

    // Draw the particle with fading effect (alpha based on remaining life)
    ctx.save();
    ctx.globalAlpha = p.life / p.maxLife;
    ctx.fillStyle = 'orange';
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Remove the particle if its life has expired
    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }

  // Draw the rocket
  drawRocket(ctx, rocket);

  // Request the next frame
  animationFrameId = requestAnimationFrame(animate);
}

// Start the animation loop
animationFrameId = requestAnimationFrame(animate);

// Cleanup the animation frame when the component unmounts
return () => cancelAnimationFrame(animationFrameId);
}, []);

// Return the canvas element using React.createElement (no JSX)
return React.createElement('canvas', { width: 400, height: 400, ref: canvasRef });
};

window.OpenAI_Rocket = OpenAI_Rocket;