"use client";

import React, { useEffect, useRef } from 'react';

export const LightGrid = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    const gridSize = 25;
    let frameId: number;
    let mouse = { x: width / 2, y: height / 2 };
    let time = 0;

    const handleMouseMove = (e: MouseEvent) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    const draw = () => {
        time += 0.005;
        ctx.clearRect(0, 0, width, height);

        for (let x = 0; x < width; x += gridSize) {
            for (let y = 0; y < height; y += gridSize) {
                const distToMouse = Math.sqrt(Math.pow(x - mouse.x, 2) + Math.pow(y - mouse.y, 2));
                const maxDist = Math.sqrt(width*width + height*height);
                const normalizedDist = distToMouse / (maxDist/2);

                const pulse = Math.sin(distToMouse * 0.02 - time * 5) * 0.5 + 0.5;
                const opacity = Math.max(0, 1 - normalizedDist * 1.5) * pulse;

                if (opacity > 0.1) {
                  ctx.fillStyle = `rgba(128, 0, 255, ${opacity * 0.2})`;
                  ctx.beginPath();
                  ctx.arc(x, y, 2, 0, Math.PI * 2);
                  ctx.fill();
                }

                ctx.strokeStyle = `rgba(180, 180, 180, ${0.1 + opacity * 0.1})`;
                ctx.beginPath();
                if (x > 0) {
                    ctx.moveTo(x, y);
                    ctx.lineTo(x - gridSize, y);
                }
                if (y > 0) {
                    ctx.moveTo(x, y);
                    ctx.lineTo(x, y - gridSize);
                }
                ctx.stroke();
            }
        }
        frameId = window.requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: -1,
        width: '100vw',
        height: '100vh',
        background: 'hsl(var(--background))',
      }}
    />
  );
};
