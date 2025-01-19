import { useRouter } from "next/navigation";


export default function CommunityButton({ children }: {
  children: React.ReactNode
}) {
  const router = useRouter();

  return (
    <button
      type="button"
      className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
      onClick={() => router.push("/community")}
    >
      {children}
    </button>
  )
}
