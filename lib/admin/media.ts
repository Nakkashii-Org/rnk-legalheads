/** A library image as the editors' picker sees it. */
export type MediaOption = { value: string; label: string; url: string; alt: string; decorative: boolean };

/** A library image with all its details (media library screen). */
export type MediaItem = {
  id: string;
  title: string;
  alt: string;
  decorative: boolean;
  credit: string;
  licence: "own" | "consent" | "licensed" | "original";
  url: string;
  contentType: string;
  bytes: number;
  width?: number;
  height?: number;
  uploadedBy: string;
  createdAt: string;
  usedBy: string[];
};

export const LICENCES = [
  { value: "own", label: "Firm's own photograph" },
  { value: "consent", label: "Portrait with the person's consent" },
  { value: "licensed", label: "Licensed image" },
  { value: "original", label: "Original illustration" },
] as const;

/** A small, cropped copy for lists: Cloudinary resizes through the URL; local development files are shown as they are. */
export function thumb(url: string, width = 240, height = 180): string {
  return url.includes("res.cloudinary.com") ? url.replace("/image/upload/", `/image/upload/c_fill,w_${width},h_${height},f_auto,q_auto/`) : url;
}
