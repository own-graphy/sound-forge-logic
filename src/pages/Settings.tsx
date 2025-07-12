import React from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  Moon, 
  Sun, 
  Volume2, 
  Download, 
  Globe,
  User,
  Bell,
  Shield,
  HardDrive,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useSettingsStore } from '@/store/settingsStore';
import { useVoiceStore } from '@/store/voiceStore';
import { useToast } from '@/hooks/use-toast';

export const Settings: React.FC = () => {
  const { settings, updateSettings, resetSettings } = useSettingsStore();
  const { clearHistory } = useVoiceStore();
  const { toast } = useToast();

  const handleThemeChange = () => {
    const newTheme = settings.theme === 'light' ? 'dark' : 'light';
    updateSettings({ theme: newTheme });
    toast({
      title: "Theme Updated",
      description: `Switched to ${newTheme} mode`,
    });
  };

  const handleClearHistory = () => {
    clearHistory();
    toast({
      title: "History Cleared",
      description: "All generated audio files have been removed from history.",
    });
  };

  const handleResetSettings = () => {
    resetSettings();
    toast({
      title: "Settings Reset",
      description: "All settings have been restored to default values.",
    });
  };

  const handleExportData = () => {
    // Simulate data export
    const data = {
      settings,
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'voiceforge-settings.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Data Exported",
      description: "Your settings have been exported successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-background-tertiary">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            Settings
          </h1>
          <p className="text-lg text-muted-foreground">
            Customize your VoiceForge experience
          </p>
        </motion.div>

        <div className="space-y-6">
          {/* Appearance */}
          <Card className="bg-gradient-card border-border shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sun className="h-5 w-5 mr-2" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Theme</Label>
                  <p className="text-sm text-muted-foreground">
                    Choose between light and dark mode
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Sun className="h-4 w-4" />
                  <Switch
                    checked={settings.theme === 'dark'}
                    onCheckedChange={handleThemeChange}
                  />
                  <Moon className="h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Audio Settings */}
          <Card className="bg-gradient-card border-border shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Volume2 className="h-5 w-5 mr-2" />
                Audio Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Auto-play Generated Audio</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically play audio when generation completes
                  </p>
                </div>
                <Switch
                  checked={settings.autoPlay}
                  onCheckedChange={(checked) => updateSettings({ autoPlay: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Show Waveform</Label>
                  <p className="text-sm text-muted-foreground">
                    Display audio waveform visualization
                  </p>
                </div>
                <Switch
                  checked={settings.showWaveform}
                  onCheckedChange={(checked) => updateSettings({ showWaveform: checked })}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Output Format</Label>
                  <Badge variant="secondary">{settings.outputFormat.toUpperCase()}</Badge>
                </div>
                <Select
                  value={settings.outputFormat}
                  onValueChange={(value: 'mp3' | 'wav') => updateSettings({ outputFormat: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mp3">MP3 (Smaller file size)</SelectItem>
                    <SelectItem value="wav">WAV (Higher quality)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Language & Region */}
          <Card className="bg-gradient-card border-border shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                Language & Region
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Default Language</Label>
                  <Badge variant="secondary">
                    {settings.defaultLanguage === 'en-US' ? '🇺🇸 English (US)' : 
                     settings.defaultLanguage === 'en-GB' ? '🇬🇧 English (UK)' : 
                     settings.defaultLanguage}
                  </Badge>
                </div>
                <Select
                  value={settings.defaultLanguage}
                  onValueChange={(value) => updateSettings({ defaultLanguage: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en-US">🇺🇸 English (United States)</SelectItem>
                    <SelectItem value="en-GB">🇬🇧 English (United Kingdom)</SelectItem>
                    <SelectItem value="en-AU">🇦🇺 English (Australia)</SelectItem>
                    <SelectItem value="en-CA">🇨🇦 English (Canada)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card className="bg-gradient-card border-border shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Privacy & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Save Audio Locally</Label>
                  <p className="text-sm text-muted-foreground">
                    Keep generated audio files in browser storage
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Anonymous Usage Analytics</Label>
                  <p className="text-sm text-muted-foreground">
                    Help improve VoiceForge with anonymous usage data
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card className="bg-gradient-card border-border shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <HardDrive className="h-5 w-5 mr-2" />
                Data Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  onClick={handleExportData}
                  className="justify-start"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Settings
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleClearHistory}
                  className="justify-start"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear History
                </Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-destructive">Reset All Settings</h4>
                    <p className="text-sm text-muted-foreground">
                      This will restore all settings to their default values
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={handleResetSettings}
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* About */}
          <Card className="bg-gradient-card border-border shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <SettingsIcon className="h-5 w-5 mr-2" />
                About VoiceForge
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Version</p>
                  <p className="font-medium">1.0.0</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Build</p>
                  <p className="font-medium">2024.01</p>
                </div>
                <div>
                  <p className="text-muted-foreground">License</p>
                  <p className="font-medium">MIT</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Support</p>
                  <p className="font-medium">Community</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="text-center text-sm text-muted-foreground">
                <p>Built with ❤️ using React, TypeScript, and TailwindCSS</p>
                <p className="mt-1">© 2024 VoiceForge. All rights reserved.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};