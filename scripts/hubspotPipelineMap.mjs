// scripts/hubspotPipelineMap.mjs
import fs from "node:fs";
import path from "node:path";

const HUBSPOT_ACCESS_TOKEN = process.env.HUBSPOT_PRIVATE_APP_TOKEN;
const PIPELINE_LABEL =
  process.env.HUBSPOT_DEALS_PIPELINE_LABEL || "FitBooks Sales";
const OUTFILE =
  process.env.HUBSPOT_PIPELINE_MAP_FILE ||
  path.join(process.cwd(), "hubspot_deal_pipeline_map.json");

const STAGE_LABELS_IN_ORDER = [
  "New Lead",
  "Contacted",
  "Replied",
  "Booked Call",
  "No Show",
  "Won",
  "Lost",
];

async function hsGet(url) {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${HUBSPOT_ACCESS_TOKEN}` },
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`HubSpot GET failed ${res.status}: ${text}`);
  }
  return JSON.parse(text);
}

async function main() {
  if (!HUBSPOT_ACCESS_TOKEN || HUBSPOT_ACCESS_TOKEN.trim().length < 20) {
    throw new Error(
      "Missing/invalid HUBSPOT_ACCESS_TOKEN. Pipelines API requires Bearer auth (private app access token or OAuth).",
    );
  }

  // Deal pipelines
  const pipelinesData = await hsGet(
    "https://api.hubapi.com/crm/v3/pipelines/deals",
  );
  const pipelines = pipelinesData.results || [];
  if (!pipelines.length) throw new Error("No deal pipelines found.");

  const chosen =
    pipelines.find((p) => p.label === PIPELINE_LABEL) ||
    pipelines.find((p) => p.default) ||
    pipelines[0];

  const pipelineId = chosen.id;

  // Stages
  const stagesData = await hsGet(
    `https://api.hubapi.com/crm/v3/pipelines/deals/${pipelineId}/stages`,
  );
  const stages = stagesData.results || [];
  const stageByLabel = Object.fromEntries(stages.map((s) => [s.label, s.id]));

  const ordered = [];
  const missing = [];
  for (const label of STAGE_LABELS_IN_ORDER) {
    const id = stageByLabel[label];
    if (!id) missing.push(label);
    ordered.push({ label, id: id || null });
  }

  const out = {
    generatedAt: new Date().toISOString(),
    pipeline: { id: pipelineId, label: chosen.label },
    stages: ordered,
    stagesByLabel: stageByLabel,
    missingLabels: missing,
  };

  fs.writeFileSync(OUTFILE, JSON.stringify(out, null, 2), "utf-8");
  console.log(`Saved: ${OUTFILE}`);
  if (missing.length) console.log("WARNING missing stage labels:", missing);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
