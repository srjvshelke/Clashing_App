import { AuthOptions, ISODateString } from "next-auth";
import { JWT } from "next-auth/jwt";
import axios from "axios";
import Credentials from "next-auth/providers/credentials";
import { LOGIN_URL } from "@/lib/apiEndPoints";

export type CustomSession = {
  user?: CustomUser;
  expires: ISODateString;
};

export type CustomUser = {
  id?: string | null;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  token?: string | null;
};

export const authOptions: AuthOptions = {
  pages: {
    signIn: "/login", // Custom login page
  },
  session: {
    strategy: "jwt", // Using JWT-based sessions
  },

  callbacks: {
    async jwt({ token, user }: { token: JWT; user: CustomUser | null }) {
      if (user) {
        token.user = user; // Save user data in JWT token
      }
      console.log("JWT token:", token);
      return token;
    },

    async session({
      session,
      token,
    }: {
      session: CustomSession;
      token: JWT;
    }) {
      console.log("Token in session callback:", token);
      session.user = token.user as CustomUser; // Assign user from token to session
      console.log("Session data:", session);
      return session;
    },
  },

  providers: [
    Credentials({
      name: "Login with Email",
      type: "credentials",
      credentials: {
        email: {
          // label: "Email", type: "email", placeholder: "Enter your email" 

        },
        password: {
          // label: "Password", type: "password", placeholder: "Enter your password" 
        },
      },

      async authorize(credentials) {
        try {
          // Call your login API with the user's credentials
          const res = await fetch(LOGIN_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
          });

          if (res.ok) {
            const data = await res.json(); // Parse the response
            if (data?.data) {
              console.log("User data from API:", data.data);

              // Return user data, including token
              return {
                id: data.data.id || null,
                name: data.data.name || "User",
                email: data.data.email || null,
                token: data.data.token || null,
              };
              // throw new Error("Invalid credentials"); // Handle error if status is not OK
            } else {
              return null;
            }
          } else {
            throw new Error('Invalid login credentials');
          }
        } catch (error) {
          console.error("Login error:", error);
          throw new Error("Login failed. Please check your credentials.");
        }
      },
    }),
  ],
};
