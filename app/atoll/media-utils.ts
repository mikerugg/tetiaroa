export function safeGuideHref(value: string) {
  return /^(https?:\/\/|\/(?![\/\\])|#|mailto:)/i.test(value) ? value : undefined;
}

export function getGuideVideoSource(value: string): { kind: "iframe" | "video"; url: string } | null {
  try {
    const url = new URL(value, "https://www.tetiaroasociety.org");
    if (!/^https?:$/.test(url.protocol)) return null;
    const parts = url.pathname.split("/").filter(Boolean);
    const youtube = url.hostname === "youtu.be" ? parts[0] : /(^|\.)youtube(?:-nocookie)?\.com$/.test(url.hostname) ? (parts[0] === "embed" || parts[0] === "shorts" ? parts[1] : url.searchParams.get("v")) : null;
    if (youtube && /^[\w-]+$/.test(youtube)) return { kind: "iframe", url: `https://www.youtube-nocookie.com/embed/${youtube}` };
    const vimeo = /(^|\.)vimeo\.com$/.test(url.hostname) ? parts.find((part) => /^\d+$/.test(part)) : null;
    if (vimeo) return { kind: "iframe", url: `https://player.vimeo.com/video/${vimeo}` };
    if (url.hostname === "videos.sproutvideo.com" && /^\/embed\/[a-z0-9]+\/[a-z0-9]+\/?$/i.test(url.pathname)) return { kind: "iframe", url: url.toString() };
    if (/\.(mp4|webm|ogv)$/i.test(url.pathname)) return { kind: "video", url: value };
  } catch { return null; }
  return null;
}
