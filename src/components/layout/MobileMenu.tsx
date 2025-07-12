import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Mic, 
  Upload, 
  Settings, 
  X,
  AudioWaveform,
  Headphones
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Voice Lab', href: '/voice-lab', icon: Mic },
  { name: 'Upload', href: '/upload', icon: Upload },
  { name: 'Settings', href: '/settings', icon: Settings },
];

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
            onClick={onClose}
          />

          {/* Menu */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 w-80 bg-gradient-card border-r border-border z-50 md:hidden"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-8">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <AudioWaveform className="h-8 w-8 text-primary" />
                    <motion.div
                      className="absolute inset-0"
                      animate={{ 
                        filter: ['hue-rotate(0deg)', 'hue-rotate(360deg)'] 
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity, 
                        ease: 'linear' 
                      }}
                    >
                      <Headphones className="h-8 w-8 text-accent opacity-60" />
                    </motion.div>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                      VoiceForge
                    </h1>
                    <p className="text-xs text-muted-foreground">AI Voice Studio</p>
                  </div>
                </div>
                
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg bg-background-secondary hover:bg-background-tertiary transition-colors"
                >
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-4 space-y-1">
                {navigation.map((item, index) => {
                  const isActive = location.pathname === item.href;
                  const Icon = item.icon;
                  
                  return (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={item.href}
                        onClick={onClose}
                        className={cn(
                          'group flex items-center px-4 py-4 text-base font-medium rounded-lg transition-all duration-200',
                          'hover:bg-background-secondary hover:scale-105',
                          isActive
                            ? 'bg-gradient-primary text-primary-foreground shadow-glow'
                            : 'text-muted-foreground hover:text-foreground'
                        )}
                      >
                        <Icon className="mr-4 h-6 w-6 flex-shrink-0" />
                        {item.name}
                        {isActive && (
                          <motion.div
                            className="ml-auto w-2 h-2 rounded-full bg-accent"
                            layoutId="mobile-indicator"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                          />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Footer */}
              <div className="p-4 border-t border-border">
                <div className="text-xs text-muted-foreground text-center">
                  Made with ❤️ by VoiceForge
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};