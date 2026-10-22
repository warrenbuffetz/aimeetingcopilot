export function isPocMode(): boolean {
  return process.env.NEXT_PUBLIC_POC_MODE === "true";
}
