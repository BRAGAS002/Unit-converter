import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TemperatureConverter from "@/components/TemperatureConverter";
import LengthConverter from "@/components/LengthConverter";
import { Thermometer, Ruler } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("temperature");

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-2xl mx-auto px-4 py-8 space-y-8">
        <header className="text-center space-y-3">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Unit Converter
          </h1>
          <p className="text-muted-foreground text-sm">
            Fast, accurate conversions at your fingertips
          </p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-14">
            <TabsTrigger value="temperature" className="flex items-center gap-2 text-base">
              <Thermometer className="w-5 h-5" />
              Temperature
            </TabsTrigger>
            <TabsTrigger value="length" className="flex items-center gap-2 text-base">
              <Ruler className="w-5 h-5" />
              Length
            </TabsTrigger>
          </TabsList>

          <TabsContent value="temperature" className="mt-6">
            <TemperatureConverter />
          </TabsContent>

          <TabsContent value="length" className="mt-6">
            <LengthConverter />
          </TabsContent>
        </Tabs>

        <footer className="text-center text-sm text-muted-foreground pt-8">
          <p>Works offline • Install to home screen for quick access</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
