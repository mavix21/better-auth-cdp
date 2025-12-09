"use client";

import { useIsInitialized, useIsSignedIn } from "@coinbase/cdp-hooks";

import Loading from "@/components/Loading";
import SignedInScreen from "@/components/SignedInScreen";
import SignInScreen from "@/components/SignInScreen";
import { authClient } from "@/lib/auth/auth-client";

/**
 * A component that displays the client app.
 */
export default function ClientApp() {
  const { isInitialized } = useIsInitialized();
  const { isSignedIn } = useIsSignedIn();
  const { data: session, isPending } = authClient.useSession();

  // Show loading while Better Auth session is being fetched or CDP is initializing
  if (isPending || !isInitialized) {
    return (
      <div className="app flex-col-container flex-grow">
        <Loading />
      </div>
    );
  }

  // User is signed in with Better Auth AND CDP wallet is ready
  const isFullyAuthenticated = session?.user && isSignedIn;

  return (
    <div className="app flex-col-container flex-grow">
      {!isFullyAuthenticated && <SignInScreen />}
      {isFullyAuthenticated && <SignedInScreen />}
    </div>
  );
}
