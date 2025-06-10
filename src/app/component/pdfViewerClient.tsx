"use client";

import dynamic from "next/dynamic";

// Dynamic import PDFViewer with ssr: false
const PDFViewer = dynamic(() => import("./pdfViewer"), {
  ssr: false,
});

export default PDFViewer;
