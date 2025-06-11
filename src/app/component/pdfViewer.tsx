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
    const loadPDF = async () => {
      const loadingTask = pdfjsLib.getDocument(filePath);
      const pdf = await loadingTask.promise;
      setNumPages(pdf.numPages);

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        const page = await pdf.getPage(pageNumber);
        const scale = 1.5;
        const viewport = page.getViewport({ scale, rotation: page.rotate });

        const canvas = canvasRefs.current[pageNumber - 1];
        if (!canvas) continue;

        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context!,
          viewport,
        };

        await page.render(renderContext).promise;
      }
    };

    loadPDF().catch((error) => console.error("PDF load error:", error));
  }, [filePath]);

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-2"></h3>
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
