const doiUrlValidationMessage =
  "Enter a canonical DOI URL, such as https://doi.org/10.1234/example.";

export function validateDoiUrl(value: unknown): true | string {
  if (value === undefined || value === null || value === "") {
    return true;
  }

  if (typeof value !== "string") {
    return doiUrlValidationMessage;
  }

  try {
    const url = new URL(value);
    const decodedPathname = decodeURIComponent(url.pathname);
    const hasCanonicalOrigin =
      (url.protocol === "http:" || url.protocol === "https:") &&
      url.hostname.toLowerCase() === "doi.org" &&
      !url.port &&
      !url.username &&
      !url.password;
    const hasCanonicalDoiPath = /^\/10\.\d{4,9}\/\S+$/i.test(
      decodedPathname,
    );

    return hasCanonicalOrigin &&
      hasCanonicalDoiPath &&
      !url.search &&
      !url.hash
      ? true
      : doiUrlValidationMessage;
  } catch {
    return doiUrlValidationMessage;
  }
}

export function normalizeDoiUrl(
  value: string | null | undefined,
): string | undefined {
  return value && validateDoiUrl(value) === true ? value : undefined;
}

export function getDoiIdentifier(value: string) {
  try {
    return decodeURIComponent(new URL(value).pathname.slice(1));
  } catch {
    return value;
  }
}
