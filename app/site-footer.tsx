import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type FooterLink = {
  href: string;
  label: string;
};

type FooterColumn = {
  title: string;
  links: FooterLink[];
};

export type SiteFooterCopy = {
  homeHref: string;
  description: string;
  columns: FooterColumn[];
  ctaEyebrow: string;
  ctaCopy: string;
  ctaHref: string;
  ctaLabel: string;
  legal: string;
  place: string;
};

const defaultCopy: SiteFooterCopy = {
  homeHref: "/",
  description:
    "Teti'aroa is not a backdrop. We protect the atoll through field science, island stewardship, and education rooted in place.",
  columns: [
    {
      title: "Explore",
      links: [
        { href: "/", label: "Home" },
        { href: "/team", label: "Our Team" },
        { href: "/our-logo", label: "Logo meaning" },
        { href: "/impact", label: "Impact Feed" },
      ],
    },
    {
      title: "Fieldwork",
      links: [
        { href: "/#honu-xr", label: "Honu XR" },
        { href: "/#sanctuary", label: "Turtle and shark sanctuary" },
        { href: "/#twin", label: "Digital twin" },
      ],
    },
    {
      title: "Connect",
      links: [
        { href: "/turtle-tales", label: "Turtle Tales" },
        { href: "/field-station", label: "Field Station" },
        { href: "https://www.tetiaroasociety.org/", label: "Official site" },
        { href: "https://www.tetiaroasociety.org/donate", label: "Donate" },
      ],
    },
  ],
  ctaEyebrow: "Back the fieldwork",
  ctaCopy:
    "Your gift becomes turtle patrols, reef monitoring, student lessons, and the unglamorous daily care an atoll needs.",
  ctaHref: "https://www.tetiaroasociety.org/donate",
  ctaLabel: "Fund the work",
  legal: "Tetiaroa Society / EIN 45-1080688",
  place: "Society Islands / French Polynesia",
};

export function SiteFooter({
  className,
  copy = defaultCopy,
}: {
  className?: string;
  copy?: SiteFooterCopy;
}) {
  return (
    <footer
      className={cn(
        "bg-background px-5 py-12 text-foreground md:px-8 lg:px-12",
        className,
      )}
    >
      <div className="mx-auto max-w-[1600px]">
        <Separator />

        <div className="grid gap-8 py-8 md:grid-cols-2 lg:grid-cols-[1.1fr_repeat(3,minmax(0,0.7fr))] xl:grid-cols-[1.15fr_repeat(3,minmax(0,0.7fr))_1fr]">
          <div className="flex flex-col gap-4">
            <Link href={copy.homeHref} className="block w-fit">
              <Image
                src="/logos/TSFP_Logo_2026_White.png"
                alt="Tetiaroa Society"
                width={596}
                height={371}
                className="h-20 w-auto object-contain"
              />
            </Link>
            <p className="max-w-sm text-sm leading-6 text-muted-foreground">
              {copy.description}
            </p>
          </div>

          {copy.columns.map((column) => (
            <FooterLinks key={column.title} column={column} />
          ))}

          <div className="flex flex-col gap-4 md:col-span-2 lg:col-span-4 xl:col-span-1">
            <p className="font-mono text-xs uppercase text-primary">
              {copy.ctaEyebrow}
            </p>
            <p className="text-sm leading-6 text-muted-foreground">
              {copy.ctaCopy}
            </p>
            <Button asChild variant="outline" className="w-fit">
              <a href={copy.ctaHref}>
                {copy.ctaLabel}
                <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
              </a>
            </Button>
          </div>
        </div>

        <Separator />

        <div className="flex flex-col gap-3 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>{copy.legal}</p>
          <p>{copy.place}</p>
        </div>
      </div>
    </footer>
  );
}

function FooterLinks({ column }: { column: FooterColumn }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="font-mono text-xs uppercase text-primary">{column.title}</p>
      <div className="flex flex-col gap-2 text-sm text-muted-foreground">
        {column.links.map((link) => (
          <FooterTextLink key={link.href} link={link} />
        ))}
      </div>
    </div>
  );
}

function FooterTextLink({ link }: { link: FooterLink }) {
  const className = "transition hover:text-foreground";

  if (link.href.startsWith("http")) {
    return (
      <a href={link.href} className={className}>
        {link.label}
      </a>
    );
  }

  return (
    <Link href={link.href} className={className}>
      {link.label}
    </Link>
  );
}
