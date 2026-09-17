export function checkCredentials(userId, password) {
  const validUserId = process.env.DEMO_USERNAME;
  const validPassword = process.env.DEMO_USER_PASSWORD || "DemoPass@2026";
  return Boolean(userId) && Boolean(password) && userId === validUserId && password === validPassword;
}

// Fake, fixed-answer captcha for structure/flow testing only -- not a real
// captcha challenge. Must match NEXT_PUBLIC_DEMO_CAPTCHA_TEXT shown on the page.
export function checkCaptcha(captcha) {
  const validCaptcha = process.env.DEMO_CAPTCHA_TEXT || process.env.NEXT_PUBLIC_DEMO_CAPTCHA_TEXT || "TEST12";
  return Boolean(captcha) && captcha === validCaptcha;
}
