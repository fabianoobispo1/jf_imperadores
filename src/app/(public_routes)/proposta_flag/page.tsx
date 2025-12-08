"use client";

import React, { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PDF_FILE =
  "/Proposta de Captação de Patrocínios JF Imperadores - Campeonato Mineiro 2026.pdf";
const PDF_SRC = encodeURI(PDF_FILE);

export default function Page() {
  // abrir direto sem pedir ao usuário
  const [loadIframe, setLoadIframe] = useState(true);
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);

  useEffect(() => {
    setLoading(true);
  }, [loadIframe]);

  useEffect(() => {
    // configura worker
    try {
      // @ts-ignore
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${(pdfjsLib as any).version}/pdf.worker.min.js`;
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (loadIframe) {
      // já carrega pdf.js em vez do iframe
      setLoading(true);
      const loadPdf = async () => {
        try {
          const loadingTask = pdfjsLib.getDocument(PDF_SRC);
          const pdf = await loadingTask.promise;
          setPdfDoc(pdf);
          setNumPages(pdf.numPages);
          renderPage(pageNumber, pdf);
          setLoading(false);
          try {
            localStorage.setItem("pdfLoaded_proposta", "1");
          } catch (e) {}
        } catch (err) {
          console.error(err);
          setLoading(false);
        }
      };
      loadPdf();
    }
  }, [loadIframe]);

  const renderPage = async (num: number, pdfParam?: any) => {
    const pdfToUse = pdfParam || pdfDoc;
    if (!pdfToUse) return;
    const page = await pdfToUse.getPage(num);
    const viewport = page.getViewport({ scale: 1.5 });
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    const renderContext = {
      canvasContext: context,
      viewport,
    };
    await page.render(renderContext).promise;
  };

  useEffect(() => {
    if (pdfDoc) renderPage(pageNumber);
  }, [pageNumber, pdfDoc]);

  function handleLoad() {
    setLoading(false);
    try {
      localStorage.setItem("pdfLoaded_proposta", "1");
    } catch (e) {
      // ignore
    }
  }

  return (
    <div className={cn("p-3 min-h-screen bg-black")}>
      <div className={cn("max-w-3xl mx-auto bg-background rounded-lg overflow-hidden shadow-lg")}>
        <div className={cn("flex gap-2 items-center p-3")}>
          {/* Ações: baixar / abrir */}
          <Button asChild variant="ghost" size="sm">
            <a href={PDF_SRC} download>Baixar PDF</a>
          </Button>

          <div className="ml-auto flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <a href={PDF_SRC} target="_blank" rel="noreferrer">Abrir em nova aba</a>
            </Button>
          </div>
        </div>

        <div className={cn("relative w-full h-[70vh] min-h-[420px]")}>
          {loading && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(0,0,0,0.6)",
                zIndex: 5,
                color: "#fff",
                fontSize: 14,
              }}
            >
              Carregando proposta...
            </div>
          )}

          {loadIframe ? (
            <div className={cn("w-full h-full flex flex-col items-center justify-start text-white p-6 text-center overflow-auto bg-black")}>
              <div className="flex justify-center p-3 w-full">
                <canvas ref={canvasRef} className="max-w-full h-auto" />
              </div>
              <div className="flex gap-2 justify-center p-3">
                <Button onClick={() => setPageNumber((p) => Math.max(1, p - 1))} size="sm" disabled={pageNumber <= 1}>
                  Anterior
                </Button>
                <div className="text-white self-center">Página {pageNumber} {numPages ? `de ${numPages}` : ""}</div>
                <Button onClick={() => setPageNumber((p) => (numPages ? Math.min(numPages, p + 1) : p + 1))} size="sm" disabled={numPages !== null && pageNumber >= numPages}>
                  Próxima
                </Button>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white p-6 text-center">
              <div>
                <p className="m-0 text-lg font-semibold">Proposta JF Imperadores</p>
                <p className="mt-2 opacity-90">O PDF será aberto automaticamente.</p>
              </div>
            </div>
          )}
         </div>
       </div>
     </div>
   );
 }
