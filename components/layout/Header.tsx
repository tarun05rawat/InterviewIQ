"use client";

import { signOut } from "next-auth/react";
import { Button } from "../../components/ui/button";
import { Ghost } from "lucide-react";
import { useRouter } from "next/navigation";

export function Header() {
  const router = useRouter();
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Button
          style={{ marginRight: 10 }}
          variant={"ghost"}
          onClick={(event) => {
            router.replace("/");
          }}
        >
          <h1 className="text-2xl font-bold cursor-pointer">InterviewIQ</h1>
        </Button>
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
