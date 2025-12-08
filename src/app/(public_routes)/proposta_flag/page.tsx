import React from "react";

export default function Page() {
  return (
    <div style={{ position: "fixed", inset: 0, background: "#000" }}>
      <iframe
        src="/01.pdf"
        title="Proposta PDF"
        style={{ width: "100%", height: "100%", border: "none" }}
      />
    </div>
  );
}
