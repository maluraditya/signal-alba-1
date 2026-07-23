"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!configured) {
      toast("Demo mode is active. Configure Supabase to enable sign-in.");
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const result = mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });
      if (result.error) throw result.error;
      toast.success(mode === "login" ? "Welcome back" : "Check your inbox to confirm your account");
      if (mode === "login") router.push("/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to sign in");
    } finally {
      setLoading(false);
    }
  }

  const fieldClass = "mt-1.5 h-11 w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 text-sm text-white outline-none placeholder:text-[#595b54] focus:border-[#b0cc62] focus:ring-2 focus:ring-[#d8ff72]/20";

  return (
    <form onSubmit={submit} className="mt-8">
      <label className="block text-[11px] font-medium text-[#b6b8af]">Work email<input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" className={fieldClass} /></label>
      <label className="mt-4 block text-[11px] font-medium text-[#b6b8af]">Password<input type="password" minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="8+ characters" className={fieldClass} /></label>
      <Button type="submit" className="mt-6 w-full" size="lg" disabled={loading}>{loading ? <LoaderCircle className="size-4 animate-spin" /> : <>{mode === "login" ? "Sign in" : "Create account"} <ArrowRight className="size-4" /></>}</Button>
      <button type="button" onClick={() => setMode(mode === "login" ? "signup" : "login")} className="mt-4 w-full text-center text-[11px] text-[#82847c] hover:text-white">{mode === "login" ? "New to PipelineOS? Create an account" : "Already have an account? Sign in"}</button>
    </form>
  );
}
