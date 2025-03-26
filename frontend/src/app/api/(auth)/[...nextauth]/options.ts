import { AuthOptions, ISODateString, User } from "next-auth";
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
    signIn: "/login",
  },
  session: {
    strategy: "jwt", // Use JWT-based sessions
  },

  callbacks: {
    async jwt({ token, user }: { token: JWT; user: CustomUser | null }) {
      if (user) {
        token.user = user;
      }
      console.log("JWT token:", token);
      return token;
    },
    async session({
      session,
      token,
      user,
    }: {
      session: CustomSession;
      token: JWT;
      user: CustomUser;
    }) {
      console.log("Token in session callback:", token); // Log token to inspect structure
      session.user = token.user as CustomUser;
      console.log("Session data:", session);
      return session;
    },

    //
  },
  providers: [
    Credentials({
      name: "Welcome Back",
      type: "credentials",

      credentials: {
        email: {
          // label: "Email",
          // type: "email",
          // placeholder: "Enter your email",
        },
        password: {
          // label: "Password", type: "password"
        },
      },


      // async authorize(credentials, req) {
      //   try {
      //     const { data } = await axios.post(LOGIN_URL, credentials);

      //     if (!data?.data) {
      //       console.error("No user data returned from API.");
      //       throw new Error("Invalid credentials");
      //       return null;
      //     }

      //     // Ensure all required user fields exist
      //     console.log(data);

      //     return {
      //       id: data.data.id || null,
      //       name: data.data.name || "User",
      //       email: data.data.email,
      //       token: data.data.token || null, // Ensure token exists
      //     };

      //   } catch (error) {
      //     console.error("Login error:", error);
      //     throw new Error("Login failed. Please check your credentials.");
      //   }
      // }

      async authorize(credentials) {
        try {
          const res = await fetch(LOGIN_URL, {
            method: 'POST',
            body: JSON.stringify(credentials),
            headers: { 'Content-Type': 'application/json' },
          });

          if (res.ok) {
            console.error("No user data returned from API.");
            throw new Error("Invalid credentials");
            return null;
          }
          const data = await res.json();
          if (data) {
            return {
              id: data.data.id || null,
              name: data.data.name || "User",
              email: data.data.email,
              token: data.data.token || null, // Ensure token exists
            };
          }; // Return user if valid


        } catch (error) {
          console.error("Login error:", error);
          throw new Error("Login failed. Please check your credentials.");
        }
      },


    }),
    // ...add more providers here
  ],
};
