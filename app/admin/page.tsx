"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

// Mock data for UI demonstration
const MOCK_CODES = [
  { id: 1, code: "RAN-V9X2", status: "Claimed", category: "VIP", email: "example@company.com", date: "May 5, 2026" },
  { id: 2, code: "RAN-B7K4", status: "Active", category: "Standard", email: "-", date: "-" },
  { id: 3, code: "RAN-L9P1", status: "Active", category: "Partner", email: "-", date: "-" },
];

export default function AdminDashboard() {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      alert("This will generate new codes via Supabase API once connected.");
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      {/* Admin Navbar */}
      <nav className="border-b border-white/10 bg-[#0A0A0A] px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Image src="/reinvent-logo-white.png" alt="RAN Logo" width={120} height={30} className="w-auto h-6 opacity-50" unoptimized />
          <span className="text-white/30">|</span>
          <span className="font-mono text-sm tracking-widest text-[#c8a44e]">CURATION DASHBOARD</span>
        </div>
        <Link href="/" className="text-sm text-white/50 hover:text-white transition-colors">
          Exit to Site &rarr;
        </Link>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-3xl font-light font-display mb-2">Access Control</h1>
            <p className="text-white/50">Manage single-use invite codes and track claims.</p>
          </div>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-70 flex items-center gap-2"
          >
            {isGenerating ? (
              <span className="animate-pulse">Generating...</span>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                Generate New Codes
              </>
            )}
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
            <h3 className="text-white/50 text-sm font-medium mb-1">Total Active Codes</h3>
            <p className="text-4xl font-light text-white">124</p>
          </div>
          <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
            <h3 className="text-white/50 text-sm font-medium mb-1">Codes Claimed</h3>
            <p className="text-4xl font-light text-[#c8a44e]">42</p>
          </div>
          <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
            <h3 className="text-white/50 text-sm font-medium mb-1">Recent Database Ping</h3>
            <p className="text-4xl font-light text-[#509e71]">2 hrs ago</p>
            <p className="text-xs text-white/40 mt-2">Vercel Cron Active</p>
          </div>
        </div>

        {/* Codes Table */}
        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-white/50 uppercase tracking-wider font-medium text-xs">
                <tr>
                  <th className="px-6 py-4">Invite Code</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Claimed By</th>
                  <th className="px-6 py-4">Claim Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {MOCK_CODES.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 font-mono text-white">{item.code}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.status === 'Active' ? 'bg-[#509e71]/10 text-[#509e71] border border-[#509e71]/20' : 
                        'bg-white/10 text-white/70 border border-white/10'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white/70">{item.category}</td>
                    <td className="px-6 py-4 text-white/50">{item.email}</td>
                    <td className="px-6 py-4 text-white/50">{item.date}</td>
                    <td className="px-6 py-4 text-right">
                      {item.status === 'Active' && (
                        <button className="text-xs text-[#c8a44e] hover:text-white transition-colors">Revoke</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-white/5 text-center text-xs text-white/30">
            Showing latest 50 records. Connect to Supabase to see real data.
          </div>
        </div>
      </div>
    </main>
  );
}
