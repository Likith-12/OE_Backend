import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { signIn } from "next-auth/react";
import { validateUser } from "../../../lib/auth";

async function refreshAccessToken(token) {
  try {
    const url =
      "https://oauth2.googleapis.com/token?" +
      new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
      });

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    console.log(error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    // // ...add github here
    // GithubProvider({
    //     clientId: process.env.GITHUB_CLIENT_ID,
    //     clientSecret: process.env.GITHUB_CLIENT_SECRET,
    // }),

    // ...add other providers here
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error", // Error code passed in query string as ?error=
  },

  session: { strategy: "jwt" },

  callbacks: {
    async session({ session, token, user }) {
      if (!token?.access_token) {
        console.log("no token");
        return session;
      }

      session.jwt = token.jwt;
      session.id = token.id;
      session.access_token = token.access_token;
      session.refresh_token = token.refresh_token;
      session.user = token.user;
      return session;
    },

    async jwt({ token, user, account,...params }) {
      const isSignIn = user ? true : false;
      if (isSignIn) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/login?token=${account?.access_token}`
        );
        const data = await response.json();
        console.log(data);
        token.jwt = data.token;
        token.access_token = account.access_token;
        token.refresh_token = data.refresh_token;
        token.user = data.user;
        //set local storage
        // localStorage.setItem("token", data.token);
      }
      return token;
    },
    signIn: async ({ user, account }) => {
      return await validateUser(user, account);
    },

    

  },
  secret: "7Lu5wA0v+Wa0+3vRtOtpVA==",
});
