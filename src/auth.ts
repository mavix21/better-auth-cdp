import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { jwt, siwe } from "better-auth/plugins";
import { db } from "./db";
import { nextCookies } from "better-auth/next-js";
import { generateRandomString } from "better-auth/crypto";

const siteUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const auth = betterAuth({
  experimental: { joins: true },
  baseURL: siteUrl,
  trustedOrigins: [siteUrl],
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  plugins: [
    jwt({
      jwks: {
        keyPairConfig: {
          alg: "ES256",
        },
      },
      jwt: {
        issuer: siteUrl,
        audience: siteUrl,
        expirationTime: "1h",
        getSubject: (session) => session.user.id,
      },
    }),
    siwe({
      domain: siteUrl,
      async getNonce() {
        return generateRandomString(32);
      },
      async verifyMessage(args) {
        return true;
      },
    }),
    nextCookies()
  ],
});