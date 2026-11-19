export { cn } from "cn"
export function initials(name?: string | null) {
  if (!name) return "U";
  return name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");
}

/** Only allow same-site relative redirects (blocks open-redirect attacks) */
export function safeRedirect(path?: string | null) {
  if (!path || !path.startsWith("/") || path.startsWith("//") || path.startsWith("/\\")) return null;
  return path;
}