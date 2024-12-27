"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <h1 className="text-2xl font-bold">InterviewIQ</h1>
        <Button
          variant="ghost"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-sm"
        >
          Sign Out
        </Button>
      </div>
    </header>
  );
}
