"use client";

import { GetUrlLongByShortCode } from "@/lib/action";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function URLRedirect({ shortURL }: { shortURL: string }) {
  const [message, setMessage] = useState("Redirecting...");
  useEffect(() => {
    const initLoad = async () => {
      const clientInfo = await fetchClientInfo();
      const rest = await GetUrlLongByShortCode(shortURL, clientInfo);      
      if (rest.status === "error") {
        setMessage(rest.message || "An error occurred while fetching URL");
      } else if (rest.data) {
        window.location.href = rest.data;        
      }else{
        setMessage("short URL not found!");
      }
    };
    initLoad();
  }, [shortURL]);

  return (
    <main className="flex min-h-screen flex-col items-center p-6 md:p-24">
    <Link href="/" title="Home">
      <h1 className="text-4xl font-bold text-yellow-400">URL Shortener</h1>
    </Link>
    <h3 className="text-gray-500">Simple and Fast</h3>
    <div className="pt-8 text-2xl">{message}</div>
  </main>
  )
}

async function fetchClientInfo() {
  const userAgent = navigator.userAgent;
  const referer = document.referrer;

  // Obtener IP del cliente desde un servicio externo si es necesario
  const ipResponse = await fetch("https://api.ipify.org?format=json");
  const { ip } = await ipResponse.json();

  return { userAgent, referer, ip };
}
