import { ImageResponse } from "next/og";
import { createElement as h } from "react";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Render once at build time; keep the original brand asset untouched.
export const dynamic = "force-static";
export const runtime = "nodejs";

export async function GET() {
  const cat = await readFile(join(process.cwd(), "public/icons/cat-peek.png"));
  return new ImageResponse(
    h("div", {
      style: {
        width: "100%", height: "100%", display: "flex",
        alignItems: "center", justifyContent: "center", background: "#f8f7f3",
      },
    }, h("img", {
      src: `data:image/png;base64,${cat.toString("base64")}`,
      width: 88, height: 67,
    })),
    { width: 96, height: 96 },
  );
}
