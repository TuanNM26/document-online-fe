"use client";

import { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/web/pdf_viewer.css";
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  filePath: string;
}

export default function PDFViewer({ filePath }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);

  useEffect(() => {
    let isCancelled = false;

    const loadPDF = async () => {
      const loadingTask = pdfjsLib.getDocument(filePath);
      const pdf = await loadingTask.promise;
      if (isCancelled) return;

      setNumPages(pdf.numPages);
      const renderPage = async (pageNumber: number) => {
        const page = await pdf.getPage(pageNumber);
        const scale = 2;
        const rotation = (page.rotate || 0) % 360;
        const viewport = page.getViewport({ scale, rotation });

        const canvas = canvasRefs.current[pageNumber - 1];
        if (!canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport,
        };

        const renderTask = page.render(renderContext);
        try {
          await renderTask.promise;
        } catch (err: any) {
          if (err?.name !== "RenderingCancelledException") {
          }
        }
      };

      for (let i = 1; i <= pdf.numPages; i++) {
        if (isCancelled) break;
        await renderPage(i);
      }
    };

    loadPDF().catch((error) => console.error("PDF load error:", error));

    return () => {
      isCancelled = true;
    };
  }, [filePath]);

  return (
    <div className="mt-8">
      <div className="space-y-6">
        {Array.from({ length: numPages }, (_, i) => (
          <canvas
            key={i}
            ref={(el) => {
              canvasRefs.current[i] = el;
            }}
            className="w-full shadow rounded border"
          />
        ))}
      </div>
    </div>
  );
}
