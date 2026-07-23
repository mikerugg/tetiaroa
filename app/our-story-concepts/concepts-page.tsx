import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { homeCopies } from "@/app/home-copy";
import { TopToolbar } from "@/app/top-toolbar";
import { HandoffConcept } from "./handoff-concept";
import { LedgerConcept } from "./ledger-concept";
import { RippleConcept } from "./ripple-concept";

export function ConceptsPage() {
  return (
    <>
      <TopToolbar copy={homeCopies.en.toolbar} />
      <main className="bg-background text-foreground">
        <header className="px-5 pb-20 pt-32 sm:px-8 lg:px-12 lg:pb-28 lg:pt-40">
          <div className="mx-auto max-w-[1500px]">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary sm:text-xs">
              Three homepage story studies
            </p>
            <div className="mt-6 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:gap-20">
              <h1 className="max-w-6xl font-header text-[clamp(5.5rem,12vw,12rem)] leading-[0.76]">
                Three openings. One honest center.
              </h1>
              <div className="flex flex-col gap-6">
                <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                  Each direction begins where the full story does: Tetiaroa came first. Brando put an ecological proposition into words. The Society must answer for what becomes of it.
                </p>
                <Button asChild variant="outline" className="h-auto w-fit rounded-full px-5 py-3">
                  <Link href="/our-story">
                    <ArrowLeftIcon data-icon="inline-start" aria-hidden="true" />
                    Read the full story
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </header>

        <HandoffConcept />
        <LedgerConcept />
        <RippleConcept />
      </main>
    </>
  );
}
