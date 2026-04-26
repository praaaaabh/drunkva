import { MarketingNav } from "@/components/marketing-nav";
import { LoginForm } from "@/components/auth/login-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/feed");
  }

  return (
    <div className="min-h-screen noise">
      <MarketingNav />
      <main className="mx-auto flex max-w-md flex-col px-5 py-12">
        <LoginForm />
      </main>
    </div>
  );
}
