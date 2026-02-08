// /lib/hubspot/contacts.ts

// Contacts (search by email + upsert)
import { hsFetch, HubSpotError } from "./client";

type Contact = { id: string; properties?: Record<string, any> };

export type UpsertContactResult = {
  contactId: string;
  existingContact: boolean;
};

const ALLOWED_BUSINESS_TYPES = new Set([
  "personal-trainer",
  "online-coach",
  "group-fitness",
  "studio-owner",
  "other",
]);

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function normalizeBusinessType(value?: string): string | undefined {
  const candidate = value?.trim();
  if (!candidate) return undefined;

  return ALLOWED_BUSINESS_TYPES.has(candidate) ? candidate : undefined;
}

function getBusinessTypePropertyName(): string {
  const configured = process.env.HUBSPOT_BUSINESS_TYPE_PROPERTY?.trim();
  return configured || "business_type";
}

function isMissingPropertyError(
  error: HubSpotError,
  propertyName: string,
): boolean {
  if (error.status !== 400) return false;

  const body = error.bodyText.toLowerCase();
  const property = propertyName.toLowerCase();
  return (
    body.includes(property) &&
    body.includes("property") &&
    (body.includes("does not exist") || body.includes("not a valid property"))
  );
}

function extractExistingIdFromConflictBody(bodyText: string): string | null {
  const match = bodyText.match(/Existing ID:\s*([0-9]+)/i);
  return match?.[1] ?? null;
}

async function recoverFromConflict(
  error: unknown,
  email: string,
): Promise<UpsertContactResult | null> {
  if (!(error instanceof HubSpotError) || error.status !== 409) return null;

  const idFromConflict = extractExistingIdFromConflictBody(error.bodyText);
  if (idFromConflict) {
    return { contactId: idFromConflict, existingContact: true };
  }

  const bySearch = await findContactIdByEmail(email);
  if (bySearch) {
    return { contactId: bySearch, existingContact: true };
  }

  return null;
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
  const normalizedBusinessType = normalizeBusinessType(props.businessType);
  const businessTypeProperty = getBusinessTypePropertyName();

  const properties: Record<string, string> = {
    email: normalizedEmail,
  };
  if (props.firstname) {
    properties.firstname = props.firstname;
  }
  if (normalizedBusinessType) {
    properties[businessTypeProperty] = normalizedBusinessType;
  }

  // POST /crm/v3/objects/contacts  [oai_citation:5‡HubSpot Developers](https://developers.hubspot.com/docs/api-reference/crm-contacts-v3/guide?utm_source=chatgpt.com)
  try {
    const out = await hsFetch<{ id: string }>(
      "crm",
      "/crm/v3/objects/contacts",
      {
        method: "POST",
        json: {
          properties,
        },
      },
    );
    return { contactId: out.id, existingContact: false };
  } catch (error) {
    // HubSpot returns 409 if a contact with this email already exists.
    const conflictResult = await recoverFromConflict(error, normalizedEmail);
    if (conflictResult) return conflictResult;

    if (
      error instanceof HubSpotError &&
      normalizedBusinessType &&
      isMissingPropertyError(error, businessTypeProperty)
    ) {
      console.error(
        `[hubspot/contacts] Contact property "${businessTypeProperty}" is missing. Set HUBSPOT_BUSINESS_TYPE_PROPERTY to your HubSpot internal property name.`,
      );

      try {
        const fallbackOut = await hsFetch<{ id: string }>(
          "crm",
          "/crm/v3/objects/contacts",
          {
            method: "POST",
            json: {
              properties: {
                email: normalizedEmail,
                ...(props.firstname ? { firstname: props.firstname } : {}),
              },
            },
          },
        );
        return { contactId: fallbackOut.id, existingContact: false };
      } catch (fallbackError) {
        const fallbackConflict = await recoverFromConflict(
          fallbackError,
          normalizedEmail,
        );
        if (fallbackConflict) return fallbackConflict;
        throw fallbackError;
      }
    }

    throw error;
  }
}

export async function updateContact(
  contactId: string,
  props: { firstname?: string; businessType?: string },
): Promise<void> {
  const businessTypeProperty = getBusinessTypePropertyName();
  const normalizedBusinessType = normalizeBusinessType(props.businessType);
  const properties: Record<string, string> = {};

  if (props.firstname) {
    properties.firstname = props.firstname;
  }

  if (normalizedBusinessType) {
    properties[businessTypeProperty] = normalizedBusinessType;
  }

  if (Object.keys(properties).length === 0) {
    return;
  }

  try {
    await hsFetch("crm", `/crm/v3/objects/contacts/${contactId}`, {
      method: "PATCH",
      json: { properties },
    });
  } catch (error) {
    if (
      error instanceof HubSpotError &&
      normalizedBusinessType &&
      isMissingPropertyError(error, businessTypeProperty)
    ) {
      console.error(
        `[hubspot/contacts] Contact property "${businessTypeProperty}" is missing. Set HUBSPOT_BUSINESS_TYPE_PROPERTY to your HubSpot internal property name.`,
      );

      if (props.firstname) {
        await hsFetch("crm", `/crm/v3/objects/contacts/${contactId}`, {
          method: "PATCH",
          json: { properties: { firstname: props.firstname } },
        });
      }
      return;
    }

    throw error;
  }
}

export async function upsertContact(input: {
  email: string;
  firstname?: string;
  businessType?: string;
}): Promise<UpsertContactResult> {
  const email = normalizeEmail(input.email);
  const firstname = input.firstname?.trim();
  const businessType = normalizeBusinessType(input.businessType);

  const existingId = await findContactIdByEmail(email);

  if (!existingId) {
    return createContact({ email, firstname, businessType });
  }
  await updateContact(existingId, { firstname, businessType });
  return { contactId: existingId, existingContact: true };
}
