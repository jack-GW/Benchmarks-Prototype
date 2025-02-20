const Claude_Cube = () => {
    const canvasRef = React.useRef(null);
    
    React.useEffect(() => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Cube vertices for unit cube (will be scaled later)
      const vertices = [
        [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
        [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]
      ];
      
      // Edges connecting vertices
      const edges = [
        [0, 1], [1, 2], [2, 3], [3, 0],
        [4, 5], [5, 6], [6, 7], [7, 4],
        [0, 4], [1, 5], [2, 6], [3, 7]
      ];
      
      // Projection constants
      const FOCAL_LENGTH = 400;
      const CANVAS_CENTER = 200;
      
      // Animation state
      let outerRotationX = 0;
      let outerRotationY = 0;
      let innerRotationX = 0;
      let innerRotationY = 0;
      
      // Project 3D point to 2D with perspective
      const project = (point, scale) => {
        const z = point[2] * scale;
        const perspective = FOCAL_LENGTH / (FOCAL_LENGTH + z);
        
        return [
          point[0] * scale * perspective + CANVAS_CENTER,
          point[1] * scale * perspective + CANVAS_CENTER
        ];
      };
      
      // Rotate point around X axis
      const rotateX = (point, angle) => {
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);
        return [
          point[0],
          point[1] * cos - point[2] * sin,
          point[1] * sin + point[2] * cos
        ];
      };
      
      // Rotate point around Y axis
      const rotateY = (point, angle) => {
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);
        return [
          point[0] * cos - point[2] * sin,
          point[1],
          point[0] * sin + point[2] * cos
        ];
      };
      
      // Draw a single cube
      const drawCube = (rotationX, rotationY, scale, lineWidth) => {
        ctx.lineWidth = lineWidth;
        
        // Transform vertices
        const transformedVertices = vertices.map(vertex => {
          let point = [...vertex];
          point = rotateX(point, rotationX);
          point = rotateY(point, rotationY);
          return project(point, scale);
        });
        
        // Draw edges
        edges.forEach(([start, end]) => {
          ctx.beginPath();
          ctx.moveTo(...transformedVertices[start]);
          ctx.lineTo(...transformedVertices[end]);
          ctx.stroke();
        });
      };
      
      // Animation loop
      const animate = () => {
        // Clear canvas
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, 400, 400);
        
        // Set stroke style
        ctx.strokeStyle = 'white';
        
        // Update rotations
        outerRotationX += 0.01;
        outerRotationY += 0.015;
        innerRotationX += 0.02;
        innerRotationY += 0.025;
        
        // Draw outer cube
        drawCube(outerRotationX, outerRotationY, 50, 3);
        
        // Draw inner cube
        drawCube(innerRotationX, innerRotationY, 25, 2);
        
        requestAnimationFrame(animate);
      };
      
      // Start animation
      animate();
      
      // Cleanup
      return () => {
        // Nothing to cleanup in this case
      };
    }, []);
    
    return React.createElement('canvas', {
      ref: canvasRef,
      width: 400,
      height: 400,
      style: {
        backgroundColor: 'black'
      }
    });
  };
  
  window.Claude_Cube = Claude_Cube;