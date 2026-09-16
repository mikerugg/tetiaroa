"use client";

import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { TopToolbar, type TopToolbarCopy } from "@/app/top-toolbar";

function subscribeToSearch(callback: () => void) {
  window.addEventListener("popstate", callback);
  window.addEventListener("atoll-directory-change", callback);
  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener("atoll-directory-change", callback);
  };
}
function getCurrentSearch() { return window.location.search; }

/** Keep directory queries when switching language; presentation belongs to TopToolbar. */
export function AtollToolbar({ copy }: { copy: TopToolbarCopy }) {
  const pathname = usePathname();
  const query = useSyncExternalStore(subscribeToSearch, getCurrentSearch, () => copy.languageHref.includes("?") ? `?${copy.languageHref.split("?")[1]}` : "");
  const isDirectory = /^\/(?:fr\/)?island\/(?:guide|birds|plants|fish|turtles|marine-mammals|invertebrates)$/.test(pathname);
  const languageHref = isDirectory ? `${copy.languageHref.split("?")[0]}${query}` : copy.languageHref;
  return <TopToolbar copy={{ ...copy, languageHref }} />;
}
