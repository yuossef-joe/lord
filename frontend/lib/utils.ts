import { type ClassValue, clsx } from "clsx";

// Simple className merge (no tailwind-merge dependency)
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Format price in EGP
export function formatPrice(price: number): string {
  return `EGP ${price.toLocaleString("en-EG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

// Truncate text
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "...";
}

// Generate session ID for guest cart
export function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let sessionId = localStorage.getItem("lord_session_id");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("lord_session_id", sessionId);
  }
  return sessionId;
}

// Debounce function
export function debounce<T extends (...args: Parameters<T>) => void>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Get password strength (0-4)
export function getPasswordStrength(password: string): number {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  return strength;
}

// Password strength label
export function getPasswordStrengthLabel(strength: number): {
  label: string;
  color: string;
} {
  switch (strength) {
    case 0:
    case 1:
      return { label: "Weak", color: "#DC3545" };
    case 2:
      return { label: "Fair", color: "#FFC107" };
    case 3:
      return { label: "Good", color: "#17A2B8" };
    case 4:
      return { label: "Strong", color: "#28A745" };
    default:
      return { label: "", color: "" };
  }
}

// Slug helper
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Check if we're on client side
export function isClient(): boolean {
  return typeof window !== "undefined";
}
