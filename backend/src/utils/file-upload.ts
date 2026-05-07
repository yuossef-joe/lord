const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export function isAllowedImageType(mimeType: string) {
  return ALLOWED_IMAGE_TYPES.has(mimeType);
}

export function sanitizeFilename(filename: string) {
  return filename.replace(/[^a-zA-Z0-9._-]/g, "_");
}
