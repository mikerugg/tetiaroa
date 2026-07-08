import "server-only";

type TurnstileSiteVerifyResponse = {
  success?: boolean;
};

export async function verifyTurnstileToken(
  token: unknown,
  remoteIp?: string,
) {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();

  if (typeof token !== "string" || !token.trim() || !secret) {
    return false;
  }

  const body = new URLSearchParams({
    secret,
    response: token,
  });

  if (remoteIp) {
    body.set("remoteip", remoteIp);
  }

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body,
      },
    );

    if (!response.ok) {
      return false;
    }

    const result = (await response.json()) as TurnstileSiteVerifyResponse;

    return result.success === true;
  } catch {
    return false;
  }
}
