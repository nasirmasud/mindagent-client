let cached: boolean | null = null;

export function hasWebGL(): boolean {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return false;
  }
  if (cached !== null) return cached;
  try {
    const canvas = document.createElement("canvas");
    cached = !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl2") || canvas.getContext("webgl"))
    );
  } catch {
    cached = false;
  }
  return cached;
}