import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Download,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Zap,
} from "lucide-react";
import confetti from "canvas-confetti";
import { renderAsync } from "docx-preview";
import AdBlock from "../../components/AdBlock";

export default function DocxToPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.toLowerCase().endsWith(".docx")) {
      setError("Please select a valid .docx file");
      setFile(null);
      setIsSuccess(false);
      return;
    }

    setFile(selectedFile);
    setError(null);
    setIsSuccess(false);
  };

  const waitForImages = async (root: HTMLElement) => {
    const images = Array.from(root.querySelectorAll("img"));

    await Promise.all(
      images.map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.onerror = () => resolve();
        });
      })
    );
  };

  const convert = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);
    setIsSuccess(false);

    let host: HTMLDivElement | null = null;

    try {
      const arrayBuffer = await file.arrayBuffer();

      host = document.createElement("div");
      host.style.position = "fixed";
      host.style.left = "-99999px";
      host.style.top = "0";
      host.style.width = "794px";
      host.style.background = "#ffffff";
      document.body.appendChild(host);

      const style = document.createElement("style");
      style.innerHTML = `
        .docx-wrapper { background: #fff !important; }

        .docx {
          width: 794px !important;
          margin: 0 auto !important;
          font-family: serif !important;
          line-height: 1.6 !important;
        }

        .docx p {
          margin: 0 0 12px 0 !important;
        }

        .docx table {
          border-collapse: collapse !important;
          width: 100% !important;
        }

        .docx td, .docx th {
          border: 1px solid #000 !important;
          padding: 6px !important;
        }

        .docx img {
          max-width: 100% !important;
          height: auto !important;
        }

        @media print {
          body {
            margin: 40px;
          }
        }
      `;
      host.appendChild(style);

      await renderAsync(arrayBuffer, host, undefined, {
        className: "docx",
        inWrapper: true,
        breakPages: true,
      });

      await waitForImages(host);

      if ("fonts" in document) {
        await (document as any).fonts.ready;
      }

      // 🔥 PRINT ENGINE
      const printWindow = window.open("", "_blank");

      if (!printWindow) {
        throw new Error("Popup blocked. Please allow popups.");
      }

      printWindow.document.write(`
  <html>
    <head>
      <title>${file.name}</title>
      <style>
        html, body {
          margin: 0;
          padding: 0;
          background: white;
        }

        body {
          padding: 40px;
          font-family: serif;
        }

        .docx {
          width: 100% !important;
          max-width: 794px;
          margin: 0 auto;
        }

        .docx-wrapper {
          background: white !important;
        }

        table {
          page-break-inside: avoid;
        }

        img {
          max-width: 100%;
        }

        @page {
          margin: 20mm;
        }
      </style>
    </head>
    <body>
      <div class="docx-container">
        ${host.querySelector(".docx-wrapper")?.innerHTML || host.innerHTML}
      </div>
    </body>
  </html>
`);

      printWindow.document.close();
      printWindow.focus();

      // slight delay ensures rendering completes
      setTimeout(() => {
        printWindow.print();
      }, 500);

      setIsSuccess(true);

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Conversion failed");
    } finally {
      if (host) document.body.removeChild(host);
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-bold">DOCX to PDF</h1>
        <p className="text-white/60">
          High-quality conversion using browser print engine.
        </p>
      </div>

      <div className="space-y-8">
        {!file ? (
          <label className="glass rounded-[40px] border-2 border-dashed border-white/10 hover:border-primary/50 transition-all cursor-pointer flex flex-col items-center justify-center p-24 group">
            <input
              type="file"
              className="hidden"
              accept=".docx"
              onChange={handleFileChange}
            />
            <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <FileText className="text-primary" size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-2">Drop your DOCX here</h3>
            <p className="text-white/40">or click to browse files</p>
          </label>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-8 rounded-[40px] space-y-8"
          >
            <div className="flex flex-col items-center space-y-6">
              <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center text-primary">
                <FileText size={48} />
              </div>

              <div className="text-center space-y-1">
                <h3 className="text-xl font-bold">{file.name}</h3>
                <p className="text-white/40">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 px-4 py-2 rounded-xl">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              {isSuccess && (
                <div className="flex items-center gap-2 text-emerald-500 text-sm bg-emerald-500/10 px-4 py-2 rounded-xl">
                  <CheckCircle2 size={16} />
                  Print dialog opened successfully!
                </div>
              )}

              <div className="flex gap-4 w-full max-w-sm">
                <button
                  onClick={convert}
                  disabled={isProcessing}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <RefreshCw className="animate-spin" size={18} />
                  ) : (
                    <Download size={18} />
                  )}
                  {isProcessing ? "Preparing..." : "Convert to PDF"}
                </button>

                <button
                  onClick={() => {
                    setFile(null);
                    setIsSuccess(false);
                    setError(null);
                  }}
                  className="glass px-6 py-3 rounded-full text-sm text-white/40 hover:text-white transition-colors"
                >
                  Change File
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {file && !isProcessing && <AdBlock />}

      <div className="glass p-8 rounded-[32px] bg-primary/5 border-primary/10">
        <h4 className="font-bold mb-4 flex items-center gap-2">
          <Zap size={18} className="text-primary" />
          Why use our converter?
        </h4>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-white/50">
          <li className="flex items-start gap-2">
            <span>Better formatting via browser print engine</span>
          </li>
          <li className="flex items-start gap-2">
            <span>No upload required</span>
          </li>
          <li className="flex items-start gap-2">
            <span>More accurate tables and layout</span>
          </li>
          <li className="flex items-start gap-2">
            <span>Instant processing</span>
          </li>
        </ul>
      </div>
    </div>
  );
}