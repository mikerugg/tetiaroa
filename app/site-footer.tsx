import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, MailIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ENGLISH_CONTACT_PATH, ENGLISH_DONATE_PATH } from "./language-links";

type FooterLink = {
  href: string;
  label: string;
};

type FooterColumn = {
  title: string;
  links: FooterLink[];
};

export type SocialPlatform =
  | "contact"
  | "facebook"
  | "instagram"
  | "linkedin"
  | "youtube";

export type FooterSocialLink = {
  platform: SocialPlatform;
  href: string;
  label: string;
};

export type SiteFooterCopy = {
  homeHref: string;
  columns: FooterColumn[];
  ctaEyebrow: string;
  ctaCopy: string;
  ctaHref: string;
  ctaLabel: string;
  socials: FooterSocialLink[];
  legal: string;
  place: string;
};

const socialIconPaths: Record<
  Exclude<SocialPlatform, "contact">,
  React.ReactNode
> = {
  facebook: (
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  ),
  instagram: (
    <>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </>
  ),
  linkedin: (
    <>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </>
  ),
  youtube: (
    <>
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
    </>
  ),
};

function SocialIcon({ platform }: { platform: SocialPlatform }) {
  if (platform === "contact") {
    return <MailIcon data-icon="inline-start" aria-hidden="true" />;
  }

  return (
    <svg
      data-icon="inline-start"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4"
      aria-hidden="true"
    >
      {socialIconPaths[platform]}
    </svg>
  );
}

const defaultCopy: SiteFooterCopy = {
  homeHref: "/",
  columns: [
    {
      title: "Explore",
      links: [
        { href: "/", label: "Home" },
        { href: "/team", label: "Our Team" },
        { href: "/our-logo", label: "Our Logo" },
        { href: "/our-story", label: "Our Story" },
      ],
    },
    {
      title: "Projects",
      links: [
        { href: "/impact", label: "Impact Feed" },
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
        {
          href: ENGLISH_CONTACT_PATH,
          label: "Contact us",
        },
      ],
    },
  ],
  ctaEyebrow: "Back The Work",
  ctaCopy:
    "Your gift becomes patrols, monitoring, lessons, and the daily care the atoll needs.",
  ctaHref: ENGLISH_DONATE_PATH,
  ctaLabel: "Fund the work",
  socials: [
    {
      platform: "contact",
      href: ENGLISH_CONTACT_PATH,
      label: "Contact us",
    },
    {
      platform: "facebook",
      href: "https://www.facebook.com/tetiaroasociety",
      label: "Facebook",
    },
    {
      platform: "instagram",
      href: "https://www.instagram.com/tetiaroasociety",
      label: "Instagram",
    },
    {
      platform: "linkedin",
      href: "https://www.linkedin.com/company/tetiaroa-society/",
      label: "LinkedIn",
    },
    {
      platform: "youtube",
      href: "https://www.youtube.com/channel/UCPGkXEFTswBQft-8LUcvmCw",
      label: "YouTube",
    },
  ],
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
                className="h-36 w-auto object-contain md:h-44 lg:h-48"
              />
            </Link>
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

        <div className="flex flex-col gap-4 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p className="order-2 sm:order-1">{copy.legal}</p>
          <div className="order-1 flex items-center gap-1 sm:order-2">
            {copy.socials.map((social) => (
              <FooterIconLink key={social.platform} social={social} />
            ))}
          </div>
          <p className="order-3">{copy.place}</p>
        </div>
      </div>
    </footer>
  );
}

function FooterIconLink({ social }: { social: FooterSocialLink }) {
  const buttonClassName = "text-muted-foreground hover:text-foreground";

  if (social.href.startsWith("http")) {
    return (
      <Button
        asChild
        variant="ghost"
        size="icon-sm"
        className={buttonClassName}
      >
        <a
          href={social.href}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={social.label}
        >
          <SocialIcon platform={social.platform} />
        </a>
      </Button>
    );
  }

  return (
    <Button asChild variant="ghost" size="icon-sm" className={buttonClassName}>
      <Link href={social.href} aria-label={social.label}>
        <SocialIcon platform={social.platform} />
      </Link>
    </Button>
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
