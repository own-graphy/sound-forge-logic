import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface AudioWaveformProps {
  audioUrl?: string;
  isPlaying?: boolean;
  progress?: number;
  height?: number;
  className?: string;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({
  audioUrl,
  isPlaying = false,
  progress = 0,
  height = 60,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [waveformData, setWaveformData] = useState<number[]>([]);

  // Generate mock waveform data (in real app, this would analyze actual audio)
  useEffect(() => {
    const generateWaveform = () => {
      const bars = 100;
      const data = Array.from({ length: bars }, (_, i) => {
        // Create realistic speech-like waveform pattern
        const base = Math.sin(i * 0.1) * 0.3 + 0.7;
        const variation = Math.random() * 0.4;
        const speechPattern = Math.sin(i * 0.05) * 0.2;
        return Math.max(0.1, Math.min(1, base + variation + speechPattern));
      });
      setWaveformData(data);
    };

    generateWaveform();
  }, [audioUrl]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || waveformData.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height: canvasHeight } = canvas;
    const barWidth = width / waveformData.length;
    const maxBarHeight = canvasHeight * 0.8;

    // Clear canvas
    ctx.clearRect(0, 0, width, canvasHeight);

    // Draw waveform bars
    waveformData.forEach((amplitude, index) => {
      const barHeight = amplitude * maxBarHeight;
      const x = index * barWidth;
      const y = (canvasHeight - barHeight) / 2;

      // Determine bar color based on progress
      const progressPosition = (progress / 100) * waveformData.length;
      const isPlayed = index < progressPosition;

      // Create gradient
      const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
      
      if (isPlayed) {
        // Played portion - purple/pink gradient
        gradient.addColorStop(0, 'hsl(280, 90%, 68%)');
        gradient.addColorStop(1, 'hsl(258, 90%, 66%)');
      } else {
        // Unplayed portion - muted gray
        gradient.addColorStop(0, 'hsl(240, 6%, 25%)');
        gradient.addColorStop(1, 'hsl(240, 6%, 15%)');
      }

      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, Math.max(1, barWidth - 1), barHeight);

      // Add glow effect for currently playing area
      if (isPlaying && Math.abs(index - progressPosition) < 2) {
        ctx.shadowColor = 'hsl(258, 90%, 66%)';
        ctx.shadowBlur = 10;
        ctx.fillRect(x, y, Math.max(1, barWidth - 1), barHeight);
        ctx.shadowBlur = 0;
      }
    });
  }, [waveformData, progress, isPlaying]);

  return (
    <div className={`relative ${className}`}>
      <motion.canvas
        ref={canvasRef}
        width={400}
        height={height}
        className="w-full h-full rounded-lg bg-background-secondary"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Animated playing indicator */}
      {isPlaying && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="relative w-full h-full">
            <motion.div
              className="absolute top-0 w-1 h-full bg-gradient-to-b from-accent to-primary opacity-80"
              style={{ left: `${progress}%` }}
              animate={{ 
                boxShadow: [
                  '0 0 5px hsl(258, 90%, 66%)', 
                  '0 0 20px hsl(258, 90%, 66%)', 
                  '0 0 5px hsl(258, 90%, 66%)'
                ] 
              }}
              transition={{ 
                duration: 1, 
                repeat: Infinity, 
                ease: 'easeInOut' 
              }}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
};