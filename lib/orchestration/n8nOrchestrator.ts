// /lib/orchestration/n8nOrchestrator.ts
// (stub for later)
import { LeadOrchestrator, LeadPayload } from "./orchestrator";

export class N8nOrchestrator implements LeadOrchestrator {
  async handleLead(_payload: LeadPayload) {
    // Later: POST payload to n8n webhook and return.
    return { ok: true as const };
  }
}
