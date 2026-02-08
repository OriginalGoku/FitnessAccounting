// lib/hubspot/deals.ts
// Deals (create with stage + pipeline)
//Deal stage is set at creation by passing pipeline + dealstage properties.

import { hsFetch } from "./client";

// Create deal: include dealname + dealstage + pipeline  [oai_citation:6‡HubSpot Developers](https://developers.hubspot.com/docs/api-reference/crm-deals-v3/guide?utm_source=chatgpt.com)
export async function createDeal(input: {
  dealname: string;
  pipeline: string;
  dealstage: string;
}): Promise<string> {
  const out = await hsFetch<{ id: string }>("crm", "/crm/v3/objects/deals", {
    method: "POST",
    json: {
      properties: {
        dealname: input.dealname,
        pipeline: input.pipeline,
        dealstage: input.dealstage,
      },
    },
  });
  return out.id;
}
