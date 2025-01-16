"use client";

import { ReactNode } from "react";
import { AuthProvider } from "@/providers/authProvider";

interface LayoutProps {
  children: ReactNode;
}

const FlashLayout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <AuthProvider> 
          <div className="p-6">{children}</div>
        </AuthProvider>
      </div>
    </div>
  );
};

export default FlashLayout;
