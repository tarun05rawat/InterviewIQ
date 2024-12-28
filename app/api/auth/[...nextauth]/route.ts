import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Helper function to validate environment variables
const getEnvVariable = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

// Define the NextAuth handler
const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: getEnvVariable("GOOGLE_CLIENT_ID"),
      clientSecret: getEnvVariable("GOOGLE_CLIENT_SECRET"),
    }),
  ],
  secret: getEnvVariable("NEXTAUTH_SECRET"),
});

export { handler as GET, handler as POST };
