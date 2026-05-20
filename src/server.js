import express from "express";
import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { fillApgePdf } from "./pdf/fillApgePdf.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const outputDir = path.join(projectRoot, "output");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: "2mb" }));
app.use(express.static(path.join(projectRoot, "public")));

app.post("/api/generate-pdf", async (req, res) => {
  try {
    const pdfBytes = await fillApgePdf(req.body);
    await fs.mkdir(outputDir, { recursive: true });

    const filename = `apge-completed-${Date.now()}.pdf`;
    const outputPath = path.join(outputDir, filename);
    await fs.writeFile(outputPath, pdfBytes);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=\"${filename}\"`);
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error("Failed to generate PDF", error);
    res.status(500).json({
      error: "Failed to generate PDF",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

app.listen(port, () => {
  console.log(`APG&E PDF filler demo running at http://localhost:${port}`);
});
