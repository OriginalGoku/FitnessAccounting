import path from "path";
import TextToSVG from "text-to-svg";

export const runtime = "nodejs";

function makeSvgPath(text: string) {
  const fontPath = path.join(
    process.cwd(),
    "public",
    "fonts",
    "Inter-SemiBold.ttf",
  );
  const textToSVG = TextToSVG.loadSync(fontPath);

  const d = textToSVG.getD(text, {
    x: 0,
    y: 0,
    fontSize: 14,
    anchor: "top",
  });

  const metrics = textToSVG.getMetrics(text, { fontSize: 14, anchor: "top" });
  const width = Math.ceil(metrics.width);
  const height = Math.ceil(metrics.height);

  return { d, width, height };
}

export async function GET() {
  const phone = process.env.CONTACT_PHONE;
  if (!phone) {
    return new Response("Missing CONTACT_PHONE", { status: 500 });
  }

  const { d, width, height } = makeSvgPath(phone);

  const color = "#94a3b8"; // Tailwind slate-400 – matches footer text

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg"
     width="${width}" height="${height}"
     viewBox="0 0 ${width} ${height}"
     role="img" aria-label="Phone">
  <path d="${d}" fill="${color}" />
</svg>`;

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
