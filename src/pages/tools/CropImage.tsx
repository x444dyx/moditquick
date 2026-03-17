import React, { useState, useRef } from 'react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { motion } from 'framer-motion';
import { Download, Crop as CropIcon, CheckCircle2, Loader2, Maximize, Square } from 'lucide-react';
import SmartDropzone from '../../components/SmartDropzone';

export default function CropImage() {
  const [file, setFile] = useState<File | null>(null);
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const onSelectFile = (selectedFile: File) => {
    setFile(selectedFile);
    setResultUrl(null);
    const reader = new FileReader();
    reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''));
    reader.readAsDataURL(selectedFile);
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const initialCrop = centerCrop(
      makeAspectCrop({ unit: '%', width: 90 }, aspect || 1, width, height),
      width,
      height
    );
    setCrop(initialCrop);
  };

  const getCroppedImg = async () => {
    if (!imgRef.current || !completedCrop) return;
    setIsProcessing(true);

    const canvas = document.createElement('canvas');
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.drawImage(
        imgRef.current,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        completedCrop.width,
        completedCrop.height
      );

      canvas.toBlob((blob) => {
        if (blob) {
          setResultUrl(URL.createObjectURL(blob));
        }
        setIsProcessing(false);
      }, 'image/png');
    }
  };

  const download = () => {
    if (!resultUrl) return;
    const link = document.createElement('a');
    link.href = resultUrl;
    link.download = `cropped-${file?.name}`;
    link.click();
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-bold">Crop Image</h1>
        <p className="text-white/60">Trim your images with precision. Support for freeform and fixed aspect ratios.</p>
      </div>

      {!file ? (
        <SmartDropzone
          onFileSelect={onSelectFile}
          accept="image/*"
          title="Select image to crop"
          description="JPG, PNG, WebP supported"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="glass p-6 rounded-3xl space-y-6">
              <div className="space-y-4">
                <label className="text-sm font-medium text-white/40">Aspect Ratio</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Free', value: undefined, icon: Maximize },
                    { label: '1:1', value: 1, icon: Square },
                    { label: '4:3', value: 4/3, icon: CropIcon },
                    { label: '16:9', value: 16/9, icon: CropIcon },
                  ].map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => setAspect(opt.value)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-colors ${
                        aspect === opt.value ? 'bg-primary text-white' : 'glass hover:bg-white/10 text-white/60'
                      }`}
                    >
                      <opt.icon size={14} />
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={getCroppedImg}
                disabled={isProcessing || !completedCrop}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <CropIcon size={18} />}
                Apply Crop
              </button>
            </div>

            {resultUrl && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass p-6 rounded-3xl border-emerald-500/20 bg-emerald-500/5 text-center"
              >
                <div className="flex items-center justify-center gap-2 text-emerald-500 font-bold mb-4">
                  <CheckCircle2 size={20} />
                  <span>Crop Ready</span>
                </div>
                <button onClick={download} className="btn-primary w-full bg-emerald-500 hover:bg-emerald-600">
                  Download Image
                </button>
              </motion.div>
            )}
          </div>

          <div className="lg:col-span-3">
            <div className="glass rounded-[40px] p-8 flex items-center justify-center bg-black/20 overflow-hidden">
              {imgSrc && (
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={aspect}
                  className="max-h-[70vh]"
                >
                  <img
                    ref={imgRef}
                    alt="Crop me"
                    src={imgSrc}
                    onLoad={onImageLoad}
                    className="max-w-full"
                  />
                </ReactCrop>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
