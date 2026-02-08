// /lib/hubspot/contacts.ts

// Contacts (search by email + upsert)
import { hsFetch, HubSpotError } from "./client";

type Contact = { id: string; properties?: Record<string, any> };

export type UpsertContactResult = {
  contactId: string;
  existingContact: boolean;
};

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function extractExistingIdFromConflictBody(bodyText: string): string | null {
  const match = bodyText.match(/Existing ID:\s*([0-9]+)/i);
  return match?.[1] ?? null;
}

export async function findContactIdByEmail(
  email: string,
): Promise<string | null> {
  const normalizedEmail = normalizeEmail(email);

  // POST /crm/v3/objects/contacts/search  [oai_citation:4‡HubSpot Developers](https://developers.hubspot.com/docs/api-reference/crm-contacts-v3/search/post-crm-v3-objects-contacts-search?utm_source=chatgpt.com)
  const out = await hsFetch<{
    total: number;
    results: Contact[];
  }>("crm", "/crm/v3/objects/contacts/search", {
    method: "POST",
    json: {
      filterGroups: [
        {
          filters: [
            { propertyName: "email", operator: "EQ", value: normalizedEmail },
          ],
        },
      ],
      properties: ["email"],
      limit: 1,
    },
  });

  return out.results?.[0]?.id ?? null;
}

export async function createContact(props: {
  email: string;
  firstname?: string;
  message?: string;
  businessType?: string;
}): Promise<UpsertContactResult> {
  const normalizedEmail = normalizeEmail(props.email);

  // POST /crm/v3/objects/contacts  [oai_citation:5‡HubSpot Developers](https://developers.hubspot.com/docs/api-reference/crm-contacts-v3/guide?utm_source=chatgpt.com)
  try {
    const out = await hsFetch<{ id: string }>(
      "crm",
      "/crm/v3/objects/contacts",
      {
        method: "POST",
        json: {
          properties: {
            email: normalizedEmail,
            firstname: props.firstname,
            // Consider mapping these to real HS properties you create (e.g. "business_type")
            // message: props.message,
          },
        },
      },
    );
    return { contactId: out.id, existingContact: false };
  } catch (error) {
    // HubSpot returns 409 if a contact with this email already exists.
    // Recover by extracting the contact id from response text or by re-searching.
    if (error instanceof HubSpotError && error.status === 409) {
      const idFromConflict = extractExistingIdFromConflictBody(error.bodyText);
      if (idFromConflict) {
        return { contactId: idFromConflict, existingContact: true };
      }

      const bySearch = await findContactIdByEmail(normalizedEmail);
      if (bySearch) {
        return { contactId: bySearch, existingContact: true };
      }
    }

    throw error;
  }
}

export async function updateContact(
  contactId: string,
  props: { firstname?: string },
): Promise<void> {
  await hsFetch("crm", `/crm/v3/objects/contacts/${contactId}`, {
    method: "PATCH",
    json: { properties: props },
  });
}

export async function upsertContact(input: {
  email: string;
  firstname?: string;
}): Promise<UpsertContactResult> {
  const email = normalizeEmail(input.email);
  const firstname = input.firstname?.trim();

  const existingId = await findContactIdByEmail(email);

  if (!existingId) {
    return createContact({ email, firstname });
  }
  // optional: update name if provided
  if (firstname) await updateContact(existingId, { firstname });
  return { contactId: existingId, existingContact: true };
}
