"use client";

import { useIsInitialized, useIsSignedIn } from "@coinbase/cdp-hooks";

import Loading from "@/components/Loading";
import SignedInScreen from "@/components/SignedInScreen";
import SignInScreen from "@/components/SignInScreen";
import { authClient } from "@/lib/auth/auth-client";

// Skip CDP wallet check in development (CDP requires HTTPS for JWKS)
const SKIP_CDP_AUTH = process.env.NODE_ENV === "development";

/**
 * A component that displays the client app.
 */
export default function ClientApp() {
  const { isInitialized } = useIsInitialized();
  const { isSignedIn } = useIsSignedIn();
  const { data: session, isPending } = authClient.useSession();

  // Show loading while Better Auth session is being fetched or CDP is initializing
  if (isPending || (!SKIP_CDP_AUTH && !isInitialized)) {
    return (
      <div className="app flex-col-container flex-grow">
        <Loading />
      </div>
    );
  }

  // In dev: only check Better Auth session. In prod: also require CDP wallet
  const isFullyAuthenticated = SKIP_CDP_AUTH 
    ? !!session?.user 
    : session?.user && isSignedIn;

  return (
    <div className="app flex-col-container flex-grow">
      {!isFullyAuthenticated && <SignInScreen />}
      {isFullyAuthenticated && <SignedInScreen />}
    </div>
  );
}
