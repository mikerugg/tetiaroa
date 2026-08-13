const ROR_ID_PATTERN = /^0[0-9a-z]{8}$/i;

export function getRorDataCiteUrl(value: string | null | undefined) {
  const normalizedValue = value?.trim();
  if (!normalizedValue) {
    return undefined;
  }

  const rorId = normalizedValue
    .replace(/^https?:\/\/ror\.org\//i, "")
    .replace(/^https?:\/\/commons\.datacite\.org\/ror\.org\//i, "")
    .replace(/\/$/, "");

  return ROR_ID_PATTERN.test(rorId)
    ? `https://commons.datacite.org/ror.org/${rorId.toLocaleLowerCase()}`
    : undefined;
}
