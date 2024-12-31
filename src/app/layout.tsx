import type { Metadata } from "next";
import localFont from "next/font/local";
import { ToastContainer } from 'react-toastify';
import "./globals.css";
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from "@/providers/authProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Colegga - Gerenciador e Organizador para Estudantes EAD",
  description: "O Colegga é um gerenciador de estudos e compromissos para estudantes EAD.",
  appleWebApp: {
    title: "Colegga - Gerenciador e Organizador para Estudantes EAD",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
          {children}
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          />
      </body>
      </AuthProvider>
    </html>
  );
}
