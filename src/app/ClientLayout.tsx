"use client";

import { LanguageProvider } from "@/contexts/LanguageContext";
import OfflineIndicator from "@/components/OfflineIndicator";
import { ChatWidget } from "@/components/ChatWidget";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      {children}
      <ChatWidget />
      <OfflineIndicator />
    </LanguageProvider>
  );
}