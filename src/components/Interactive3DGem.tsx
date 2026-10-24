'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, RotateCw, ZoomIn } from 'lucide-react';
import { sound } from '@/utils/audio';

export default function Interactive3DGem() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRotating, setIsRotating] = useState(true);
  const [gemType, setGemType] = useState<'diamond' | 'emerald' | 'ruby' | 'sapphire'>('diamond');

  const rotRef = useRef({ x: 0.35, y: 0.5 });
  const isDraggingRef = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const size = Math.min(canvas.parentElement?.clientWidth || 320, 360);
    canvas.width = size * window.devicePixelRatio;
    canvas.height = size * window.devicePixelRatio;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    // 3D Diamond Geometry Vertices (Brilliant Cut Polyhedron)
    // Table, Crown, Girdle, Pavilion & Culet
    const rGirdle = size * 0.32;
    const rTable = size * 0.17;
    const hCrown = size * 0.14;
    const hPavilion = size * 0.28;

    const numFacets = 8;
    const crownVerts: Array<{ x: number; y: number; z: number }> = [];
    const girdleVerts: Array<{ x: number; y: number; z: number }> = [];

    // Table center
    for (let i = 0; i < numFacets; i++) {
      const angle = (i / numFacets) * Math.PI * 2;
      crownVerts.push({
        x: Math.cos(angle) * rTable,
        y: -hCrown,
        z: Math.sin(angle) * rTable,
      });
      girdleVerts.push({
        x: Math.cos(angle) * rGirdle,
        y: 0,
        z: Math.sin(angle) * rGirdle,
      });
    }

    const culet = { x: 0, y: hPavilion, z: 0 };

    // Get color theme
    const getGemColor = () => {
      switch (gemType) {
        case 'emerald':
          return { base: [16, 185, 129], glow: '#34D399', name: 'Zambian Emerald' };
        case 'ruby':
          return { base: [239, 68, 68], glow: '#F87171', name: 'Burmese Ruby' };
        case 'sapphire':
          return { base: [59, 130, 246], glow: '#93C5FD', name: 'Ceylon Sapphire' };
        case 'diamond':
        default:
          return { base: [240, 245, 255], glow: '#FCE9A6', name: 'Solitaire Diamond' };
      }
    };

    let autoAngle = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      if (isRotating && !isDraggingRef.current) {
        autoAngle += 0.015;
        rotRef.current.y = autoAngle;
      }

      const rx = rotRef.current.x;
      const ry = rotRef.current.y;

      const project = (p: { x: number; y: number; z: number }) => {
        // Rotate Y
        const cosY = Math.cos(ry);
        const sinY = Math.sin(ry);
        const x1 = p.x * cosY + p.z * sinY;
        const z1 = -p.x * sinY + p.z * cosY;

        // Rotate X
        const cosX = Math.cos(rx);
        const sinX = Math.sin(rx);
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = p.y * sinX + z1 * cosX;

        // Perspective
        const fov = 650;
        const scale = fov / (fov + z2);
        return {
          x: cx + x1 * scale,
          y: cy + y2 * scale,
          z: z2,
        };
      };

      // Project vertices
      const pCrown = crownVerts.map(project);
      const pGirdle = girdleVerts.map(project);
      const pCulet = project(culet);

      const gemConfig = getGemColor();
      const [r, g, b] = gemConfig.base;

      // Draw Pavilion Facets (Triangles from girdle to culet)
      for (let i = 0; i < numFacets; i++) {
        const next = (i + 1) % numFacets;
        const p1 = pGirdle[i];
        const p2 = pGirdle[next];
        const p3 = pCulet;

        // Calculate face normal Z for backface culling & lighting
        const nx = (p2.y - p1.y) * (p3.z - p1.z) - (p2.z - p1.z) * (p3.y - p1.y);
        const ny = (p2.z - p1.z) * (p3.x - p1.x) - (p2.x - p1.x) * (p3.z - p1.z);
        const nz = (p2.x - p1.x) * (p3.y - p1.y) - (p2.y - p1.y) * (p3.x - p1.x);

        const lightIntensity = Math.max(0.15, Math.min(1, (-ny * 0.7 + nz * 0.3) / 1000 + 0.5));
        const alpha = Math.max(0.4, lightIntensity * 0.85);

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.closePath();

        ctx.fillStyle = `rgba(${Math.min(255, r * lightIntensity)}, ${Math.min(255, g * lightIntensity)}, ${Math.min(255, b * lightIntensity)}, ${alpha})`;
        ctx.fill();

        ctx.strokeStyle = `rgba(255, 255, 255, ${lightIntensity * 0.7})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // Draw Crown Facets (Quads / Triangles from crown to girdle)
      for (let i = 0; i < numFacets; i++) {
        const next = (i + 1) % numFacets;
        const c1 = pCrown[i];
        const c2 = pCrown[next];
        const g2 = pGirdle[next];
        const g1 = pGirdle[i];

        const light = Math.sin(ry + (i / numFacets) * Math.PI * 2) * 0.4 + 0.6;
        ctx.beginPath();
        ctx.moveTo(c1.x, c1.y);
        ctx.lineTo(c2.x, c2.y);
        ctx.lineTo(g2.x, g2.y);
        ctx.lineTo(g1.x, g1.y);
        ctx.closePath();

        ctx.fillStyle = `rgba(${Math.min(255, r * light * 1.2)}, ${Math.min(255, g * light * 1.2)}, ${Math.min(255, b * light * 1.2)}, 0.85)`;
        ctx.fill();

        ctx.strokeStyle = `rgba(255, 255, 255, 0.6)`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // Draw Table (Top polygon)
      ctx.beginPath();
      pCrown.forEach((p, idx) => {
        if (idx === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.closePath();

      const tableGlow = Math.sin(ry * 2) * 0.3 + 0.7;
      ctx.fillStyle = `rgba(${Math.min(255, r * 1.3)}, ${Math.min(255, g * 1.3)}, ${Math.min(255, b * 1.3)}, ${tableGlow * 0.9})`;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Specular Star Sparkle on top corner
      const sparkleX = pCrown[0].x;
      const sparkleY = pCrown[0].y;
      const sparkGlow = Math.abs(Math.sin(ry * 3));

      if (sparkGlow > 0.4) {
        ctx.save();
        ctx.translate(sparkleX, sparkleY);
        ctx.rotate(ry * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowBlur = 15;
        ctx.shadowColor = gemConfig.glow;

        const arm = 14 * sparkGlow;
        ctx.beginPath();
        ctx.moveTo(0, -arm);
        ctx.lineTo(arm * 0.2, 0);
        ctx.lineTo(0, arm);
        ctx.lineTo(-arm * 0.2, 0);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(-arm, 0);
        ctx.lineTo(0, arm * 0.2);
        ctx.lineTo(arm, 0);
        ctx.lineTo(0, -arm * 0.2);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [gemType, isRotating]);

  // Touch and Mouse Drag handlers for 360-degree rotation
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
    sound.playClick();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    rotRef.current.y += dx * 0.015;
    rotRef.current.x += dy * 0.01;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div className="relative flex flex-col items-center select-none">
      {/* 3D Badge */}
      <div className="flex items-center gap-2 mb-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-gold/15 border border-brand-gold/40 text-brand-goldLight text-[11px] font-semibold tracking-wider uppercase shadow-gold">
          <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
          <span>Interactive 3D Solitaire Inspector</span>
        </span>
      </div>

      {/* Canvas Box */}
      <div
        className="relative rounded-2xl bg-gradient-to-b from-neutral-900/90 to-neutral-950 border border-brand-gold/30 p-2 cursor-grab active:cursor-grabbing shadow-2xl flex items-center justify-center overflow-hidden"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <canvas ref={canvasRef} className="touch-none" />

        {/* Floating Controls */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] text-neutral-400 pointer-events-none">
          <span className="bg-neutral-950/80 px-2 py-0.5 rounded border border-white/10 backdrop-blur-md">
            ↻ Drag 360° to inspect
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsRotating(!isRotating);
              sound.playClick();
            }}
            className="pointer-events-auto bg-brand-gold/20 hover:bg-brand-gold/30 text-brand-goldLight border border-brand-gold/50 px-2.5 py-1 rounded flex items-center gap-1 transition"
          >
            <RotateCw className="w-3 h-3" />
            <span>{isRotating ? 'Pause' : 'Auto-Spin'}</span>
          </button>
        </div>
      </div>

      {/* Gem Selection Pills */}
      <div className="flex items-center gap-1.5 mt-3">
        {[
          { id: 'diamond', label: '💎 VVS Diamond', color: '#D4AF37' },
          { id: 'emerald', label: '💚 Emerald', color: '#10B981' },
          { id: 'ruby', label: '❤️ Ruby', color: '#EF4444' },
          { id: 'sapphire', label: '💙 Sapphire', color: '#3B82F6' },
        ].map(g => (
          <button
            key={g.id}
            onClick={() => {
              setGemType(g.id as any);
              sound.playChime();
            }}
            className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition border ${
              gemType === g.id
                ? 'bg-white/20 border-white text-white shadow-sm'
                : 'bg-neutral-900 border-white/10 text-neutral-400 hover:text-white'
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>
    </div>
  );
}
