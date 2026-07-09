"use client";

import Link from "next/link";
import { NextStudio } from "next-sanity/studio/client-component";
import { ArrowUpRightIcon } from "lucide-react";
import config from "@/sanity.config";
import { Button } from "@/components/ui/button";

const hasStudioConfig = Boolean(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
    process.env.NEXT_PUBLIC_SANITY_DATASET,
);

export default function StudioDevPage() {
  if (!hasStudioConfig) {
    return (
      <main className="grid min-h-dvh place-items-center bg-background px-5 py-12 text-foreground">
        <div className="flex max-w-xl flex-col gap-5 rounded-md border border-border bg-card p-6 shadow-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
            Sanity Studio
          </p>
          <h1 className="font-display text-4xl leading-tight">
            Connect the Sanity project to edit impact content.
          </h1>
          <p className="text-sm leading-7 text-muted-foreground">
            Add NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET to
            the local environment, then reload this route. The public site will
            keep using fallback impact content until those values exist.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/impact">
                Open impact feed
                <ArrowUpRightIcon data-icon="inline-end" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <a href="https://vercel.com/marketplace/sanity">
                Sanity on Vercel
                <ArrowUpRightIcon data-icon="inline-end" aria-hidden="true" />
              </a>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return <NextStudio config={config} />;
}
