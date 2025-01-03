import Image from "next/image";
import SignOutButton from "../signout-button";

export default function Header(): JSX.Element {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center space-x-4">
        <Image src="/logo.png" alt="Logo" width={60} height={60} />
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      </div>
      <SignOutButton>Sair</SignOutButton>
    </div>
  );
}