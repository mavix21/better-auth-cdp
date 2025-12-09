"use client";
import ClientApp from "@/components/ClientApp";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import Providers from "@/components/Providers";

/**
 * Home page for the Next.js app
 *
 * @returns The home page
 */
export default function Home() {
  return (
    <ConvexClientProvider>
      <Providers>
        <ClientApp />
      </Providers>
    </ConvexClientProvider>           
  );
}
