import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FRENCH_IMPACT_PATH } from "@/app/language-links";

export default function FrenchImpactEntryNotFound() {
  return (
    <main className="grid min-h-dvh place-items-center bg-background px-5 py-12 text-foreground">
      <div className="flex max-w-xl flex-col gap-5 rounded-md border border-border bg-card p-6 shadow-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
          Archive d&apos;impact
        </p>
        <h1 className="font-display text-4xl leading-tight">
          Cette entrée d&apos;impact n&apos;est pas encore publiée ici.
        </h1>
        <p className="text-sm leading-7 text-muted-foreground">
          Elle est peut-être encore en brouillon, en attente de migration depuis
          Drupal, ou publiée sous une autre adresse.
        </p>
        <Button asChild variant="outline" className="w-fit">
          <Link href={FRENCH_IMPACT_PATH}>
            <ArrowLeftIcon data-icon="inline-start" aria-hidden="true" />
            Retour au fil d&apos;impact
          </Link>
        </Button>
      </div>
    </main>
  );
}
