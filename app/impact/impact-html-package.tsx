"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

type ImpactHtmlPackageProps = {
  html: string;
  title: string;
};

type FrameSize = {
  height: number;
  width: number;
};

type FrameSizeMessage = FrameSize & {
  channel: string;
  type: "tetiaroa-html-package:size";
};

const FALLBACK_HEIGHT = 480;
const RESIZE_NONCE = "tetiaroa-html-package-resizer";
const SIZE_MESSAGE_TYPE = "tetiaroa-html-package:size";
const MEASURE_MESSAGE_TYPE = "tetiaroa-html-package:measure";

function addResizeBridge(html: string, channel: string) {
  const sanitizedHtml = html.replace(
    /<script\b[^>]*>[\s\S]*?<\/script\s*>/gi,
    "",
  );
  const scriptPolicy = `script-src 'nonce-${RESIZE_NONCE}';`;
  const htmlWithScriptPolicy = sanitizedHtml.includes("default-src 'none';")
    ? sanitizedHtml.replace(
        "default-src 'none';",
        `default-src 'none'; ${scriptPolicy}`,
      )
    : sanitizedHtml.replace(
        /<head(\s[^>]*)?>/i,
        (head) =>
          `${head}<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src https://cdn.sanity.io data:; style-src 'unsafe-inline'; font-src data:; ${scriptPolicy} base-uri 'none'; form-action 'none';">`,
      );
  const bridge = `<script nonce="${RESIZE_NONCE}">
(() => {
  const channel = ${JSON.stringify(channel)};
  const sizeType = ${JSON.stringify(SIZE_MESSAGE_TYPE)};
  const measureType = ${JSON.stringify(MEASURE_MESSAGE_TYPE)};
  let lastSize = "";

  const measure = (force = false) => {
    const root = document.documentElement;
    const body = document.body;
    if (!root || !body) return;

    root.style.setProperty("background", "transparent", "important");
    root.style.setProperty("overflow", "hidden", "important");
    body.style.setProperty("background", "transparent", "important");
    body.style.setProperty("overflow", "hidden", "important");

    const outerTable = body.firstElementChild;
    if (outerTable?.tagName === "TABLE") {
      outerTable.style.setProperty("background", "transparent", "important");
      outerTable.removeAttribute("bgcolor");

      const outerCell = outerTable.querySelector(":scope > tbody > tr > td");
      outerCell?.style.setProperty("background", "transparent", "important");
      outerCell?.removeAttribute("bgcolor");
    }

    window.scrollTo(0, 0);

    let furthestRight = 0;
    let furthestBottom = 0;
    for (const element of body.querySelectorAll("*")) {
      const rect = element.getBoundingClientRect();
      furthestRight = Math.max(furthestRight, rect.right + window.scrollX);
      furthestBottom = Math.max(furthestBottom, rect.bottom + window.scrollY);
    }

    const width = Math.ceil(Math.max(
      root.scrollWidth,
      root.offsetWidth,
      body.scrollWidth,
      body.offsetWidth,
      furthestRight
    ));
    const height = Math.ceil(Math.max(
      root.scrollHeight,
      root.offsetHeight,
      body.scrollHeight,
      body.offsetHeight,
      furthestBottom
    ));
    const nextSize = width + "x" + height;

    if (force || nextSize !== lastSize) {
      lastSize = nextSize;
      parent.postMessage({ type: sizeType, channel, width, height }, "*");
    }
  };

  window.addEventListener("message", (event) => {
    if (event.source === parent && event.data?.type === measureType && event.data?.channel === channel) {
      measure(true);
    }
  });
  window.addEventListener("load", () => measure(true));

  const observer = new ResizeObserver(() => measure());
  observer.observe(document.documentElement);
  if (document.body) observer.observe(document.body);

  for (const image of document.images) {
    if (!image.complete) {
      image.addEventListener("load", () => measure(true), { once: true });
      image.addEventListener("error", () => measure(true), { once: true });
    }
  }

  document.fonts?.ready.then(() => measure(true));
  requestAnimationFrame(() => {
    measure(true);
    requestAnimationFrame(() => measure(true));
  });
})();
</script>`;

  if (/<\/body\s*>/i.test(htmlWithScriptPolicy)) {
    return htmlWithScriptPolicy.replace(/<\/body\s*>/i, `${bridge}</body>`);
  }

  return `${htmlWithScriptPolicy}${bridge}`;
}

function isFrameSizeMessage(value: unknown): value is FrameSizeMessage {
  if (!value || typeof value !== "object") {
    return false;
  }

  const message = value as Partial<FrameSizeMessage>;
  return (
    message.type === SIZE_MESSAGE_TYPE &&
    typeof message.channel === "string" &&
    typeof message.width === "number" &&
    Number.isFinite(message.width) &&
    message.width > 0 &&
    typeof message.height === "number" &&
    Number.isFinite(message.height) &&
    message.height > 0
  );
}

export function ImpactHtmlPackage({ html, title }: ImpactHtmlPackageProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const channel = useId();
  const [containerWidth, setContainerWidth] = useState(0);
  const [frameSize, setFrameSize] = useState<FrameSize>({
    height: FALLBACK_HEIGHT,
    width: 0,
  });
  const [isMeasured, setIsMeasured] = useState(false);
  const srcDoc = useMemo(() => addResizeBridge(html, channel), [channel, html]);

  const requestSize = useCallback(() => {
    iframeRef.current?.contentWindow?.postMessage(
      { type: MEASURE_MESSAGE_TYPE, channel },
      "*",
    );
  }, [channel]);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (
        event.source !== iframeRef.current?.contentWindow ||
        !isFrameSizeMessage(event.data) ||
        event.data.channel !== channel
      ) {
        return;
      }

      setFrameSize({ height: event.data.height, width: event.data.width });
      setIsMeasured(true);
    };

    window.addEventListener("message", onMessage);
    requestSize();

    return () => window.removeEventListener("message", onMessage);
  }, [channel, requestSize, srcDoc]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const observer = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });
    observer.observe(container);
    setContainerWidth(container.getBoundingClientRect().width);

    return () => observer.disconnect();
  }, []);

  const frameWidth = Math.max(frameSize.width, containerWidth);
  const scale =
    frameWidth > 0 && containerWidth > 0
      ? Math.min(1, containerWidth / frameWidth)
      : 1;
  const renderedHeight = Math.ceil(frameSize.height * scale);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden bg-transparent"
      style={{ height: isMeasured ? renderedHeight : FALLBACK_HEIGHT }}
    >
      <iframe
        ref={iframeRef}
        className="absolute top-0 left-0 block border-0 bg-transparent"
        style={{
          height: frameSize.height,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          visibility: isMeasured ? "visible" : "hidden",
          width: frameWidth || "100%",
        }}
        srcDoc={srcDoc}
        title={title}
        sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"
        referrerPolicy="no-referrer"
        scrolling="no"
        onLoad={requestSize}
      />
    </div>
  );
}
