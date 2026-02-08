// /lib/hubspot/associations.ts
// Associations (contact ↔ deal)

import { hsFetch, HubSpotError } from "./client";

// Associations v4 guide  [oai_citation:7‡HubSpot Developers](https://developers.hubspot.com/docs/api-reference/crm-associations-v4/guide?utm_source=chatgpt.com)
export async function associateContactToDeal(
  contactId: string,
  dealId: string,
) {
  // Try documented default association endpoint first, then a pluralized fallback.
  // HubSpot docs show singular object names for default association routes.
  const paths = [
    `/crm/v4/objects/contact/${contactId}/associations/default/deal/${dealId}`,
    `/crm/v4/objects/contacts/${contactId}/associations/default/deals/${dealId}`,
  ];

  let last404: HubSpotError | null = null;

  for (const path of paths) {
    try {
      await hsFetch("crm", path, { method: "PUT" });
      return;
    } catch (error) {
      if (error instanceof HubSpotError && error.status === 404) {
        last404 = error;
        continue;
      }
      throw error;
    }
  }

  throw last404 ?? new Error("Unable to associate contact to deal");
}
