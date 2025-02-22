const { useRef, useEffect } = React;

const Claude_Pool = () => {
    const canvasRef = useRef(null);
    const frameRef = useRef(0);
    const draggingRef = useRef(false);
    const mouseStartRef = useRef({ x: 0, y: 0 });
    const ballsRef = useRef([]);
    
    // Physics constants
    const FRICTION = 0.99;
    const BALL_RADIUS = 10;
    const BALL_DIAMETER = BALL_RADIUS * 2;
    const ELASTICITY = 0.95;

    // Initialize balls
    const initializeBalls = () => {
        const balls = [];
        // Cue ball (orange)
        balls.push({
            x: 100,
            y: 200,
            vx: 0,
            vy: 0,
            color: '#FFA500',
            radius: BALL_RADIUS
        });

        // Setup pyramid of white balls
        const startX = 300;
        const startY = 200;
        const rows = 4;
        let ballCount = 0;
        
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col <= row; col++) {
                if (ballCount < 10) {  // Only create up to 10 white balls
                    balls.push({
                        x: startX + row * (BALL_DIAMETER * Math.cos(Math.PI/6)),
                        y: startY + (col * BALL_DIAMETER) - (row * BALL_RADIUS),
                        vx: 0,
                        vy: 0,
                        color: '#FFFFFF',
                        radius: BALL_RADIUS
                    });
                    ballCount++;
                }
            }
        }
        
        return balls;
    };

    // Handle ball collisions
    const handleCollisions = (balls) => {
        for (let i = 0; i < balls.length; i++) {
            const ball1 = balls[i];
            
            // Wall collisions
            if (ball1.x - ball1.radius <= 0 || ball1.x + ball1.radius >= 400) {
                ball1.vx *= -ELASTICITY;
                ball1.x = Math.max(ball1.radius, Math.min(400 - ball1.radius, ball1.x));
            }
            if (ball1.y - ball1.radius <= 0 || ball1.y + ball1.radius >= 400) {
                ball1.vy *= -ELASTICITY;
                ball1.y = Math.max(ball1.radius, Math.min(400 - ball1.radius, ball1.y));
            }
            
            // Ball-to-ball collisions
            for (let j = i + 1; j < balls.length; j++) {
                const ball2 = balls[j];
                const dx = ball2.x - ball1.x;
                const dy = ball2.y - ball1.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < BALL_DIAMETER) {
                    // Collision detected - calculate new velocities
                    const angle = Math.atan2(dy, dx);
                    const sin = Math.sin(angle);
                    const cos = Math.cos(angle);
                    
                    // Rotate velocities
                    const vx1 = ball1.vx * cos + ball1.vy * sin;
                    const vy1 = ball1.vy * cos - ball1.vx * sin;
                    const vx2 = ball2.vx * cos + ball2.vy * sin;
                    const vy2 = ball2.vy * cos - ball2.vx * sin;
                    
                    // Elastic collision
                    const finalVx1 = vx2 * ELASTICITY;
                    const finalVx2 = vx1 * ELASTICITY;
                    
                    // Rotate back
                    ball1.vx = finalVx1 * cos - vy1 * sin;
                    ball1.vy = vy1 * cos + finalVx1 * sin;
                    ball2.vx = finalVx2 * cos - vy2 * sin;
                    ball2.vy = vy2 * cos + finalVx2 * sin;
                    
                    // Separate balls to prevent sticking
                    const overlap = BALL_DIAMETER - distance;
                    const moveX = (overlap * cos) / 2;
                    const moveY = (overlap * sin) / 2;
                    
                    ball1.x -= moveX;
                    ball1.y -= moveY;
                    ball2.x += moveX;
                    ball2.y += moveY;
                }
            }
        }
    };

    // Update ball positions
    const updateBalls = () => {
        const balls = ballsRef.current;
        for (const ball of balls) {
            ball.x += ball.vx;
            ball.y += ball.vy;
            ball.vx *= FRICTION;
            ball.vy *= FRICTION;
            
            // Stop very slow movements
            if (Math.abs(ball.vx) < 0.01) ball.vx = 0;
            if (Math.abs(ball.vy) < 0.01) ball.vy = 0;
        }
        handleCollisions(balls);
    };

    // Draw everything
    const draw = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        // Clear canvas
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, 400, 400);
        
        // Draw balls
        for (const ball of ballsRef.current) {
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
            ctx.fillStyle = ball.color;
            ctx.fill();
        }
        
        // Draw drag line if dragging
        if (draggingRef.current) {
            const cueBall = ballsRef.current[0];
            ctx.beginPath();
            ctx.moveTo(cueBall.x, cueBall.y);
            ctx.lineTo(mouseStartRef.current.x, mouseStartRef.current.y);
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    };

    // Animation loop
    const animate = () => {
        updateBalls();
        draw();
        frameRef.current = requestAnimationFrame(animate);
    };

    // Mouse event handlers
    const handleMouseDown = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const cueBall = ballsRef.current[0];
        const dx = x - cueBall.x;
        const dy = y - cueBall.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < BALL_RADIUS) {
            draggingRef.current = true;
            mouseStartRef.current = { x, y };
        }
    };

    const handleMouseUp = (e) => {
        if (draggingRef.current) {
            const rect = canvasRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const cueBall = ballsRef.current[0];
            cueBall.vx = (cueBall.x - x) * 0.1;
            cueBall.vy = (cueBall.y - y) * 0.1;
            
            draggingRef.current = false;
        }
    };

    const handleMouseMove = (e) => {
        if (draggingRef.current) {
            const rect = canvasRef.current.getBoundingClientRect();
            mouseStartRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        }
    };

    // Setup effect
    useEffect(() => {
        ballsRef.current = initializeBalls();
        frameRef.current = requestAnimationFrame(animate);
        
        return () => {
            cancelAnimationFrame(frameRef.current);
        };
    }, []);

    return React.createElement('canvas', {
        ref: canvasRef,
        width: 400,
        height: 400,
        style: {
            fontFamily: 'monospace'
        },
        onMouseDown: handleMouseDown,
        onMouseUp: handleMouseUp,
        onMouseMove: handleMouseMove
    });
};

window.Claude_Pool = Claude_Pool;