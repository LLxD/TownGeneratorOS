import React, { useRef, useEffect } from 'react';
import { SimpleModel } from '../building/SimpleModel';
import { Palette } from '../mapping/Palette';
import { Polygon } from '../geom/Polygon';

interface CityCanvasProps {
  size: number;
  seed: number;
  palette?: Palette;
}

export const CityCanvas: React.FC<CityCanvasProps> = ({ 
  size, 
  seed,
  palette = Palette.DEFAULT 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modelRef = useRef<SimpleModel | null>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Generate the city model
    modelRef.current = new SimpleModel(size, seed);
    const model = modelRef.current;
    
    // Clear canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    ctx.fillStyle = palette.paper;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Save context and translate to center
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    
    // Calculate scale
    const scaleX = canvas.width / (model.cityRadius * 2);
    const scaleY = canvas.height / (model.cityRadius * 2);
    const scale = Math.min(scaleX, scaleY) * 0.8;
    ctx.scale(scale, scale);
    
    // Draw streets
    ctx.fillStyle = palette.medium;
    for (const street of model.streets) {
      drawPolygon(ctx, street, palette.medium, undefined);
    }
    
    // Draw buildings
    for (const building of model.buildings) {
      drawPolygon(ctx, building.shape, palette.light, palette.dark);
    }
    
    ctx.restore();
  }, [size, seed, palette]);
  
  return (
    <canvas 
      ref={canvasRef}
      style={{ 
        width: '100%', 
        height: '100%',
        display: 'block'
      }}
    />
  );
};

function drawPolygon(
  ctx: CanvasRenderingContext2D, 
  polygon: Polygon, 
  fillColor: string,
  strokeColor?: string
): void {
  if (polygon.length === 0) return;
  
  ctx.beginPath();
  ctx.moveTo(polygon[0].x, polygon[0].y);
  for (let i = 1; i < polygon.length; i++) {
    ctx.lineTo(polygon[i].x, polygon[i].y);
  }
  ctx.closePath();
  
  if (fillColor) {
    ctx.fillStyle = fillColor;
    ctx.fill();
  }
  
  if (strokeColor) {
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}
