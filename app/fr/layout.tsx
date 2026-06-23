import { DocumentLanguage } from "../document-language";

export default function FrenchLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div lang="fr">
      <DocumentLanguage lang="fr" />
      {children}
    </div>
  );
}
