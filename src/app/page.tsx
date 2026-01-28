import Container from "@/components/container";
import Providers from "@/components/providers";
import Header from "@/components/home";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-6 md:p-24">
      <Header />
      <Providers>
        <Container />
      </Providers>
    </main>
  );
}
