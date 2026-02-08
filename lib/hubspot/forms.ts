// // /lib/hubspot/forms.ts
// // Form submit (secure submit)
// /lib/hubspot/forms.ts
import { hsFetch } from "./client";

type FormField = { name: string; value: string };
type FormContext = {
  pageUri?: string;
  pageName?: string;
  hutk?: string;
};

export async function submitHubSpotForm(input: {
  portalId: string;
  formGuid: string;
  fields: FormField[];
  context?: FormContext;
  pageUri?: string;
  pageName?: string;
}) {
  const { portalId, formGuid, fields, context, pageUri, pageName } = input;

  // Use the non-secure integration submit first (works in most MVP cases)
  const path = `/submissions/v3/integration/submit/${portalId}/${formGuid}`;
  const fallbackContext: FormContext | undefined =
    pageUri || pageName ? { pageUri, pageName } : undefined;
  const resolvedContext: FormContext | undefined = context ?? fallbackContext;

  return hsFetch("forms", path, {
    method: "POST",
    auth: false, // forms submit endpoint typically doesn't use Bearer token
    json: {
      fields,
      context: resolvedContext,
    },
  });
}
// import { hsFetch } from "./client";

// // Secure submit endpoint  [oai_citation:8‡HubSpot Developers](https://developers.hubspot.com/docs/api-reference/legacy/forms-v3-legacy/post-submissions-v3-integration-secure-submit-portalId-formGuid?utm_source=chatgpt.com)
// export async function secureSubmitForm(input: {
//   portalId: string;
//   formGuid: string;
//   fields: { name: string; value: string }[];
//   context?: {
//     pageUri?: string;
//     pageName?: string;
//     hutk?: string; // HubSpot tracking cookie value, if you capture it client-side
//   };
// }) {
//   const path = `/submissions/v3/integration/secure/submit/${input.portalId}/${input.formGuid}`;

//   return hsFetch(path, {
//     method: "POST",
//     json: {
//       fields: input.fields,
//       context: input.context,
//     },
//   });
// }
