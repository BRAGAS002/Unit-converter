import { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TemperatureConverter from "@/components/TemperatureConverter";
import LengthConverter from "@/components/LengthConverter";
import { Thermometer, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Download } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("temperature");
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const baseUrl = useMemo(() => {
    return (
      import.meta.env.VITE_BASE_URL ??
      (typeof location !== "undefined" ? location.origin : "https://unit-converter-three-steel.vercel.app")
    );
  }, []);

  const handleDownload = async () => {
    if (isDownloading) return;
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      setDownloadError("You are offline. Connect to the internet to download.");
      return;
    }
    setDownloadError(null);
    setIsDownloading(true);
    setDownloadProgress(0);

    try {
      // Fetch version metadata
      const metaResp = await fetch(`${baseUrl}/version.json`, { cache: "no-store" });
      if (!metaResp.ok) throw new Error("Unable to fetch version info");
      const meta = await metaResp.json();
      const expectedHash: string | undefined = meta?.sha256;
      const versionName: string = meta?.versionName ?? "unknown";
      const apkPath: string = meta?.apkPath ?? "/app-debug.apk";
      const downloadUrl = apkPath.startsWith("http") ? apkPath : `${baseUrl}${apkPath}`;

      toast.info(`Starting download (v${versionName})`);

      const response = await fetch(downloadUrl, { cache: "no-store" });
      if (!response.ok || !response.body) {
        throw new Error("Failed to start download");
      }

      const contentLengthHeader = response.headers.get("Content-Length");
      const total = contentLengthHeader ? parseInt(contentLengthHeader, 10) : 0;

      const reader = response.body.getReader();
      const chunks: Uint8Array[] = [];
      let loaded = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          chunks.push(value);
          loaded += value.length;
          if (total > 0) {
            setDownloadProgress(Math.max(1, Math.min(99, Math.round((loaded / total) * 100))));
          }
        }
      }

      const blob = new Blob(chunks, { type: "application/vnd.android.package-archive" });

      // Integrity check if hash provided
      if (expectedHash && crypto?.subtle) {
        const buf = await blob.arrayBuffer();
        const digest = await crypto.subtle.digest("SHA-256", buf);
        const hex = Array.from(new Uint8Array(digest))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("")
          .toUpperCase();
        if (hex !== expectedHash.toUpperCase()) {
          throw new Error("Integrity check failed for APK");
        }
      }

      const objectUrl = URL.createObjectURL(blob);

      const contentDisposition = response.headers.get("Content-Disposition") || "";
      const filenameMatch = contentDisposition.match(/filename="?([^";]+)"?/i);
      const filename = filenameMatch?.[1] || "unit-swift-app.apk";

      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadProgress(100);
      setIsDownloading(false);
      toast.success(`Download complete (v${versionName})`);
      setTimeout(() => URL.revokeObjectURL(objectUrl), 10000);
    } catch (err: any) {
      setIsDownloading(false);
      setDownloadError(err?.message || "Download failed");
      toast.error(err?.message || "Download failed");
    }
  };

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

        <div className="flex items-center justify-center">
          <Button
            size="lg"
            className="px-8"
            onClick={handleDownload}
            disabled={isDownloading}
          >
            <Download />
            Download App
          </Button>
        </div>

        {isDownloading && (
          <div className="space-y-2 pt-4">
            <Progress value={downloadProgress} />
            <p className="text-center text-xs text-muted-foreground">
              {downloadProgress > 0 ? `Downloading… ${downloadProgress}%` : "Downloading…"}
            </p>
          </div>
        )}

        {downloadError && (
          <p className="text-center text-xs text-destructive pt-2">{downloadError}</p>
        )}

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
