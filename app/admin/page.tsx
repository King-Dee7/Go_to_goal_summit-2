/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { 
  approveApplication, 
  declineApplication, 
  fetchApplications, 
  fetchInviteCodes,
  generateInviteCode,
  toggleInviteCodeStatus
} from "@/app/actions/admin-actions";

type Tab = 'dashboard' | 'applications' | 'codes';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [applications, setApplications] = useState<any[]>([]);
  const [inviteCodes, setInviteCodes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [newCodeCategory, setNewCodeCategory] = useState('VIP');
  
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const loadData = async (showLoadingState = false) => {
    if (showLoadingState) setIsLoading(true);
    try {
      const [apps, codes] = await Promise.all([
        fetchApplications(),
        fetchInviteCodes()
      ]);
      setApplications(apps);
      setInviteCodes(codes);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData(true);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const onApprove = async (id: string) => {
    if (!confirm("Are you sure you want to APPROVE this applicant? This will send them a confirmation email.")) return;
    setProcessingId(id);
    const res = await approveApplication(id);
    if (res.success) {
      loadData();
    } else {
      alert(res.error);
    }
    setProcessingId(null);
  };

  const onDecline = async (id: string) => {
    if (!confirm("Are you sure you want to DECLINE this applicant? This will send them a polite decline email.")) return;
    setProcessingId(id);
    const res = await declineApplication(id);
    if (res.success) {
      loadData();
    } else {
      alert(res.error);
    }
    setProcessingId(null);
  };

  const onGenerateCode = async () => {
    setIsGenerating(true);
    try {
      const res = await generateInviteCode(newCodeCategory);
      if (res.success) {
        await loadData();
      } else {
        alert(res.error || "Failed to generate code.");
      }
    } catch (err) {
      console.error("Generate error:", err);
      alert("Error: Missing SUPABASE_SERVICE_ROLE_KEY or database connection issue.");
    } finally {
      setIsGenerating(false);
    }
  };

  const onToggleCode = async (id: string, currentStatus: string) => {
    setProcessingId(id);
    const res = await toggleInviteCodeStatus(id, currentStatus);
    if (res.success) {
      loadData();
    } else {
      alert(res.error);
    }
    setProcessingId(null);
  };

  const pendingCount = applications.filter(a => a.status === 'Under Review').length;
  const approvedCount = applications.filter(a => a.status === 'Accepted').length;
  const totalApps = applications.length;
  const claimedCodes = inviteCodes.filter(c => c.status === 'Claimed').length;

  // Premium Analytics Calculations
  const acceptanceRate = totalApps > 0 ? Math.round((approvedCount / totalApps) * 100) : 0;
  
  const roomMix = applications.reduce((acc: any, app: any) => {
    acc[app.category] = (acc[app.category] || 0) + 1;
    return acc;
  }, {});

  const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const claimVelocity = inviteCodes.filter(c => c.status === 'Claimed' && c.claimed_at && new Date(c.claimed_at) > last24h).length;

  return (
    <div className="min-h-screen bg-[#F2F1EC] text-gray-800 font-sans selection:bg-[#c8a44e] selection:text-white">
      
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-[0_1px_12px_rgba(0,0,0,0.04)]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 flex items-center justify-between h-[72px]">
          
          {/* Left: Brand Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <Image 
              src="/reinvent-logo.png" 
              alt="Reinvent Africa Network" 
              width={180} 
              height={45} 
              className="w-auto h-8 md:h-9" 
              unoptimized 
              priority
            />
          </div>

          {/* Center: Navigation Tabs */}
          <div className="hidden md:flex items-center bg-[#F2F1EC] rounded-full p-1 gap-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                activeTab === 'dashboard' 
                  ? 'bg-white text-[#1a3b2b] shadow-sm' 
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`relative px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                activeTab === 'applications' 
                  ? 'bg-white text-[#1a3b2b] shadow-sm' 
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Applications
              {pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#c8a44e] text-white text-[9px] w-5 h-5 rounded-full font-bold flex items-center justify-center">{pendingCount}</span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('codes')}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                activeTab === 'codes' 
                  ? 'bg-white text-[#1a3b2b] shadow-sm' 
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Invite Codes
            </button>
          </div>

          {/* Right: Search + Actions + Avatar */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative hidden lg:block">
              <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input type="text" placeholder="Search applicant..." className="w-52 pl-9 pr-4 py-2 bg-[#F2F1EC] border border-transparent rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#c8a44e]/20 focus:border-[#c8a44e] focus:bg-white transition-all" />
            </div>
            <button 
              onClick={() => window.open('/', '_blank')} 
              className="hidden md:flex w-9 h-9 rounded-full bg-[#F2F1EC] items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              title="View Live Site"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </button>
            <button 
              onClick={handleSignOut} 
              className="hidden md:flex w-9 h-9 rounded-full bg-[#F2F1EC] items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Sign Out"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </button>
            <div className="w-px h-6 bg-gray-200 hidden md:block"></div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1a3b2b] to-[#2d6347] border-2 border-white shadow-sm flex items-center justify-center text-white font-bold text-xs cursor-pointer">
              AD
            </div>
          </div>
        </div>

        {/* Mobile Tab Bar */}
        <div className="md:hidden flex items-center gap-1 px-4 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'dashboard' 
                ? 'bg-[#1a3b2b] text-white' 
                : 'bg-[#F2F1EC] text-gray-500'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`relative px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'applications' 
                ? 'bg-[#1a3b2b] text-white' 
                : 'bg-[#F2F1EC] text-gray-500'
            }`}
          >
            Applications
            {pendingCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#c8a44e] text-white text-[8px] w-4 h-4 rounded-full font-bold flex items-center justify-center">{pendingCount}</span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('codes')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'codes' 
                ? 'bg-[#1a3b2b] text-white' 
                : 'bg-[#F2F1EC] text-gray-500'
            }`}
          >
            Invite Codes
          </button>
        </div>
      </nav>

      {/* Main Content — Full Width */}
      <main className="w-full max-w-[1440px] mx-auto p-6 md:p-10">
        
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-[28px] md:text-[32px] font-bold text-gray-900 font-sans tracking-tight mb-8">
            Welcome back, Admin
          </h1>
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-base font-semibold text-gray-900 mb-1">
                {activeTab === 'dashboard' ? 'Curation Dashboard' : activeTab === 'applications' ? 'Applications' : 'Invite Codes'}
              </h2>
              <p className="text-[13px] md:text-[14px] font-normal text-[#6B7280]">
                {activeTab === 'dashboard' ? 'Manage attendees for the From Go To Goal Summit.' : activeTab === 'applications' ? 'Review and manage all applicant submissions.' : 'Manage invite codes and track claims.'}
              </p>
            </div>
          </header>
        </div>

        {/* Stats Grid — Dashboard only */}
        {activeTab === 'dashboard' && (<>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-[#1E1E1E] text-[#ffffff] rounded-[24px] p-6 shadow-[0px_2px_12px_rgba(0,0,0,0.06)] relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#ffffff]/10 rounded-full blur-2xl"></div>
            <h3 className="text-[#ffffff]/80 text-[11px] uppercase tracking-[0.08em] font-semibold mb-6 flex justify-between items-center">
              Total Applications
              <svg className="w-6 h-6 bg-[#ffffff]/20 rounded-full p-1 text-[#ffffff]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </h3>
            <div className="flex items-end justify-between">
              <p className="text-[40px] md:text-[48px] font-extrabold font-sans text-[#ffffff] leading-none">{totalApps}</p>
              <span className="text-[13px] font-normal bg-[#ffffff]/20 text-[#ffffff] px-2 py-1 rounded-md mb-1">+ Active</span>
            </div>
          </div>
          
          <div className="bg-[#FFFFFF] border border-transparent rounded-[24px] p-6 shadow-[0px_2px_12px_rgba(0,0,0,0.06)] hover:shadow-md transition-shadow">
            <h3 className="text-gray-500 text-[11px] uppercase tracking-[0.08em] font-semibold mb-6 flex justify-between items-center">
              Pending Review
              <svg className="w-6 h-6 bg-amber-50 text-amber-500 rounded-full p-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </h3>
            <p className="text-[40px] md:text-[48px] font-extrabold font-sans text-gray-900 leading-none">{pendingCount}</p>
          </div>

          <div className="bg-[#FFFFFF] border border-transparent rounded-[24px] p-6 shadow-[0px_2px_12px_rgba(0,0,0,0.06)] hover:shadow-md transition-shadow">
            <h3 className="text-gray-500 text-[11px] uppercase tracking-[0.08em] font-semibold mb-6 flex justify-between items-center">
              Approved
              <svg className="w-6 h-6 bg-green-50 text-green-500 rounded-full p-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </h3>
            <p className="text-[40px] md:text-[48px] font-extrabold font-sans text-gray-900 leading-none">{approvedCount}</p>
          </div>

          <div className="bg-[#FFFFFF] border border-transparent rounded-[24px] p-6 shadow-[0px_2px_12px_rgba(0,0,0,0.06)] hover:shadow-md transition-shadow">
            <h3 className="text-gray-500 text-[11px] uppercase tracking-[0.08em] font-semibold mb-6 flex justify-between items-center">
              Codes Claimed
              <svg className="w-6 h-6 bg-blue-50 text-blue-500 rounded-full p-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
            </h3>
            <p className="text-[40px] md:text-[48px] font-extrabold font-sans text-gray-900 leading-none">{claimedCodes}</p>
          </div>
        </div>

        {/* Premium Insights Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* Conversion Rate Card */}
          <div className="bg-[#1E1E1E] border border-transparent rounded-[24px] p-6 shadow-[0px_2px_12px_rgba(0,0,0,0.06)] flex flex-col justify-between">
            <div>
              <h3 className="text-gray-400 text-[11px] uppercase tracking-[0.08em] font-semibold mb-4">Acceptance Rate</h3>
              <div className="flex items-center gap-4">
                <div className="text-[40px] md:text-[48px] font-extrabold font-sans text-white leading-none">{acceptanceRate}%</div>
                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 transition-all duration-1000" 
                    style={{ width: `${acceptanceRate}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-[13px] md:text-[14px] font-normal text-[#6B7280] mt-4">Percentage of total applications currently accepted.</p>
            </div>
          </div>

          {/* Room Mix Card */}
          <div className="bg-[#FFFFFF] border border-transparent rounded-[24px] p-6 shadow-[0px_2px_12px_rgba(0,0,0,0.06)]">
            <h3 className="text-gray-400 text-[11px] uppercase tracking-[0.08em] font-semibold mb-4">Room Mix</h3>
            <div className="space-y-3">
              {Object.entries(roomMix).map(([cat, count]: [string, any]) => (
                <div key={cat}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-gray-700">{cat}</span>
                    <span className="text-gray-400 font-mono">{count}</span>
                  </div>
                  <div className="h-1 bg-gray-50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#c8a44e] opacity-60" 
                      style={{ width: `${(count / totalApps) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
              {Object.keys(roomMix).length === 0 && <p className="text-xs text-gray-300 italic">No data yet</p>}
            </div>
          </div>

          {/* Claim Velocity Card */}
          <div className="bg-[#FFFFFF] border border-transparent rounded-[24px] p-6 shadow-[0px_2px_12px_rgba(0,0,0,0.06)] flex flex-col justify-between">
            <div>
              <h3 className="text-gray-400 text-[11px] uppercase tracking-[0.08em] font-semibold mb-4">Claim Velocity</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-[40px] md:text-[48px] font-extrabold font-sans text-gray-900 leading-none">{claimVelocity}</span>
                <span className="text-[13px] font-normal text-[#6B7280]">Claims / 24h</span>
              </div>
              <p className="text-[13px] md:text-[14px] font-normal text-[#6B7280] mt-4">Real-time tracking of invite code activations.</p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-50">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase text-gray-400">
                <span>Network Growth</span>
                <span className={claimVelocity > 0 ? "text-green-500" : "text-gray-300"}>
                  {claimVelocity > 0 ? "↑ Active" : "Stable"}
                </span>
              </div>
            </div>
          </div>
        </div>
        </>)}

        {/* Data Table Area */}
        <div className="bg-[#FFFFFF] border border-transparent rounded-[24px] shadow-[0px_2px_12px_rgba(0,0,0,0.06)] overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-white">
            <h2 className="text-base font-semibold text-gray-900">
              {activeTab === 'codes' ? 'Invite Codes Overview' : activeTab === 'applications' ? 'All Applications' : 'Recent Applications'}
            </h2>
            <div className="flex items-center gap-3">
              {activeTab === 'codes' && (
                <div className="flex items-center gap-2">
                  <select 
                    value={newCodeCategory} 
                    onChange={(e) => setNewCodeCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#c8a44e]/20"
                  >
                    <option value="VIP">VIP</option>
                    <option value="Sponsor">Sponsor</option>
                    <option value="Media">Media</option>
                    <option value="Speaker">Speaker</option>
                  </select>
                  <button 
                    onClick={onGenerateCode}
                    disabled={isGenerating}
                    className="flex items-center gap-2 px-4 py-2 bg-[#1a3b2b] text-[#ffffff] rounded-xl text-xs font-bold shadow-md shadow-green-900/10 hover:bg-[#122a1f] transition-all disabled:opacity-50"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                    {isGenerating ? "Generating..." : "Generate Code"}
                  </button>
                </div>
              )}
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-xl text-xs font-semibold text-gray-600 transition-colors border border-gray-200">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                Filter
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="h-64 flex flex-col items-center justify-center gap-4">
              <div className="w-8 h-8 border-4 border-gray-100 border-t-[#c8a44e] rounded-full animate-spin"></div>
              <p className="text-xs text-gray-400 font-medium animate-pulse">Syncing with database...</p>
            </div>
          ) : activeTab !== 'codes' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-gray-400 font-semibold text-[11px] uppercase tracking-wider border-b border-gray-50 bg-gray-50/30">
                  <tr>
                    <th className="px-8 py-5">Applicant Info</th>
                    <th className="px-8 py-5">Role & Company</th>
                    <th className="px-8 py-5">Category</th>
                    <th className="px-8 py-5">Status</th>
                    <th className="px-8 py-5">Sync</th>
                    <th className="px-8 py-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {applications.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-8 py-16 text-center text-gray-400">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                          <p>No applications found.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    applications.map((app) => (
                      <tr key={app.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm border border-blue-100">
                              {app.first_name[0]}{app.last_name[0]}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900 text-[15px]">{app.first_name} {app.last_name}</div>
                              <div className="text-xs text-gray-500 mt-0.5">{app.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="text-gray-900 font-medium">{app.current_role || "No Role"}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{app.company || app.university}</div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex flex-col gap-1.5 items-start">
                            <span className="text-xs font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-md">{app.category}</span>
                            {app.invite_code_issued && (
                              <span className="text-[10px] text-gray-400 font-mono font-medium tracking-wide">
                                ↳ {app.invite_code_issued}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${
                            app.status === 'Accepted' ? 'bg-green-100 text-green-700' : 
                            app.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {app.status === 'Accepted' && <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>}
                            {app.status === 'Under Review' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2"></span>}
                            {app.status === 'Rejected' && <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2"></span>}
                            {app.status}
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          {app.sync_errors ? (
                            <div className="flex items-center gap-1.5 text-red-500 cursor-help" title={app.sync_errors}>
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.268 14c-.77 1.333.192 3 1.732 3z" /></svg>
                              <span className="text-[10px] font-bold uppercase">Errors</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-green-500">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                              <span className="text-[10px] font-bold uppercase">Synced</span>
                            </div>
                          )}
                        </td>
                        <td className="px-8 py-5 text-right">
                          {app.status === 'Under Review' ? (
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => onDecline(app.id)}
                                disabled={processingId === app.id}
                                className="px-4 py-2 rounded-xl text-red-600 text-xs font-bold hover:bg-red-50 transition-colors disabled:opacity-50"
                              >
                                Decline
                              </button>
                              <button 
                                onClick={() => onApprove(app.id)}
                                disabled={processingId === app.id}
                                className="px-5 py-2 rounded-xl bg-[#1a3b2b] text-[#ffffff] text-xs font-bold hover:bg-[#122a1f] shadow-md shadow-green-900/10 transition-all disabled:opacity-50 hover:-translate-y-0.5"
                              >
                                {processingId === app.id ? "Sending..." : "Approve"}
                              </button>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-xs italic font-medium">Reviewed</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-gray-400 font-semibold text-[11px] uppercase tracking-wider border-b border-gray-50 bg-gray-50/30">
                  <tr>
                    <th className="px-8 py-5">Invite Code</th>
                    <th className="px-8 py-5">Category</th>
                    <th className="px-8 py-5">Status</th>
                    <th className="px-8 py-5">Claimed By</th>
                    <th className="px-8 py-5 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {inviteCodes.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-5 font-mono font-bold text-gray-900 text-[15px] tracking-tight">{item.code}</td>
                      <td className="px-8 py-5 text-gray-600 font-medium">{item.category}</td>
                      <td className="px-8 py-5">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${
                          item.status === 'Active' ? 'bg-blue-50 text-blue-600' : 
                          item.status === 'Claimed' ? 'bg-green-50 text-green-600' :
                          'bg-gray-100 text-gray-500'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-gray-800">{item.claimed_by_email || <span className="text-gray-300">-</span>}</td>
                      <td className="px-8 py-5 text-right text-gray-500 text-sm">
                        {item.claimed_at ? new Date(item.claimed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "-"}
                      </td>
                      <td className="px-8 py-5 text-right">
                        {item.status !== 'Claimed' && (
                          <button
                            onClick={() => onToggleCode(item.id, item.status)}
                            disabled={processingId === item.id}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50 ${
                              item.status === 'Active' 
                                ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                                : 'bg-green-50 text-green-600 hover:bg-green-100'
                            }`}
                          >
                            {processingId === item.id ? "..." : item.status === 'Active' ? "Deactivate" : "Activate"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
