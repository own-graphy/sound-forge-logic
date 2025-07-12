import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Copy, RotateCcw } from 'lucide-react';

interface TextInputAreaProps {
  value: string;
  onChange: (value: string) => void;
  onGenerate: () => void;
  isGenerating?: boolean;
  maxLength?: number;
  placeholder?: string;
}

const sampleTexts = [
  "Hello, welcome to VoiceForge! This is a demonstration of our text-to-speech technology.",
  "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet.",
  "Technology is best when it brings people together and makes life easier for everyone.",
  "In a world where artificial intelligence is reshaping how we communicate, voice synthesis opens new possibilities.",
];

export const TextInputArea: React.FC<TextInputAreaProps> = ({
  value,
  onChange,
  onGenerate,
  isGenerating = false,
  maxLength = 5000,
  placeholder = "Enter your text here to convert to speech...",
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const characterCount = value.length;
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;

  const handleSampleText = (text: string) => {
    onChange(text);
  };

  const clearText = () => {
    onChange('');
  };

  const copyText = async () => {
    if (value) {
      await navigator.clipboard.writeText(value);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold text-foreground">
          Text to Speech
        </Label>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="text-xs">
            {wordCount} words
          </Badge>
          <Badge 
            variant={characterCount > maxLength * 0.8 ? "destructive" : "secondary"}
            className="text-xs"
          >
            {characterCount}/{maxLength}
          </Badge>
        </div>
      </div>

      {/* Sample Text Suggestions */}
      <div className="space-y-2">
        <Label className="text-sm text-muted-foreground">Sample texts:</Label>
        <div className="flex flex-wrap gap-2">
          {sampleTexts.map((text, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handleSampleText(text)}
              className="text-xs h-auto p-2 hover:bg-primary/10"
            >
              <Sparkles className="h-3 w-3 mr-1" />
              Sample {index + 1}
            </Button>
          ))}
        </div>
      </div>

      {/* Text Input */}
      <div className="relative">
        <motion.div
          animate={{
            boxShadow: isFocused 
              ? '0 0 0 2px hsl(var(--primary)), 0 0 20px hsl(var(--primary) / 0.2)'
              : '0 0 0 1px hsl(var(--border))'
          }}
          className="rounded-lg"
        >
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            maxLength={maxLength}
            rows={6}
            className="min-h-[120px] resize-none border-0 bg-card focus:ring-0 focus:border-0"
          />
        </motion.div>

        {/* Text Actions */}
        {value && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-2 right-2 flex space-x-1"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={copyText}
              className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm"
            >
              <Copy className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearText}
              className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm"
            >
              <RotateCcw className="h-3 w-3" />
            </Button>
          </motion.div>
        )}
      </div>

      {/* Character count warning */}
      {characterCount > maxLength * 0.8 && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xs text-warning"
        >
          {characterCount > maxLength 
            ? `Text exceeds maximum length by ${characterCount - maxLength} characters`
            : `Approaching character limit (${maxLength - characterCount} remaining)`
          }
        </motion.div>
      )}

      {/* Generate Button */}
      <Button
        onClick={onGenerate}
        disabled={!value.trim() || characterCount > maxLength || isGenerating}
        className="w-full bg-gradient-primary text-primary-foreground hover:bg-primary-dark shadow-glow"
        size="lg"
      >
        <motion.div
          className="flex items-center space-x-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isGenerating ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="h-4 w-4 border-2 border-current border-t-transparent rounded-full"
              />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span>Generate Speech</span>
            </>
          )}
        </motion.div>
      </Button>
    </motion.div>
  );
};