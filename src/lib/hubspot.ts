export const HUBSPOT_PORTAL_ID =
  process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID?.trim() || "45023159";

export const HUBSPOT_REGION = process.env.NEXT_PUBLIC_HUBSPOT_REGION?.trim() || "na1";

const HUBSPOT_DEFAULT_FORM_ID =
  process.env.NEXT_PUBLIC_HUBSPOT_DEFAULT_FORM_ID?.trim() ||
  "0133caf3-53e5-403f-a894-cd0246642913";

export function extractHubspotFormIdFromDescription(description?: string): string | undefined {
  if (!description) return undefined;
  const match = description.match(/formId:\s*["']([^"']+)["']/i);
  const id = match?.[1]?.trim();
  return id || undefined;
}

export function resolveInternshipHubspotFormId(internship: {
  hubspotFormId?: string;
  description?: string;
}): string | undefined {
  const fromField = internship.hubspotFormId?.trim();
  if (fromField) return fromField;

  const fromDescription = extractHubspotFormIdFromDescription(internship.description);
  if (fromDescription) return fromDescription;

  return HUBSPOT_DEFAULT_FORM_ID;
}
