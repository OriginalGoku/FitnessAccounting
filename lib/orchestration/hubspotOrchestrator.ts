// /lib/orchestration/hubspotOrchestrator.ts
import { LeadOrchestrator, LeadPayload } from "./orchestrator";
import { findContactIdByEmail, upsertContact } from "@/lib/hubspot/contacts";
import { createDeal } from "@/lib/hubspot/deals";
import { associateContactToDeal } from "@/lib/hubspot/associations";
import { submitHubSpotForm } from "@/lib/hubspot/forms";
import { HubSpotError } from "@/lib/hubspot/client";
import { HUBSPOT_PIPELINE, BOOKED_CALL_STAGE_ID } from "@/lib/pipelineMap";

function isCaptchaBlockedFormSubmit(error: unknown): boolean {
  if (!(error instanceof HubSpotError)) return false;
  if (error.status !== 400) return false;

  return (
    error.bodyText.includes("FORM_HAS_RECAPTCHA_ENABLED") ||
    error.bodyText.includes("can't receive API submissions as Captcha")
  );
}

export class HubSpotDirectOrchestrator implements LeadOrchestrator {
  async handleLead(payload: LeadPayload) {
    const portalId = process.env.HUBSPOT_PORTAL_ID;
    const formGuid = process.env.HUBSPOT_FORM_GUID;
    const existingContactIdBeforeSubmission = await findContactIdByEmail(
      payload.email,
    );
    const hadExistingContactBeforeSubmission =
      !!existingContactIdBeforeSubmission;

    // 1) (Optional) submit as a real HubSpot form submission  [oai_citation:9‡HubSpot Developers](https://developers.hubspot.com/docs/api-reference/legacy/forms-v3-legacy/post-submissions-v3-integration-secure-submit-portalId-formGuid?utm_source=chatgpt.com)
    if (portalId && formGuid) {
      try {
        await submitHubSpotForm({
          portalId,
          formGuid,
          fields: [
            { name: "email", value: payload.email },
            { name: "firstname", value: payload.name },
            // add more if these exist as HS form fields:
            // { name: "message", value: payload.message ?? "" },
          ],
          context: {
            pageUri: payload.pageUri,
            pageName: payload.pageName,
            hutk: payload.hutk,
          },
        });
      } catch (error) {
        if (isCaptchaBlockedFormSubmit(error)) {
          console.warn(
            "[HubSpotDirectOrchestrator] Form API submit skipped because CAPTCHA is enabled on this HubSpot form.",
          );
        } else {
          throw error;
        }
      }
    }

    // 2) Upsert contact via CRM  [oai_citation:10‡HubSpot Developers](https://developers.hubspot.com/docs/api-reference/crm-contacts-v3/search/post-crm-v3-objects-contacts-search?utm_source=chatgpt.com)
    const { contactId } = await upsertContact({
      email: payload.email,
      firstname: payload.name,
      businessType: payload.businessType,
    });

    // 3) Create deal in your pipeline/stage  [oai_citation:11‡HubSpot Developers](https://developers.hubspot.com/docs/api-reference/crm-deals-v3/guide?utm_source=chatgpt.com)
    const dealId = await createDeal({
      dealname: `Booked Call – ${payload.name} (${payload.email})`,
      pipeline: HUBSPOT_PIPELINE.pipelineId,
      dealstage: BOOKED_CALL_STAGE_ID,
    });

    // 4) Associate deal ↔ contact  [oai_citation:12‡HubSpot Developers](https://developers.hubspot.com/docs/api-reference/crm-associations-v4/guide?utm_source=chatgpt.com)
    await associateContactToDeal(contactId, dealId);

    return {
      ok: true as const,
      dealId,
      existingContact: hadExistingContactBeforeSubmission,
    };
  }
}
