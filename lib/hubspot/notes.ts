// /lib/hubspot/notes.ts
// Notes (create engagement note via CRM v3 objects API)

import { hsFetch } from "./client";

export async function createNote(input: {
  message: string;
  businessType?: string;
  pageUri?: string;
  pageName?: string;
  timestamp?: string;
  contactId: string;
  dealId?: string;
}): Promise<string> {
  const lines = [input.message];
  if (input.businessType) lines.push(`Business type: ${input.businessType}`);
  if (input.pageUri) lines.push(`Page: ${input.pageUri}`);
  if (input.pageName) lines.push(`Page name: ${input.pageName}`);

  const ts = input.timestamp ?? new Date().toISOString();
  lines.push(`Submitted: ${ts}`);

  const body = lines.join("\n");

  type Association = {
    to: { id: string };
    types: { associationCategory: string; associationTypeId: number }[];
  };

  const associations: Association[] = [
    {
      to: { id: input.contactId },
      types: [
        {
          associationCategory: "HUBSPOT_DEFINED",
          associationTypeId: 202, // note_to_contact
        },
      ],
    },
  ];

  if (input.dealId) {
    associations.push({
      to: { id: input.dealId },
      types: [
        {
          associationCategory: "HUBSPOT_DEFINED",
          associationTypeId: 214, // note_to_deal
        },
      ],
    });
  }

  const out = await hsFetch<{ id: string }>("crm", "/crm/v3/objects/notes", {
    method: "POST",
    json: {
      properties: {
        hs_note_body: body,
        hs_timestamp: ts,
      },
      associations,
    },
  });

  return out.id;
}
