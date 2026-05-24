"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      router.push("/admin");
      router.refresh();
    }
  };

  return (
    <main className="min-h-screen bg-[#f4f7f6] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Image 
            src="/reinvent-logo.png" 
            alt="Reinvent Africa Network" 
            width={240} 
            height={60} 
            className="w-auto h-14 mx-auto mb-6" 
            unoptimized 
            priority
          />
          <h1 className="text-2xl font-light tracking-tight text-gray-900 mb-2">Admin Portal</h1>
          <p className="text-gray-400 text-sm">Secure access for the curation team.</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-gray-400 font-medium">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#f4f7f6] border border-gray-200 rounded-2xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1a3b2b]/20 focus:border-[#1a3b2b] transition-colors placeholder:text-gray-400"
                placeholder="admin@reinventaf.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-gray-400 font-medium">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#f4f7f6] border border-gray-200 rounded-2xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1a3b2b]/20 focus:border-[#1a3b2b] transition-colors placeholder:text-gray-400"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-[#1a3b2b] text-[#ffffff] font-bold rounded-lg hover:bg-[#122a1f] hover:shadow-md transition-all active:scale-[0.98] disabled:opacity-50 shadow-sm"
            >
              {isLoading ? "Verifying..." : "Sign In to Dashboard"}
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-gray-400 text-xs">
          © 2026 Reinvent Africa Network. Access strictly restricted.
        </p>
      </div>
    </main>
  );
}
