"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import ClientLayout from "./ClientLayout";

function HomePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending) {
      if (session?.user) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    }
  }, [session, isPending, router]);

  return (
    <div className="min-h-screen w-full agri-gradient agri-pattern flex items-center justify-center">
      <Loader2 className="w-12 h-12 text-green-600 animate-spin" />
    </div>
  );
}

export default function Home() {
  return (
    <ClientLayout>
      <HomePage />
    </ClientLayout>
  );
}