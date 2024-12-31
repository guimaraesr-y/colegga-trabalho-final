import { logout } from "@/actions/auth"

export default function SignOutButton({ children }: {
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onClick={async () => {
        await logout()
        window.location.href = "/";
      }}
    >
      {children}
    </button>
  )
}
