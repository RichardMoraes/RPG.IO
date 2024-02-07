'use client'

import { useSearchParams } from "next/navigation";
import Chat from "../components/chat";

export default function Home() {
  const params = useSearchParams();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Chat room={params.get('room')!}></Chat>
    </main>
  );
}
