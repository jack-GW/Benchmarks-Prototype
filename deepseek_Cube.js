const { useRef, useEffect } = React;

const Deepseek_Cube = () => {
  const canvasRef = useRef(null);
  const rotationRef = useRef(0);
  
  class Cube {
    constructor(size, lineWidth, rotationSpeed) {
      this.size = size;
      this.lineWidth = lineWidth;
      this.rotationSpeed = rotationSpeed;
      this.angleX = 0;
      this.angleY = 0;
    }

    project(ctx, x, y, z) {
      const focalLength = 300;
      const scale = focalLength / (focalLength + z);
      return { x: x * scale, y: y * scale };
    }

    draw(ctx, timeDelta) {
      ctx.save();
      ctx.translate(200, 200);
      ctx.strokeStyle = 'white';
      ctx.lineWidth = this.lineWidth;

      // Update rotation angles with smooth time-based animation
      this.angleX += this.rotationSpeed * (timeDelta / 16);
      this.angleY += this.rotationSpeed * (timeDelta / 16);
      
      const vertices = [];
      const half = this.size / 2;
      
      // Generate 3D vertices
      for (let x = -half; x <= half; x += this.size) {
        for (let y = -half; y <= half; y += this.size) {
          for (let z = -half; z <= half; z += this.size) {
            // Apply rotation matrices
            const rotX = x * Math.cos(this.angleY) - z * Math.sin(this.angleY);
            const rotZ = x * Math.sin(this.angleY) + z * Math.cos(this.angleY);
            const rotY = y * Math.cos(this.angleX) - rotZ * Math.sin(this.angleX);
            const rotZ2 = rotZ * Math.cos(this.angleX) + y * Math.sin(this.angleX);
            
            const projected = this.project(ctx, rotX, rotY, rotZ2 + 400);
            vertices.push(projected);
          }
        }
      }

      // Draw wireframe edges
      const connections = [
        [0,1], [1,3], [3,2], [2,0], // Front face
        [4,5], [5,7], [7,6], [6,4], // Back face
        [0,4], [1,5], [3,7], [2,6]  // Connecting edges
      ];
      
      connections.forEach(([i, j]) => {
        ctx.beginPath();
        ctx.moveTo(vertices[i].x, vertices[i].y);
        ctx.lineTo(vertices[j].x, vertices[j].y);
        ctx.stroke();
      });
      
      ctx.restore();
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let lastTime = 0;

    const outerCube = new Cube(100, 3, 0.01);
    const innerCube = new Cube(50, 2, 0.02);

    const render = (timestamp) => {
      const timeDelta = timestamp - lastTime;
      lastTime = timestamp;
      
      // Clear canvas with black background
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, 400, 400);

      // Draw both cubes with independent rotation
      outerCube.draw(ctx, timeDelta);
      innerCube.draw(ctx, timeDelta);

      animationFrameId = requestAnimationFrame(render);
    };

    render(performance.now());

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return React.createElement('canvas', {
    ref: canvasRef,
    width: 400,
    height: 400,
    style: { display: 'block', backgroundColor: 'black' }
  });
};

window.Deepseek_Cube = Deepseek_Cube;
