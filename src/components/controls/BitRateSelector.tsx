import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Label } from "../ui/label";

interface BitRateSelectorProps {
  value: number;
  onChange: (bitRate: number) => void;
}

export const BitRateSelector = ({ value, onChange }: BitRateSelectorProps) => {
  const bitRates = [
    { value: 128, label: '128 kbps (Standard)' },
    { value: 192, label: '192 kbps (Good)' },
    { value: 256, label: '256 kbps (High)' },
    { value: 320, label: '320 kbps (Premium)' },
  ];

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Audio Quality</Label>
      <Select value={value.toString()} onValueChange={(val) => onChange(parseInt(val))}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select bit rate" />
        </SelectTrigger>
        <SelectContent>
          {bitRates.map((rate) => (
            <SelectItem key={rate.value} value={rate.value.toString()}>
              {rate.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};