import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowDownUp } from "lucide-react";

type TempUnit = "celsius" | "fahrenheit" | "kelvin";

const TemperatureConverter = () => {
  const [celsius, setCelsius] = useState<string>("");
  const [fahrenheit, setFahrenheit] = useState<string>("");
  const [kelvin, setKelvin] = useState<string>("");
  const [activeInput, setActiveInput] = useState<TempUnit | null>(null);

  const convertTemperature = (value: number, from: TempUnit) => {
    let celsiusValue: number;

    switch (from) {
      case "celsius":
        celsiusValue = value;
        break;
      case "fahrenheit":
        celsiusValue = (value - 32) * (5 / 9);
        break;
      case "kelvin":
        celsiusValue = value - 273.15;
        break;
    }

    return {
      celsius: celsiusValue,
      fahrenheit: (celsiusValue * 9) / 5 + 32,
      kelvin: celsiusValue + 273.15,
    };
  };

  const handleInputChange = (value: string, unit: TempUnit) => {
    setActiveInput(unit);

    if (value === "" || value === "-") {
      setCelsius("");
      setFahrenheit("");
      setKelvin("");
      return;
    }

    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    const converted = convertTemperature(numValue, unit);

    setCelsius(converted.celsius.toFixed(2));
    setFahrenheit(converted.fahrenheit.toFixed(2));
    setKelvin(converted.kelvin.toFixed(2));
  };

  return (
    <Card className="p-6 space-y-6 shadow-card">
      <div className="space-y-2">
        <Label htmlFor="celsius" className="text-sm font-medium">
          Celsius (°C)
        </Label>
        <Input
          id="celsius"
          type="number"
          value={celsius}
          onChange={(e) => handleInputChange(e.target.value, "celsius")}
          placeholder="0"
          className="text-lg h-14 text-center"
          inputMode="decimal"
        />
      </div>

      <div className="flex justify-center">
        <ArrowDownUp className="w-6 h-6 text-muted-foreground" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="fahrenheit" className="text-sm font-medium">
          Fahrenheit (°F)
        </Label>
        <Input
          id="fahrenheit"
          type="number"
          value={fahrenheit}
          onChange={(e) => handleInputChange(e.target.value, "fahrenheit")}
          placeholder="32"
          className="text-lg h-14 text-center"
          inputMode="decimal"
        />
      </div>

      <div className="flex justify-center">
        <ArrowDownUp className="w-6 h-6 text-muted-foreground" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="kelvin" className="text-sm font-medium">
          Kelvin (K)
        </Label>
        <Input
          id="kelvin"
          type="number"
          value={kelvin}
          onChange={(e) => handleInputChange(e.target.value, "kelvin")}
          placeholder="273.15"
          className="text-lg h-14 text-center"
          inputMode="decimal"
        />
      </div>
    </Card>
  );
};

export default TemperatureConverter;
