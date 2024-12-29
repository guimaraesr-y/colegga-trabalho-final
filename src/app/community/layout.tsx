"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { SessionProvider } from "next-auth/react";

interface LayoutProps {
  children: ReactNode;
}

const FlashLayout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <motion.div
          className="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p>Este é um exemplo de mensagem flash. Ajuste conforme necessário.</p>
        </motion.div>

        {/*TODO: criar provider */}
        <SessionProvider> 
          <div className="p-6">{children}</div>
        </SessionProvider>
      </div>
    </div>
  );
};

export default FlashLayout;
