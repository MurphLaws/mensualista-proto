"use client";
import Link from "next/link";
import Image from "next/image";
import { TutorialReplayButton } from "@/components/tutorial/TutorialReplayButton";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink-100 bg-white/80 backdrop-blur">
      <div className="container-app flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Mensualista" width={28} height={28} />
          <span className="text-base font-semibold text-ink-900">Mensualista</span>
        </Link>

        <div className="flex items-center gap-2">
          <TutorialReplayButton />
        </div>
      </div>
    </header>
  );
}
