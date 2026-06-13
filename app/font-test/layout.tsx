import type { ReactNode } from "react";
import {
  Albert_Sans,
  Archivo_Black,
  Archivo_Narrow,
  Azeret_Mono,
  Barlow_Condensed,
  Bebas_Neue,
  Cormorant_Garamond,
  Crimson_Pro,
  DM_Mono,
  DM_Serif_Display,
  EB_Garamond,
  Fira_Code,
  Fjalla_One,
  IBM_Plex_Mono,
  IBM_Plex_Sans,
  Inconsolata,
  Instrument_Serif,
  League_Gothic,
  Libre_Baskerville,
  Literata,
  Manrope,
  Newsreader,
  Oswald,
  Outfit,
  Playfair_Display,
  Plus_Jakarta_Sans,
  Public_Sans,
  Red_Hat_Mono,
  Roboto_Condensed,
  Roboto_Mono,
  Source_Code_Pro,
  Source_Sans_3,
  Source_Serif_4,
  Space_Grotesk,
  Space_Mono,
  Spectral,
  Teko,
  Work_Sans,
} from "next/font/google";

const cormorant = Cormorant_Garamond({
  variable: "--font-test-cormorant",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-test-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

const dmSerif = DM_Serif_Display({
  variable: "--font-test-dm-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: "400",
});

const libreBaskerville = Libre_Baskerville({
  variable: "--font-test-libre-baskerville",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "700"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-test-source-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-test-instrument-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: "400",
});

const newsreader = Newsreader({
  variable: "--font-test-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

const ebGaramond = EB_Garamond({
  variable: "--font-test-eb-garamond",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

const crimsonPro = Crimson_Pro({
  variable: "--font-test-crimson-pro",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

const spectral = Spectral({
  variable: "--font-test-spectral",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

const literata = Literata({
  variable: "--font-test-literata",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

const manrope = Manrope({
  variable: "--font-test-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-test-ibm-plex-sans",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-test-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const publicSans = Public_Sans({
  variable: "--font-test-public-sans",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

const sourceSans = Source_Sans_3({
  variable: "--font-test-source-sans",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

const workSans = Work_Sans({
  variable: "--font-test-work-sans",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-test-plus-jakarta",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

const outfit = Outfit({
  variable: "--font-test-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const albertSans = Albert_Sans({
  variable: "--font-test-albert-sans",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

const bebas = Bebas_Neue({
  variable: "--font-test-bebas",
  subsets: ["latin"],
  weight: "400",
});

const archivoBlack = Archivo_Black({
  variable: "--font-test-archivo-black",
  subsets: ["latin"],
  weight: "400",
});

const leagueGothic = League_Gothic({
  variable: "--font-test-league-gothic",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-test-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-test-barlow-condensed",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

const teko = Teko({
  variable: "--font-test-teko",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const fjalla = Fjalla_One({
  variable: "--font-test-fjalla",
  subsets: ["latin"],
  weight: "400",
});

const robotoCondensed = Roboto_Condensed({
  variable: "--font-test-roboto-condensed",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

const archivoNarrow = Archivo_Narrow({
  variable: "--font-test-archivo-narrow",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

const firaCode = Fira_Code({
  variable: "--font-test-fira-code",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-test-ibm-plex-mono",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-test-roboto-mono",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

const sourceCodePro = Source_Code_Pro({
  variable: "--font-test-source-code-pro",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

const spaceMono = Space_Mono({
  variable: "--font-test-space-mono",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "700"],
});

const inconsolata = Inconsolata({
  variable: "--font-test-inconsolata",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmMono = DM_Mono({
  variable: "--font-test-dm-mono",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500"],
});

const azeretMono = Azeret_Mono({
  variable: "--font-test-azeret-mono",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

const redHatMono = Red_Hat_Mono({
  variable: "--font-test-red-hat-mono",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

const fontClasses = [
  cormorant.variable,
  playfair.variable,
  dmSerif.variable,
  libreBaskerville.variable,
  sourceSerif.variable,
  instrumentSerif.variable,
  newsreader.variable,
  ebGaramond.variable,
  crimsonPro.variable,
  spectral.variable,
  literata.variable,
  manrope.variable,
  ibmPlexSans.variable,
  spaceGrotesk.variable,
  publicSans.variable,
  sourceSans.variable,
  workSans.variable,
  plusJakarta.variable,
  outfit.variable,
  albertSans.variable,
  bebas.variable,
  archivoBlack.variable,
  leagueGothic.variable,
  oswald.variable,
  barlowCondensed.variable,
  teko.variable,
  fjalla.variable,
  robotoCondensed.variable,
  archivoNarrow.variable,
  firaCode.variable,
  ibmPlexMono.variable,
  robotoMono.variable,
  sourceCodePro.variable,
  spaceMono.variable,
  inconsolata.variable,
  dmMono.variable,
  azeretMono.variable,
  redHatMono.variable,
].join(" ");

export default function FontTestLayout({ children }: { children: ReactNode }) {
  return <div className={fontClasses}>{children}</div>;
}
