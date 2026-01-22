"use client";

import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

export default function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "not found key";
  // console.log("Recaptcha Key:", recaptchaKey);
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={recaptchaKey}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
}
