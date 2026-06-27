import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Download, Upload, Image as ImageIcon } from "lucide-react";

export default function ImageCompressor() {
  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState([80]);
  const [compressedImage, setCompressedImage] = useState<string | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
    };
    reader.readAsDataURL(selected);
  };

  const compress = () => {
    if (!image || !canvasRef.current) return;

    const img = new Image();
    img.src = image;
    img.onload = () => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // toBlob for size estimation, toDataURL for display
      canvas.toBlob((blob) => {
        if (blob) setCompressedSize(blob.size);
      }, "image/jpeg", quality[0] / 100);

      const compressedUrl = canvas.toDataURL("image/jpeg", quality[0] / 100);
      setCompressedImage(compressedUrl);
    };
  };

  const download = () => {
    if (!compressedImage) return;
    const a = document.createElement("a");
    a.href = compressedImage;
    a.download = `compressed-${file?.name.replace(/\.[^/.]+$/, "") || "image"}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-card border rounded-xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/20 rounded-xl p-10 bg-muted/10 hover:bg-muted/30 transition-colors">
          <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <Label htmlFor="image-upload" className="cursor-pointer bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
            <Upload className="h-4 w-4" /> Choose Image
          </Label>
          <Input 
            id="image-upload" 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleFileChange}
          />
          <p className="text-sm text-muted-foreground mt-4 text-center">
            {file ? file.name : "Supports JPG, PNG, WebP. Images are processed locally."}
          </p>
        </div>

        {image && (
          <div className="space-y-6 pt-6 border-t">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-base font-semibold">Compression Quality: {quality[0]}%</Label>
                {file && <span className="text-sm text-muted-foreground">Original: {formatBytes(file.size)}</span>}
              </div>
              <Slider
                value={quality}
                onValueChange={setQuality}
                min={1}
                max={100}
                step={1}
                className="py-4"
              />
            </div>

            <Button onClick={compress} className="w-full h-12 text-lg">Compress Image</Button>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      {compressedImage && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="bg-muted px-4 py-2 rounded-t-xl font-semibold flex justify-between">
              <span>Original Image</span>
              <span className="text-muted-foreground">{file ? formatBytes(file.size) : ""}</span>
            </div>
            <div className="border rounded-b-xl p-2 bg-background flex items-center justify-center min-h-[300px]">
              <img src={image!} alt="Original" className="max-w-full max-h-[400px] object-contain rounded-lg" />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-primary/10 text-primary px-4 py-2 rounded-t-xl font-semibold flex justify-between">
              <span>Compressed Image</span>
              <span>{compressedSize ? formatBytes(compressedSize) : ""}</span>
            </div>
            <div className="border rounded-b-xl p-2 bg-background flex flex-col items-center justify-center min-h-[300px] relative group">
              <img src={compressedImage} alt="Compressed" className="max-w-full max-h-[400px] object-contain rounded-lg" />
              <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm rounded-lg">
                <Button size="lg" onClick={download} className="gap-2">
                  <Download className="h-5 w-5" /> Download JPG
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
