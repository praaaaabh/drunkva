import Link from "next/link";
import { Martini } from "lucide-react";

export function Brand() {
  return (
    <Link href="/" className="flex items-center gap-2 font-black tracking-tight text-ink">
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-ink text-white shadow-soft">
        <Martini className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="text-xl">Drunkva</span>
    </Link>
  );
}
