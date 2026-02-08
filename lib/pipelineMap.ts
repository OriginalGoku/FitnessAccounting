// /lib/pipelineMap.ts

// Pipeline/stage constants (exctracted from config/hubspot.pipeline.json using scripts/hubspotPipelineMap.mjs
export const HUBSPOT_PIPELINE = {
  pipelineId: "default",
  stagesByLabel: {
    "New Lead": "appointmentscheduled",
    Contacted: "qualifiedtobuy",
    Replied: "presentationscheduled",
    "Booked Call": "decisionmakerboughtin",
    "No Show": "contractsent",
    Won: "stage_0",
    Lost: "stage_1",
  },
} as const;

export const BOOKED_CALL_STAGE_ID =
  HUBSPOT_PIPELINE.stagesByLabel["Booked Call"];
