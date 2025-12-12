"use client";

import { useAuthenticateWithJWT } from "@coinbase/cdp-hooks";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth/auth-client";

// Skip CDP wallet auth in development (CDP requires HTTPS for JWKS)
const SKIP_CDP_AUTH = process.env.NODE_ENV === "development";

/**
 * Sign in screen with Better Auth + CDP wallet creation
 */
export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCDPAuthenticating, setIsCDPAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);

  const { authenticateWithJWT } = useAuthenticateWithJWT();
  const { data: session } = authClient.useSession();

  // After Better Auth login, authenticate with CDP to create/retrieve wallet
  useEffect(() => {
    if (SKIP_CDP_AUTH) return; // Skip in development
    
    if (session?.user && !isCDPAuthenticating) {
      setIsCDPAuthenticating(true);
      authenticateWithJWT()
        .catch((err) => {
          console.error("CDP authentication failed:", err);
        })
        .finally(() => {
          setIsCDPAuthenticating(false);
        });
    }
  }, [session, authenticateWithJWT, isCDPAuthenticating]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const result = await authClient.signUp.email({
          email,
          password,
          name: email.split("@")[0],
        });
        if (result.error) {
          setError(result.error.message ?? "Sign up failed");
        }
      } else {
        const result = await authClient.signIn.email({
          email,
          password,
        });
        if (result.error) {
          setError(result.error.message ?? "Sign in failed");
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="card card--login">
      <h1 className="sr-only">Sign in</h1>
      <p className="card-title">Welcome!</p>
      <p>Please sign in to continue.</p>

      <form onSubmit={handleSubmit} className="flex-col-container" style={{ gap: "1rem", marginTop: "1rem" }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
        />

        {error && <p style={{ color: "red", margin: 0 }}>{error}</p>}

        <button
          type="submit"
          disabled={isLoading || isCDPAuthenticating}
          style={{
            padding: "0.75rem",
            borderRadius: "4px",
            backgroundColor: "#0052FF",
            color: "white",
            border: "none",
            cursor: isLoading || isCDPAuthenticating ? "not-allowed" : "pointer",
          }}
        >
          {isLoading || isCDPAuthenticating ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
        </button>

        <button
          type="button"
          onClick={() => setIsSignUp(!isSignUp)}
          style={{
            background: "none",
            border: "none",
            color: "#0052FF",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          {isSignUp ? "Already have an account? Sign In" : "Need an account? Sign Up"}
        </button>
      </form>
    </main>
  );
}
