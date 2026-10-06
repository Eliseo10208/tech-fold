import { ImageResponse } from "next/og";
import { createElement as h } from "react";
export const dynamic = "force-static";
export function GET() {
  return new ImageResponse(h("div", {
    style: { width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "80px", background: "#f8f7f3", color: "#202c32" },
  },
    h("div", { style: { color: "#58636a", fontSize: 26, marginBottom: 32 } }, "PORTAFOLIO / TUXTLA GUTIÉRREZ, MÉXICO"),
    h("div", { style: { fontSize: 78, fontWeight: 700, letterSpacing: -3, color: "#244f70" } }, "Rodrigo Eliseo García"),
    h("div", { style: { fontSize: 34, marginTop: 20, color: "#202c32" } }, "Full Stack Developer · React · Node.js · Python"),
    h("div", { style: { fontSize: 26, marginTop: 64, color: "#58636a", borderTop: "1px solid #cdd1d0", paddingTop: 20 } }, "rodrigo-e-g.lat")
  ), { width: 1200, height: 630 });
}
