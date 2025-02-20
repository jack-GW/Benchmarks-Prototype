import { useRef, useEffect } from 'react';

const Claude_Tower = () => {
    const canvasRef = useRef(null);
    
    const drawTower = (ctx) => {
        // Clear canvas
        ctx.clearRect(0, 0, 400, 400);
        
        // Base gradient for sky
        const skyGradient = ctx.createLinearGradient(0, 0, 0, 400);
        skyGradient.addColorStop(0, '#1a237e');
        skyGradient.addColorStop(1, '#3949ab');
        ctx.fillStyle = skyGradient;
        ctx.fillRect(0, 0, 400, 400);

        // Draw stars
        for (let i = 0; i < 50; i++) {
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.8 + 0.2})`;
            ctx.beginPath();
            ctx.arc(
                Math.random() * 400,
                Math.random() * 200,
                Math.random() * 2,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }

        // Main tower body
        ctx.fillStyle = '#34495e';
        ctx.beginPath();
        ctx.moveTo(150, 350);
        ctx.lineTo(250, 350);
        ctx.lineTo(240, 100);
        ctx.lineTo(160, 100);
        ctx.closePath();
        ctx.fill();

        // Tower top (spire)
        ctx.fillStyle = '#2c3e50';
        ctx.beginPath();
        ctx.moveTo(160, 100);
        ctx.lineTo(240, 100);
        ctx.lineTo(200, 50);
        ctx.closePath();
        ctx.fill();

        // Windows
        const windowPositions = [
            { x: 185, y: 150 },
            { x: 185, y: 200 },
            { x: 185, y: 250 },
            { x: 185, y: 300 }
        ];

        windowPositions.forEach(pos => {
            // Window frame
            ctx.fillStyle = '#95a5a6';
            ctx.fillRect(pos.x, pos.y, 30, 40);
            
            // Window glass
            ctx.fillStyle = '#f1c40f';
            ctx.fillRect(pos.x + 5, pos.y + 5, 20, 30);
            
            // Window cross
            ctx.strokeStyle = '#7f8c8d';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(pos.x + 15, pos.y);
            ctx.lineTo(pos.x + 15, pos.y + 40);
            ctx.moveTo(pos.x, pos.y + 20);
            ctx.lineTo(pos.x + 30, pos.y + 20);
            ctx.stroke();
        });

        // Stone texture
        for (let i = 0; i < 20; i++) {
            ctx.strokeStyle = '#2c3e50';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(150 + Math.random() * 100, 150 + Math.random() * 200);
            ctx.lineTo(150 + Math.random() * 100, 150 + Math.random() * 200);
            ctx.stroke();
        }

        // Tower flags
        const drawFlag = (x, y) => {
            ctx.fillStyle = '#e74c3c';
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + 30, y - 10);
            ctx.lineTo(x + 30, y + 10);
            ctx.closePath();
            ctx.fill();
            
            ctx.strokeStyle = '#c0392b';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x, y - 20);
            ctx.lineTo(x, y + 20);
            ctx.stroke();
        };

        drawFlag(160, 120);
        drawFlag(220, 120);

        // Clouds
        const drawCloud = (x, y, size) => {
            ctx.fillStyle = 'rgba(236, 240, 241, 0.8)';
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.arc(x + size, y - size/2, size * 0.8, 0, Math.PI * 2);
            ctx.arc(x + size * 1.5, y, size, 0, Math.PI * 2);
            ctx.fill();
        };

        drawCloud(50, 80, 20);
        drawCloud(300, 120, 25);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        let animationFrameId;
        let time = 0;
        
        const animate = () => {
            time += 0.01;
            drawTower(ctx);
            animationFrameId = window.requestAnimationFrame(animate);
        };
        
        animate();
        
        return () => {
            window.cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            width={400}
            height={400}
            className="border border-gray-300 rounded shadow-lg"
        />
    );
};

export default Claude_Tower;