"use client";

import React, { useEffect, useRef } from 'react';

export const MatrixRainingLetters = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        let columns = Math.floor(width / 20);
        const letters = "日ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹｲﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ0123456789!?#$%&<>*+=-_@";
        const lettersArray = letters.split('');

        let drops: number[] = [];
        for (let i = 0; i < columns; i++) {
            drops[i] = 1;
        }

        let frameId: number;

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, width, height);
            ctx.fillStyle = '#0F0';
            ctx.font = '15pt monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = lettersArray[Math.floor(Math.random() * lettersArray.length)];
                ctx.fillText(text, i * 20, drops[i] * 20);

                if (drops[i] * 20 > height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
            frameId = window.requestAnimationFrame(draw);
        };
        
        draw();
        
        const handleResize = () => {
          width = canvas.width = window.innerWidth;
          height = canvas.height = window.innerHeight;
          columns = Math.floor(width / 20);
          drops = [];
          for (let i = 0; i < columns; i++) {
            drops[i] = 1;
          }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.cancelAnimationFrame(frameId);
            window.removeEventListener('resize', handleResize);
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
            }}
        />
    );
};
