'use client';

import React, { useEffect, useRef } from 'react';
import { useStore } from '@/context/StoreContext';

export default function ThreeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { profile } = useStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle system (Luxury Gold & Diamond Dust Sparkles)
    const particleCount = Math.min(width < 768 ? 35 : 70, 70);
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      maxOpacity: number;
      pulseSpeed: number;
      color: string;
    }> = [];

    // Determine particle hues based on active theme
    const getThemeColors = () => {
      switch (profile.theme) {
        case 'rose-gold':
          return ['#E0A899', '#FAD4C0', '#FFFFFF', '#D98282'];
        case 'royal-emerald':
          return ['#10B981', '#34D399', '#D4AF37', '#F5E29F'];
        case 'sapphire-platinum':
          return ['#60A5FA', '#93C5FD', '#E2E8F0', '#FFFFFF'];
        case 'ruby-noir':
          return ['#EF4444', '#F87171', '#F59E0B', '#FDE68A'];
        case 'imperial-gold':
        default:
          return ['#D4AF37', '#F5E29F', '#FFFFFF', '#E6CA65', '#FFF3C4'];
      }
    };

    const colors = getThemeColors();

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.2 + 0.8,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4 - 0.15, // gently floating upwards
        opacity: Math.random() * 0.7,
        maxOpacity: Math.random() * 0.6 + 0.4,
        pulseSpeed: Math.random() * 0.02 + 0.008,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let mouseX = width / 2;
    let mouseY = height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Subtle dynamic ambient radial glow following cursor / center
      const gradient = ctx.createRadialGradient(
        mouseX,
        mouseY,
        0,
        mouseX,
        mouseY,
        width * 0.45
      );
      gradient.addColorStop(0, 'rgba(212, 175, 55, 0.04)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw each diamond dust particle
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.speedX;
        p.y += p.speedY;
        p.opacity += p.pulseSpeed;

        if (p.opacity > p.maxOpacity || p.opacity < 0.1) {
          p.pulseSpeed = -p.pulseSpeed;
        }

        // Boundary wrap
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;

        // Draw diamond shape
        ctx.beginPath();
        ctx.moveTo(p.x, p.y - p.size * 1.5);
        ctx.lineTo(p.x + p.size, p.y);
        ctx.lineTo(p.x, p.y + p.size * 1.5);
        ctx.lineTo(p.x - p.size, p.y);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [profile.theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-80"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
