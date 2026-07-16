import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { homeCopies } from "../home-copy";
import { SiteFooter } from "../site-footer";
import { TopToolbar } from "../top-toolbar";
import { mintRenderToken } from "../contact/timing-token";
import { EmailListForm } from "./email-list-form";
import {
  getEmailListToolbarCopy,
  emailListRouteCopy,
  type EmailListLocale,
} from "./email-list-route-copy";

export function EmailListPage({ locale = "en" }: { locale?: EmailListLocale }) {
  const copy = emailListRouteCopy[locale];
  const renderToken = mintRenderToken();
  const turnstileSiteKey =
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() ?? "";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <TopToolbar copy={getEmailListToolbarCopy(locale)} />

      <section className="px-5 pb-16 pt-28 md:px-8 md:pb-20 md:pt-32 lg:px-12">
        <div className="mx-auto grid max-w-[1600px] gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(360px,560px)] lg:items-start">
          <div className="flex max-w-4xl flex-col gap-5">
            <p className="font-mono text-xs uppercase leading-6 text-primary">
              {copy.eyebrow}
            </p>
            <h1 className="font-display text-4xl leading-tight sm:text-5xl md:text-7xl">
              {copy.title}
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
              {copy.intro}
            </p>
          </div>

          <Card className="rounded-md">
            <CardHeader>
              <CardTitle>{copy.form.title}</CardTitle>
              <CardDescription>{copy.form.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <EmailListForm
                locale={locale}
                copy={copy.form}
                renderToken={renderToken}
                turnstileSiteKey={turnstileSiteKey}
              />
            </CardContent>
            <CardFooter>
              <p className="text-xs leading-5 text-muted-foreground">
                {copy.footnote}
              </p>
            </CardFooter>
          </Card>
        </div>
      </section>

      <SiteFooter copy={homeCopies[locale].footer} />
    </main>
  );
}
