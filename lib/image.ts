/**
 * Blogger Image Variant Helper for galeri.kemenhajbovendigoel.id
 * Sourced from Google Blogger / lh3 Core CDN.
 */

export type ImageVariant = "thumb" | "card" | "medium" | "large" | "original";

const VARIANT_MAP: Record<ImageVariant, string> = {
  thumb: "w240-h180-c",
  card: "w480-h360-c",
  medium: "w800",
  large: "w1280",
  original: "s0",
};

export function bloggerVariant(url: string, variant: ImageVariant = "card"): string {
  if (!url) return "";
  const param = VARIANT_MAP[variant] || "w480-h360-c";

  // If already contains /s0/ or /s1600/ or /w...-h.../
  const regex = /\/(s\d+|s0|w\d+-h\d+[^/]*|w\d+)\/([^/]+)$/;
  if (regex.test(url)) {
    return url.replace(regex, `/${param}/$2`);
  }

  // Fallback FIFE parameter (=w...)
  if (url.includes("googleusercontent.com")) {
    const cleanUrl = url.split("=")[0];
    return `${cleanUrl}=${param}`;
  }

  return url;
}

export function bloggerSrcSet(url: string): string {
  if (!url) return "";
  const sSmall = bloggerVariant(url, "thumb");
  const sCard = bloggerVariant(url, "card");
  const sMed = bloggerVariant(url, "medium");
  const sLarge = bloggerVariant(url, "large");
  return `${sSmall} 240w, ${sCard} 480w, ${sMed} 800w, ${sLarge} 1280w`;
}
