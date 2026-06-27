import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Download, Upload, Image as ImageIcon } from "lucide-react";

export default function ImageConverter() {
  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState("image/png");
  const [quality, setQuality] = useState([90]);
  const [convertedImage, setConvertedImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
      setConvertedImage(null); // Reset on new image
    };
    reader.readAsDataURL(selected);
  };

  const convert = () => {
    if (!image || !canvasRef.current) return;

    const img = new Image();
    img.src = image;
    img.onload = () => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      
      // Fill with white background if converting to JPEG (which doesn't support transparency)
      if (format === "image/jpeg") {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      ctx.drawImage(img, 0, 0);

      const convertedUrl = canvas.toDataURL(format, format === "image/png" ? undefined : quality[0] / 100);
      setConvertedImage(convertedUrl);
    };
  };

  const download = () => {
    if (!convertedImage) return;
    const a = document.createElement("a");
    a.href = convertedImage;
    const ext = format.split("/")[1];
    a.download = `converted-${file?.name.replace(/\.[^/.]+$/, "") || "image"}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-card border rounded-xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/20 rounded-xl p-8 bg-muted/10 hover:bg-muted/30 transition-colors">
            <ImageIcon className="h-10 w-10 text-muted-foreground mb-4" />
            <Label htmlFor="image-convert-upload" className="cursor-pointer bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
              <Upload className="h-4 w-4" /> Choose Image
            </Label>
            <Input 
              id="image-convert-upload" 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileChange}
            />
            <p className="text-xs text-muted-foreground mt-4 text-center">
              {file ? file.name : "Processed entirely in your browser."}
            </p>
          </div>

          <div className="space-y-4">
            <Label className="text-base font-semibold">Target Format</Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger>
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="image/png">PNG</SelectItem>
                <SelectItem value="image/jpeg">JPEG / JPG</SelectItem>
                <SelectItem value="image/webp">WebP</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {format !== "image/png" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-base font-semibold">Quality: {quality[0]}%</Label>
              </div>
              <Slider
                value={quality}
                onValueChange={setQuality}
                min={1}
                max={100}
                step={1}
                className="py-2"
              />
            </div>
          )}

          <Button onClick={convert} className="w-full h-12 text-lg" disabled={!image}>
            Convert Image
          </Button>
        </div>

        <div className="bg-muted/30 border rounded-xl p-6 flex flex-col items-center justify-center relative min-h-[400px]">
          <canvas ref={canvasRef} className="hidden" />
          
          {convertedImage ? (
            <div className="w-full h-full flex flex-col items-center justify-center space-y-6">
              <div className="bg-background border rounded-lg p-2 max-w-full overflow-hidden shadow-sm">
                <img src={convertedImage} alt="Converted" className="max-h-[250px] object-contain rounded" />
              </div>
              <Button size="lg" onClick={download} className="w-full sm:w-auto min-w-[200px] h-12">
                <Download className="h-5 w-5 mr-2" />
                Download {format.split("/")[1].toUpperCase()}
              </Button>
            </div>
          ) : image ? (
            <div className="text-center space-y-4">
              <div className="bg-background border rounded-lg p-2 max-w-full overflow-hidden opacity-50 grayscale">
                <img src={image} alt="Original Preview" className="max-h-[200px] object-contain rounded" />
              </div>
              <p className="text-muted-foreground font-medium">Ready to convert</p>
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              Upload an image to preview
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
