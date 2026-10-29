"use client";

import { GetUrlLongByShortCode } from "@/lib/action";
import { useEffect, useState } from "react";
import Home from "@/components/home";

export default function URLRedirect({ shortURL }: { shortURL: string }) {
  const [message, setMessage] = useState("Redirecting...");
  useEffect(() => {
    const initLoad = async () => {
      const rest = await GetUrlLongByShortCode(shortURL);
      if (rest.status === "error") {
        setMessage(rest.message || "An error occurred while fetching URL");
      } else if (rest.data) {
        window.location.href = rest.data;
      } else {
        setMessage("short URL not found!");
      }
    };
    initLoad();
  }, [shortURL]);

  return (
    <main className="flex min-h-screen flex-col items-center p-6 md:p-24">
      <Home />
      <div className="pt-8 text-2xl">{message}</div>
    </main>
  )
}
