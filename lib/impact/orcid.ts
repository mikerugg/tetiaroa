const orcidPattern = /^\d{4}-\d{4}-\d{4}-[\dX]{4}$/i;

export function getOrcidIdentifier(value: string | null | undefined) {
  const identifier = value
    ?.trim()
    .replace(/^https?:\/\/orcid\.org\//i, "")
    .replace(/^orcid:\s*/i, "")
    .toUpperCase();

  if (!identifier || !orcidPattern.test(identifier)) {
    return undefined;
  }

  const compactIdentifier = identifier.replaceAll("-", "");
  let total = 0;

  for (const character of compactIdentifier.slice(0, 15)) {
    total = (total + Number(character)) * 2;
  }

  const checkValue = (12 - (total % 11)) % 11;
  const checkCharacter = checkValue === 10 ? "X" : String(checkValue);

  return compactIdentifier.at(-1) === checkCharacter ? identifier : undefined;
}

export function normalizeOrcidUrl(value: string | null | undefined) {
  const identifier = getOrcidIdentifier(value);
  return identifier ? `https://orcid.org/${identifier}` : undefined;
}
