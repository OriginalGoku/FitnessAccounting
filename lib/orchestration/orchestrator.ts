// /lib/orchestration/orchestrator.ts
// Orchestrator interface (We can swap this to n8n later)
export type LeadPayload = {
  name: string;
  email: string;
  businessType?: string;
  message?: string;
  phone?: string;
  wantsCallback?: boolean;
  pageUri?: string;
  pageName?: string;
  hutk?: string;
};

export interface LeadOrchestrator {
  handleLead(payload: LeadPayload): Promise<{
    ok: true;
    dealId?: string;
    existingContact?: boolean;
  }>;
}
