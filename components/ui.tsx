import { clsx } from "clsx";

export function PageShell({
  title,
  eyebrow,
  description,
  children
}: {
  title: string;
  eyebrow: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
      <div className="mb-8 max-w-3xl">
        <p className="mb-2 text-sm font-black uppercase tracking-[0.16em] text-punch">{eyebrow}</p>
        <h1 className="text-3xl font-black tracking-tight text-ink sm:text-5xl">{title}</h1>
        <p className="mt-3 text-base leading-7 text-ink/65 sm:text-lg">{description}</p>
      </div>
      {children}
    </main>
  );
}

export function Card({
  className,
  children
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <section className={clsx("rounded-lg border border-ink/10 bg-white p-5 shadow-soft", className)}>{children}</section>;
}

export function Pill({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "green" | "blue" | "orange" }) {
  const tones = {
    neutral: "bg-ink/5 text-ink/70",
    green: "bg-mint/10 text-green-800",
    blue: "bg-soda/15 text-sky-800",
    orange: "bg-punch/10 text-orange-800"
  };

  return <span className={clsx("rounded-full px-3 py-1 text-xs font-bold", tones[tone])}>{children}</span>;
}
