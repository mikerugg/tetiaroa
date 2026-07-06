import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ImpactEntryNotFound() {
  return (
    <main className="grid min-h-dvh place-items-center bg-background px-5 py-12 text-foreground">
      <div className="flex max-w-xl flex-col gap-5 rounded-md border border-border bg-card p-6 shadow-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
          Impact archive
        </p>
        <h1 className="font-display text-4xl leading-tight">
          This impact entry is not published here yet.
        </h1>
        <p className="text-sm leading-7 text-muted-foreground">
          It may still be in draft, waiting to migrate from Drupal, or available
          under a different slug.
        </p>
        <Button asChild variant="outline" className="w-fit">
          <Link href="/impact">
            <ArrowLeftIcon data-icon="inline-start" aria-hidden="true" />
            Back to Impact Feed
          </Link>
        </Button>
      </div>
    </main>
  );
}
