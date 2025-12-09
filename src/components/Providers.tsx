"use client";

import { CDPReactProvider, type Config } from "@coinbase/cdp-react/components/CDPReactProvider";

import { theme } from "@/components/theme";

interface ProvidersProps {
  children: React.ReactNode;
}

const ethereumAccountType = process.env.NEXT_PUBLIC_CDP_CREATE_ETHEREUM_ACCOUNT_TYPE
  ? process.env.NEXT_PUBLIC_CDP_CREATE_ETHEREUM_ACCOUNT_TYPE === "smart"
    ? "smart"
    : "eoa"
  : undefined;

const solanaAccountType = process.env.NEXT_PUBLIC_CDP_CREATE_SOLANA_ACCOUNT
  ? process.env.NEXT_PUBLIC_CDP_CREATE_SOLANA_ACCOUNT === "true"
  : undefined;

if (!ethereumAccountType && !solanaAccountType) {
  throw new Error(
    "Either NEXT_PUBLIC_CDP_CREATE_ETHEREUM_ACCOUNT_TYPE or NEXT_PUBLIC_CDP_CREATE_SOLANA_ACCOUNT must be defined",
  );
}

/**
 * Get JWT from Better Auth for CDP custom authentication
 * Uses the /api/auth/token endpoint exposed by the jwt plugin
 */
async function getJwt(): Promise<string | undefined> {
  try {
    const response = await fetch("/api/auth/token", {
      credentials: "include",
    });
    if (!response.ok) {
      return undefined;
    }
    const data: { token: string } = await response.json();
    return data.token;
  } catch {
    return undefined;
  }
}

const CDP_CONFIG = {
  projectId: process.env.NEXT_PUBLIC_CDP_PROJECT_ID ?? "",
  customAuth: {
    getJwt,
  },
  ...(ethereumAccountType && {
    ethereum: {
      createOnLogin: ethereumAccountType,
    },
  }),
  ...(solanaAccountType && {
    solana: {
      createOnLogin: solanaAccountType,
    },
  }),
  appName: "CDP Next.js StarterKit",
  appLogoUrl: "http://localhost:3000/logo.svg",
} satisfies Config;

/**
 * Providers component that wraps the application in all requisite providers
 *
 * @param props - { object } - The props for the Providers component
 * @param props.children - { React.ReactNode } - The children to wrap
 * @returns The wrapped children
 */
export default function Providers({ children }: ProvidersProps) {
  return (
    <CDPReactProvider config={CDP_CONFIG} theme={theme}>
      {children}
    </CDPReactProvider>
  );
}
