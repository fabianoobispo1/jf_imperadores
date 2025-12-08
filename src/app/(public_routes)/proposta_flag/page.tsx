"use client";

import React, { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";

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
    <div style={{ padding: 12, minHeight: "100vh", background: "#000" }}>
      <div
        style={{
          maxWidth: 960,
          margin: "12px auto",
          background: "#111",
          borderRadius: 8,
          overflow: "hidden",
          boxShadow: "0 6px 18px rgba(0,0,0,0.6)",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            padding: 8,
          }}
        >
          <a
            href={PDF_SRC}
            download
            style={{
              color: "#fff",
              opacity: 0.9,
              textDecoration: "underline",
            }}
          >
            Baixar PDF
          </a>
          <a
            href={PDF_SRC}
            target="_blank"
            rel="noreferrer"
            style={{ color: "#fff", marginLeft: "auto" }}
          >
            Abrir em nova aba
          </a>
        </div>

        <div
          style={{
            position: "relative",
            width: "100%",
            height: "70vh",
            minHeight: 420,
          }}
        >
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

          {/* Visualizador embutido — carregado direto */}
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
              color: "#fff",
              padding: 24,
              textAlign: "center",
              overflow: "auto",
              background: "#000",
            }}
          >
            <div style={{ display: "flex", justifyContent: "center", padding: 12 }}>
              <canvas ref={canvasRef} style={{ maxWidth: "100%", height: "auto" }} />
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", padding: 12 }}>
              <button
                onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
                disabled={pageNumber <= 1}
                style={{ padding: "6px 10px", borderRadius: 6 }}
              >
                Anterior
              </button>
              <div style={{ color: "#fff", alignSelf: "center" }}>
                Página {pageNumber} {numPages ? `de ${numPages}` : ""}
              </div>
              <button
                onClick={() => setPageNumber((p) => (numPages ? Math.min(numPages, p + 1) : p + 1))}
                disabled={numPages !== null && pageNumber >= numPages}
                style={{ padding: "6px 10px", borderRadius: 6 }}
              >
                Próxima
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
