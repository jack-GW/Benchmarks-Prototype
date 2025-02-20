const { useRef, useEffect } = React;
const OpenAI_Cube = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 400;
    const distance = 400; // Perspective distance

    // Define vertices for the outer cube (100px per side, half-length = 50)
    const outerCubeVertices = [
      { x: -50, y: -50, z: -50 },
      { x:  50, y: -50, z: -50 },
      { x:  50, y:  50, z: -50 },
      { x: -50, y:  50, z: -50 },
      { x: -50, y: -50, z:  50 },
      { x:  50, y: -50, z:  50 },
      { x:  50, y:  50, z:  50 },
      { x: -50, y:  50, z:  50 }
    ];

    // Define vertices for the inner cube (50px per side, half-length = 25)
    const innerCubeVertices = [
      { x: -25, y: -25, z: -25 },
      { x:  25, y: -25, z: -25 },
      { x:  25, y:  25, z: -25 },
      { x: -25, y:  25, z: -25 },
      { x: -25, y: -25, z:  25 },
      { x:  25, y: -25, z:  25 },
      { x:  25, y:  25, z:  25 },
      { x: -25, y:  25, z:  25 }
    ];

    // Cube edges defined as pairs of vertex indices
    const edges = [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7]
    ];

    // Function to rotate a point in 3D space around the X, Y, and Z axes
    function rotatePoint(point, angleX, angleY, angleZ) {
      let { x, y, z } = point;
      // Rotate around X axis
      let cos = Math.cos(angleX), sin = Math.sin(angleX);
      let y1 = y * cos - z * sin;
      let z1 = y * sin + z * cos;
      y = y1; z = z1;
      // Rotate around Y axis
      cos = Math.cos(angleY); sin = Math.sin(angleY);
      let x1 = x * cos + z * sin;
      let z2 = -x * sin + z * cos;
      x = x1; z = z2;
      // Rotate around Z axis
      cos = Math.cos(angleZ); sin = Math.sin(angleZ);
      x1 = x * cos - y * sin;
      y1 = x * sin + y * cos;
      return { x: x1, y: y1, z: z };
    }

    // Perspective projection of a 3D point to 2D canvas coordinates
    function project(point) {
      const factor = distance / (distance + point.z);
      return {
        x: point.x * factor + canvas.width / 2,
        y: point.y * factor + canvas.height / 2
      };
    }

    let outerAngle = 0, innerAngle = 0;

    // Animation loop using requestAnimationFrame
    function animate() {
      // Clear the canvas and fill with black
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Rotate and project the outer cube
      const rotatedOuter = outerCubeVertices.map(v =>
        rotatePoint(v, outerAngle, outerAngle * 0.7, outerAngle * 0.9)
      );
      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'white';
      edges.forEach(edge => {
        const p1 = project(rotatedOuter[edge[0]]);
        const p2 = project(rotatedOuter[edge[1]]);
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
      });
      ctx.stroke();

      // Rotate and project the inner cube
      const rotatedInner = innerCubeVertices.map(v =>
        rotatePoint(v, innerAngle, innerAngle * 1.3, innerAngle * 0.8)
      );
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'white';
      edges.forEach(edge => {
        const p1 = project(rotatedInner[edge[0]]);
        const p2 = project(rotatedInner[edge[1]]);
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
      });
      ctx.stroke();

      // Update rotation angles for independent rotations
      outerAngle += 0.01;
      innerAngle += 0.02;

      requestAnimationFrame(animate);
    }
    animate();

    // Cleanup function (if needed)
    return () => {};
  }, []);

  return React.createElement('canvas', {
    ref: canvasRef,
    width: 400,
    height: 400,
    style: { background: 'black' }
  });
};
window.OpenAI_Cube = OpenAI_Cube;
