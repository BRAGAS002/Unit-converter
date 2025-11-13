import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type LengthUnit = "meters" | "kilometers" | "centimeters" | "feet" | "inches" | "miles";

const conversionToMeters: Record<LengthUnit, number> = {
  meters: 1,
  kilometers: 1000,
  centimeters: 0.01,
  feet: 0.3048,
  inches: 0.0254,
  miles: 1609.34,
};

const LengthConverter = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [inputUnit, setInputUnit] = useState<LengthUnit>("meters");
  const [outputUnit, setOutputUnit] = useState<LengthUnit>("feet");
  const [outputValue, setOutputValue] = useState<string>("");

  const handleConvert = (value: string) => {
    setInputValue(value);

    if (value === "" || value === ".") {
      setOutputValue("");
      return;
    }

    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    // Convert to meters first, then to target unit
    const inMeters = numValue * conversionToMeters[inputUnit];
    const result = inMeters / conversionToMeters[outputUnit];

    setOutputValue(result.toFixed(4));
  };

  const handleInputUnitChange = (unit: LengthUnit) => {
    setInputUnit(unit);
    if (inputValue) {
      const numValue = parseFloat(inputValue);
      const inMeters = numValue * conversionToMeters[unit];
      const result = inMeters / conversionToMeters[outputUnit];
      setOutputValue(result.toFixed(4));
    }
  };

  const handleOutputUnitChange = (unit: LengthUnit) => {
    setOutputUnit(unit);
    if (inputValue) {
      const numValue = parseFloat(inputValue);
      const inMeters = numValue * conversionToMeters[inputUnit];
      const result = inMeters / conversionToMeters[unit];
      setOutputValue(result.toFixed(4));
    }
  };

  const unitLabels: Record<LengthUnit, string> = {
    meters: "Meters (m)",
    kilometers: "Kilometers (km)",
    centimeters: "Centimeters (cm)",
    feet: "Feet (ft)",
    inches: "Inches (in)",
    miles: "Miles (mi)",
  };

  return (
    <Card className="p-6 space-y-6 shadow-card">
      <div className="space-y-2">
        <Label htmlFor="input-value" className="text-sm font-medium">
          From
        </Label>
        <Input
          id="input-value"
          type="number"
          value={inputValue}
          onChange={(e) => handleConvert(e.target.value)}
          placeholder="0"
          className="text-lg h-14 text-center mb-2"
          inputMode="decimal"
        />
        <Select value={inputUnit} onValueChange={handleInputUnitChange}>
          <SelectTrigger className="h-12">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(unitLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-center py-2">
        <div className="w-full h-px bg-border" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="output-value" className="text-sm font-medium">
          To
        </Label>
        <Input
          id="output-value"
          type="text"
          value={outputValue}
          readOnly
          placeholder="0"
          className="text-lg h-14 text-center mb-2 bg-muted"
          inputMode="decimal"
        />
        <Select value={outputUnit} onValueChange={handleOutputUnitChange}>
          <SelectTrigger className="h-12">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(unitLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
};

export default LengthConverter;
