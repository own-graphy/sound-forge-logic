import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Square, Download, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { AudioWaveform } from './AudioWaveform';
import { GeneratedAudio } from '@/types';

interface AudioPlayerProps {
  audio: GeneratedAudio;
  autoPlay?: boolean;
  className?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audio,
  autoPlay = false,
  className = '',
}) => {
  const {
    isPlaying,
    currentTime,
    duration,
    progress,
    formattedCurrentTime,
    formattedDuration,
    isLoading,
    error,
    play,
    pause,
    stop,
    seek,
    togglePlayPause,
  } = useAudioPlayer({
    src: audio.audioUrl,
    autoPlay,
  });

  const handleWaveformClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const clickPosition = (event.clientX - rect.left) / rect.width;
    const seekTime = clickPosition * duration;
    seek(seekTime);
  };

  const downloadAudio = () => {
    const link = document.createElement('a');
    link.href = audio.audioUrl;
    link.download = `voiceforge-${audio.id}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Audio Info */}
      <div className="text-center">
        <h3 className="text-sm font-medium text-foreground truncate">
          {audio.text.length > 50 ? `${audio.text.substring(0, 50)}...` : audio.text}
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          Generated with {audio.voiceId} • {formattedDuration}
        </p>
      </div>

      {/* Waveform */}
      <div 
        className="cursor-pointer"
        onClick={handleWaveformClick}
      >
        <AudioWaveform
          audioUrl={audio.audioUrl}
          isPlaying={isPlaying}
          progress={progress}
          height={80}
        />
      </div>

      {/* Time Display */}
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{formattedCurrentTime}</span>
        <span>{formattedDuration}</span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={stop}
          disabled={!isPlaying && currentTime === 0}
          className="p-2"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={togglePlayPause}
          disabled={isLoading || !!error}
          className="p-3 bg-gradient-primary text-primary-foreground hover:bg-primary-dark shadow-glow"
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="h-5 w-5 border-2 border-current border-t-transparent rounded-full"
              />
            ) : isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5 ml-0.5" />
            )}
          </motion.div>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={stop}
          disabled={!isPlaying && currentTime === 0}
          className="p-2"
        >
          <Square className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={downloadAudio}
          className="p-2"
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-destructive text-xs bg-destructive/10 px-3 py-2 rounded"
        >
          {error}
        </motion.div>
      )}
    </div>
  );
};