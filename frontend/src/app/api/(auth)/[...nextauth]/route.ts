import NextAuth from "next-auth";
import { authOptions } from "./options";

const handler = NextAuth(authOptions);

// Only export POST handler to avoid GET errors during login
export { handler as POST };

