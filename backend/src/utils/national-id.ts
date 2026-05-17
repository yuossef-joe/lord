export function isValidNationalId(value: string) {
  return /^\d{14}$/.test(value);
}

export function maskNationalId(value?: string | null) {
  if (!value) return null;
  return value.replace(/\d(?=\d{4})/g, "*");
}
