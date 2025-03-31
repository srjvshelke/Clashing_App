import { AuthOptions, ISODateString, NextAuthOptions, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import {LOGIN_URL} from '../../../../lib/apiEndPoints' 
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

export const authOptions: NextAuthOptions = {
  
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        try {
          const { data } = await axios.post(LOGIN_URL, credentials);
          const user = data?.data;
          // if (!res.ok) throw new Error("Invalid credentials");
          // const data = await res.json();
          console.log(data + "inside auth");
          if (user) {
            return {
              id: data.data.id,
              name: data.data.name,
              email: data.data.email,
              token: data.data.token, // Attach token from backend
            };
          }
          return null;
        } catch (error) {
          console.error("Login error:", error);
          throw new Error("Login failed.");
          
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },

//   session: {
//     strategy: "jwt",
//   },

//   secret :process.env.NEXTAUTH_SECRET,
//   callbacks: {
//     async jwt({ token, user }: { token: JWT; user: CustomUser | null }) {
//       if (user) {
//         token.user = user; // Attach user data to token
//       }
//       return token;
//     },
//     async session({
//       session,
//       token,
//       user,
//     }: {
//       session: CustomSession;
//       token: JWT;
//       user: User;
//     }) {
//       session.user = token.user as CustomUser;
//       return session;
//     },
//   },

};
