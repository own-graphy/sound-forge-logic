import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useVoiceStore } from "@/store/voiceStore";
import { BitRates } from "@/lib/voiceConfig";

export const BitRateSelector = () => {
  const { selectedBitRate, setSelectedBitRate } = useVoiceStore();

  const bitRateOptions = [
    { value: BitRates.low, label: "Low (64 kbps)", size: "Smaller file" },
    { value: BitRates.medium, label: "Medium (128 kbps)", size: "Balanced" },
    { value: BitRates.high, label: "High (192 kbps)", size: "Good quality" },
    { value: BitRates.ultra, label: "Ultra (320 kbps)", size: "Best quality" },
  ];

  return (
    <div className="space-y-2">
      <Label htmlFor="bitrate-select" className="text-sm font-medium text-foreground">
        Audio Quality
      </Label>
      <Select
        value={selectedBitRate.toString()}
        onValueChange={(value) => setSelectedBitRate(parseInt(value))}
      >
        <SelectTrigger id="bitrate-select" className="w-full">
          <SelectValue placeholder="Select quality" />
        </SelectTrigger>
        <SelectContent>
          {bitRateOptions.map((option) => (
            <SelectItem key={option.value} value={option.value.toString()}>
              <div className="flex flex-col">
                <span className="font-medium">{option.label}</span>
                <span className="text-xs text-muted-foreground">{option.size}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};