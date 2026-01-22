import Container from "@/components/container";
import Providers from "@/components/providers";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-6 md:p-24">
      <Link href="/" title="Home">
        <h1 className="text-4xl font-bold text-yellow-400">URL Shortener</h1>
      </Link>
      <h3 className="text-gray-500">Simple and Fast</h3>
      <Providers>
        <Container />      
      </Providers>
    </main>
  );
}
