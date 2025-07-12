import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  Mic, 
  Upload, 
  Settings, 
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

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const location = useLocation();

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className={cn(
        'hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0',
        'bg-gradient-card border-r border-border',
        className
      )}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center px-6 py-8">
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
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200',
                  'hover:bg-background-secondary hover:scale-105',
                  isActive
                    ? 'bg-gradient-primary text-primary-foreground shadow-glow'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                {item.name}
                {isActive && (
                  <motion.div
                    className="ml-auto w-2 h-2 rounded-full bg-accent"
                    layoutId="sidebar-indicator"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
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
    </motion.aside>
  );
};