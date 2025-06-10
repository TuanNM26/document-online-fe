"use client";

import dynamic from "next/dynamic";

const PDFViewer = dynamic(() => import("./pdfViewer"), {
  ssr: false,
});

export default PDFViewer;
