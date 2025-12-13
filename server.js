import express from "express";
import bodyParser from "body-parser";
import { generateData } from "./generator.js";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";

/* -------------------- PATH FIX FOR VERCEL -------------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* -------------------- APP SETUP -------------------- */
const app = express();

const MAX_ROWS = 5000;
const MAX_BATCH = 2000;

/* -------------------- VIEW ENGINE & STATIC -------------------- */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json({ limit: "2mb" }));

/* -------------------- ROUTES -------------------- */
app.get("/", (req, res) => {
  res.render("index");
});

/* -------------------- API FORWARDING LOGIC -------------------- */
async function postToApi(rows, target) {
  const url = target.url;
  const headers = target.headers || { "Content-Type": "application/json" };
  const batchSize = Math.min(MAX_BATCH, Number(target.batchSize) || 10);
  const timeout = Math.max(1000, Number(target.timeout) || 15000);

  const results = [];

  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);

    let attempts = 0;
    while (attempts < 3) {
      attempts++;
      try {
        const resp = await axios.post(url, batch, {
          headers,
          timeout,
        });

        results.push({
          ok: true,
          status: resp.status,
          sent: batch.length,
          data: resp.data,
        });
        break;

      } catch (err) {
        if (attempts >= 3) {
          results.push({
            ok: false,
            sent: batch.length,
            attempts,
            error: err.message || String(err),
          });
        } else {
          await new Promise((r) =>
            setTimeout(r, 500 * Math.pow(2, attempts))
          );
        }
      }
    }
  }

  return results;
}

/* -------------------- GENERATE ENDPOINT -------------------- */
app.post("/generate", async (req, res) => {
  try {
    const { schema, rows = 1, target = null, dryRun = false } = req.body;

    if (!schema || typeof schema !== "object") {
      return res.status(400).json({
        ok: false,
        error: "Invalid schema",
      });
    }

    const count = Math.min(MAX_ROWS, Number(rows) || 1);

    const generatedRows = [];
    for (let i = 0; i < count; i++) {
      generatedRows.push(generateData(schema));
    }

    /* ---------- DRY RUN / NO TARGET ---------- */
    if (dryRun || !target || !target.type) {
      let out = "";
      for (const obj of generatedRows) {
        out += JSON.stringify(obj, null, 2) + "\n\n";
      }
      return res.type("text/plain").send(out);
    }

    /* ---------- API FORWARDING ---------- */
    if (target.type === "api") {
      if (
        !target.url ||
        (!target.url.startsWith("http://") &&
          !target.url.startsWith("https://"))
      ) {
        return res.status(400).json({
          ok: false,
          error: "Invalid API URL",
        });
      }

      const result = await postToApi(generatedRows, target);

      return res.json({
        ok: true,
        forwarded: true,
        target: "api",
        result,
      });
    }

    return res.status(400).json({
      ok: false,
      error: "Unknown target type",
    });

  } catch (err) {
    console.error("Error in /generate:", err);
    return res.status(500).json({
      ok: false,
      error: err.message || String(err),
    });
  }
});

/* -------------------- EXPORT FOR VERCEL -------------------- */
export default app;
