"use client";
import { useEvmAddress } from "@coinbase/cdp-hooks";
import { useEffect, useState } from "react";

import { IconCheck, IconCopy, IconUser } from "@/components/Icons";
import { authClient } from "@/lib/auth/auth-client";

/**
 * Header component
 */
export default function Header() {
  const { evmAddress } = useEvmAddress();
  const [isCopied, setIsCopied] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const copyAddress = async () => {
    if (!evmAddress) return;
    try {
      await navigator.clipboard.writeText(evmAddress);
      setIsCopied(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await authClient.signOut();
    } catch (error) {
      console.error("Sign out failed:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  useEffect(() => {
    if (!isCopied) return;
    const timeout = setTimeout(() => {
      setIsCopied(false);
    }, 2000);
    return () => clearTimeout(timeout);
  }, [isCopied]);

  return (
    <header>
      <div className="header-inner">
        <div className="title-container">
          <h1 className="site-title">CDP Next.js StarterKit</h1>
        </div>
        <div className="user-info flex-row-container">
          {evmAddress && (
            <button
              aria-label="copy wallet address"
              className="flex-row-container copy-address-button"
              onClick={copyAddress}
            >
              {!isCopied && (
                <>
                  <IconUser className="user-icon user-icon--user" />
                  <IconCopy className="user-icon user-icon--copy" />
                </>
              )}
              {isCopied && <IconCheck className="user-icon user-icon--check" />}
              <span className="wallet-address">
                {evmAddress.slice(0, 6)}...{evmAddress.slice(-4)}
              </span>
            </button>
          )}
          <button
            onClick={handleSignOut}
            disabled={isSigningOut}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              backgroundColor: "transparent",
              border: "1px solid #ccc",
              cursor: isSigningOut ? "not-allowed" : "pointer",
            }}
          >
            {isSigningOut ? "Signing out..." : "Sign Out"}
          </button>
        </div>
      </div>
    </header>
  );
}
