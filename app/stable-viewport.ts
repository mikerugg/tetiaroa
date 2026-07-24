export type ViewportLayoutSnapshot = {
  height: number;
  portrait: boolean;
  width: number;
};

export function captureViewportLayout(): ViewportLayoutSnapshot {
  return {
    height: window.innerHeight,
    portrait: window.matchMedia("(orientation: portrait)").matches,
    width: window.innerWidth,
  };
}

export function shouldRefreshStableViewport(
  previous: ViewportLayoutSnapshot,
  next: ViewportLayoutSnapshot,
) {
  const widthChanged = previous.width !== next.width;
  const orientationChanged = previous.portrait !== next.portrait;
  const heightChanged = previous.height !== next.height;
  const isMobileViewport = window.matchMedia(
    "(pointer: coarse) and (max-width: 1024px)",
  ).matches;

  return (
    widthChanged ||
    orientationChanged ||
    (!isMobileViewport && heightChanged)
  );
}

export function measureSafeViewportHeight() {
  const probe = document.createElement("div");

  probe.style.position = "fixed";
  probe.style.top = "0";
  probe.style.left = "0";
  probe.style.width = "1px";
  probe.style.height = "100vh";
  probe.style.contain = "strict";
  probe.style.pointerEvents = "none";
  probe.style.visibility = "hidden";

  if (CSS.supports("height", "100svh")) {
    probe.style.height = "100svh";
  }

  document.body.append(probe);
  const height = probe.getBoundingClientRect().height;
  probe.remove();

  return height || document.documentElement.clientHeight || window.innerHeight;
}
