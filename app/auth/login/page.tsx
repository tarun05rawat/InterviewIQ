"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleGoogleSignIn() {
    setIsLoading(true);
    try {
      await signIn("google", { redirect: true, callbackUrl: "/practice" }); // Redirects to Google sign-in
      console.log("done"); // Log after successful sign-in
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h1 className="text-2xl font-bold text-center">Welcome Back</h1>
        </CardHeader>
        <CardContent>
          <Button
            type="button"
            className="w-full"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            {isLoading ? "Signing in with Google..." : "Sign In with Google"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
