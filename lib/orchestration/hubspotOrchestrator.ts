// /lib/orchestration/hubspotOrchestrator.ts
import { LeadOrchestrator, LeadPayload } from "./orchestrator";
import { findContactIdByEmail, upsertContact } from "@/lib/hubspot/contacts";
import { createDeal } from "@/lib/hubspot/deals";
import { associateContactToDeal } from "@/lib/hubspot/associations";
import { submitHubSpotForm } from "@/lib/hubspot/forms";
import { createNote } from "@/lib/hubspot/notes";
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
    const existingContactId = await findContactIdByEmail(payload.email);

    // Returning visitor — log a note (if they left a message) and return early
    if (existingContactId) {
      if (payload.message) {
        await createNote({
          message: payload.message,
          businessType: payload.businessType,
          pageUri: payload.pageUri,
          pageName: payload.pageName,
          contactId: existingContactId,
        });
      }

      return {
        ok: true as const,
        existingContact: true,
      };
    }

    // --- New contact flow ---

    // 1) Create contact via CRM
    const { contactId } = await upsertContact({
      email: payload.email,
      firstname: payload.name,
      businessType: payload.businessType,
    });

    // 2) (Optional) submit as a real HubSpot form submission for analytics/workflows
    if (portalId && formGuid) {
      try {
        await submitHubSpotForm({
          portalId,
          formGuid,
          fields: [
            { name: "email", value: payload.email },
            { name: "firstname", value: payload.name },
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

    // 3) Create deal in your pipeline/stage
    const dealId = await createDeal({
      dealname: `Booked Call – ${payload.name} (${payload.email})`,
      pipeline: HUBSPOT_PIPELINE.pipelineId,
      dealstage: BOOKED_CALL_STAGE_ID,
    });

    // 4) Associate deal ↔ contact
    await associateContactToDeal(contactId, dealId);

    // 5) If the user left a message, store it as a NOTE associated to both Contact and Deal
    if (payload.message) {
      await createNote({
        message: payload.message,
        businessType: payload.businessType,
        pageUri: payload.pageUri,
        pageName: payload.pageName,
        contactId,
        dealId,
      });
    }

    return {
      ok: true as const,
      dealId,
      existingContact: false,
    };
  }
}
