import { useState, useRef, useCallback, useEffect } from 'react';

interface UseAudioPlayerProps {
  src?: string;
  autoPlay?: boolean;
  onEnded?: () => void;
}

export const useAudioPlayer = ({ src, autoPlay = false, onEnded }: UseAudioPlayerProps = {}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initializeAudio = useCallback((audioSrc: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const audio = new Audio(audioSrc);
    audioRef.current = audio;

    audio.volume = volume;
    audio.preload = 'metadata';

    audio.addEventListener('loadstart', () => setIsLoading(true));
    audio.addEventListener('loadeddata', () => setIsLoading(false));
    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
      setError(null);
    });
    
    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime);
    });
    
    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      setCurrentTime(0);
      onEnded?.();
    });
    
    audio.addEventListener('error', () => {
      setError('Failed to load audio');
      setIsLoading(false);
    });

    if (autoPlay) {
      audio.play().catch(() => {
        setError('Autoplay failed - user interaction required');
      });
    }
  }, [volume, autoPlay, onEnded]);

  useEffect(() => {
    if (src) {
      initializeAudio(src);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [src, initializeAudio]);

  const play = useCallback(async () => {
    if (!audioRef.current) return;
    
    try {
      await audioRef.current.play();
      setIsPlaying(true);
      setError(null);
    } catch (err) {
      setError('Failed to play audio');
    }
  }, []);

  const pause = useCallback(() => {
    if (!audioRef.current) return;
    
    audioRef.current.pause();
    setIsPlaying(false);
  }, []);

  const stop = useCallback(() => {
    if (!audioRef.current) return;
    
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
    setCurrentTime(0);
  }, []);

  const seek = useCallback((time: number) => {
    if (!audioRef.current) return;
    
    audioRef.current.currentTime = Math.max(0, Math.min(time, duration));
  }, [duration]);

  const setAudioVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
    
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume;
    }
  }, []);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  return {
    // State
    isPlaying,
    duration,
    currentTime,
    volume,
    isLoading,
    error,
    
    // Actions
    play,
    pause,
    stop,
    seek,
    setVolume: setAudioVolume,
    togglePlayPause,
    
    // Utils
    progress: duration > 0 ? (currentTime / duration) * 100 : 0,
    formattedCurrentTime: formatTime(currentTime),
    formattedDuration: formatTime(duration),
  };
};

const formatTime = (seconds: number): string => {
  if (!isFinite(seconds)) return '0:00';
  
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};