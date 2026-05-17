export function nowInCairo() {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "Africa/Cairo" }));
}
