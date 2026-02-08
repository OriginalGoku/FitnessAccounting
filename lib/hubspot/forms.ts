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

  const path = `/submissions/v3/integration/submit/${portalId}/${formGuid}`;
  const fallbackContext: FormContext | undefined =
    pageUri || pageName ? { pageUri, pageName } : undefined;
  const resolvedContext: FormContext | undefined = context ?? fallbackContext;

  return hsFetch("forms", path, {
    method: "POST",
    auth: false,
    json: {
      fields,
      context: resolvedContext,
    },
  });
}
