"use client";

import React, { useEffect, useState } from "react";

const PDF_FILE =
  "/Proposta de Captação de Patrocínios JF Imperadores - Campeonato Mineiro 2026.pdf";
const PDF_SRC = encodeURI(PDF_FILE);

export default function Page() {
  const [loadIframe, setLoadIframe] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Auto-load on desktop or if user previously carregou (cache por localStorage)
    try {
      const cached = localStorage.getItem("pdfLoaded_proposta");
      if (
        cached === "1" ||
        (typeof window !== "undefined" && window.innerWidth >= 768)
      ) {
        setLoadIframe(true);
      }
    } catch (e) {
      // ignore localStorage errors
    }
  }, []);

  useEffect(() => {
    if (loadIframe) {
      setLoading(true);
    }
  }, [loadIframe]);

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
          <button
            onClick={() => setLoadIframe(true)}
            style={{
              background: "#0ea5a4",
              border: "none",
              color: "#fff",
              padding: "8px 12px",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            Visualizar Proposta
          </button>
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

          {loadIframe ? (
            <iframe
              src={PDF_SRC}
              title="Proposta PDF"
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                background: "#000",
              }}
              loading="lazy"
              onLoad={handleLoad}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                padding: 24,
                textAlign: "center",
              }}
            >
              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 18,
                    fontWeight: 600,
                  }}
                >
                  Proposta JF Imperadores
                </p>
                <p
                  style={{
                    marginTop: 6,
                    opacity: 0.9,
                  }}
                >
                  Toque em "Visualizar Proposta" para carregar o PDF. Em celular
                  isso otimiza velocidade e dados.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
