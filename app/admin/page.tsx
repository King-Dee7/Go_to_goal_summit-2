/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { motion, AnimatePresence } from "framer-motion";
import { 
  approveApplication, 
  declineApplication, 
  fetchApplications, 
  fetchInviteCodes,
  generateInviteCode,
  toggleInviteCodeStatus
} from "@/app/actions/admin-actions";

type Tab = 'dashboard' | 'applications' | 'codes';

// Icons using inline SVG paths for clean, unboxed styling
const Icons = {
  Dashboard: (props: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>,
  Users: (props: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Key: (props: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>,
  LogOut: (props: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Globe: (props: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  Search: (props: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Filter: (props: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  Eye: (props: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  CheckCircle: (props: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  XCircle: (props: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>,
};

const getAvatarStyle = (first: string, last: string) => {
  const charCodeSum = (first?.charCodeAt(0) || 0) + (last?.charCodeAt(0) || 0);
  // Analogous color scheme for avatars
  const bgColors = [
    "bg-[#5347CE]", // Deep Purple
    "bg-[#887CFD]", // Soft Purple
    "bg-[#4896FE]", // Bright Blue
    "bg-[#16C8C7]", // Teal
  ];
  const index = charCodeSum % bgColors.length;
  return `w-10 h-10 rounded-full ${bgColors[index]} text-white flex items-center justify-center font-bold text-sm shadow-sm`;
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [applications, setApplications] = useState<any[]>([]);
  const [inviteCodes, setInviteCodes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedApplicant, setSelectedApplicant] = useState<any | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [newCodeCategory, setNewCodeCategory] = useState('VIP');
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
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

  const acceptanceRate = totalApps > 0 ? Math.round((approvedCount / totalApps) * 100) : 0;
  
  const roomMix = applications.reduce((acc: any, app: any) => {
    acc[app.category] = (acc[app.category] || 0) + 1;
    return acc;
  }, {});

  const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const claimVelocity = inviteCodes.filter(c => c.status === 'Claimed' && c.claimed_at && new Date(c.claimed_at) > last24h).length;

  const filteredAppsList = applications.filter((app) => {
    const fullName = `${app.first_name || ""} ${app.last_name || ""}`.toLowerCase();
    const email = (app.email || "").toLowerCase();
    const role = (app.current_role || "").toLowerCase();
    const company = (app.company || app.university || "").toLowerCase();
    const category = (app.category || "").toLowerCase();
    const query = searchQuery.toLowerCase();
    
    const matchesSearch = 
      fullName.includes(query) || 
      email.includes(query) || 
      role.includes(query) || 
      company.includes(query) ||
      category.includes(query);
      
    const matchesFilter = 
      statusFilter === "All" || 
      (statusFilter === "Under Review" && app.status === "Under Review") ||
      (statusFilter === "Accepted" && app.status === "Accepted") ||
      (statusFilter === "Rejected" && app.status === "Rejected");
      
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-slate-800 font-sans flex flex-col md:flex-row selection:bg-[#5347CE]/20 selection:text-[#5347CE]">
      
      {/* Sidebar Navigation */}
      <aside className="hidden md:flex flex-col w-[260px] bg-[#F8F9FA] border-r border-slate-200/60 sticky top-0 h-screen shrink-0 z-40">
        
        {/* Brand Header */}
        <div className="h-[76px] flex items-center px-6 border-b border-slate-200/60 shrink-0">
          <Image
            src="/reinvent-logo.png"
            alt="Reinvent Africa Network Logo"
            width={160}
            height={40}
            className="h-9 w-auto object-contain"
            priority
          />
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-8">
          
          <div>
            <h3 className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">General</h3>
            <nav className="flex flex-col gap-1">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm ${
                  activeTab === 'dashboard' 
                    ? 'bg-[#5347CE]/10 text-[#5347CE]' 
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                <Icons.Dashboard className={`w-[18px] h-[18px] ${activeTab === 'dashboard' ? 'text-[#5347CE]' : 'text-slate-400'}`} />
                Dashboard
              </button>
              
              <button
                onClick={() => setActiveTab('applications')}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm ${
                  activeTab === 'applications' 
                    ? 'bg-[#5347CE]/10 text-[#5347CE]' 
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icons.Users className={`w-[18px] h-[18px] ${activeTab === 'applications' ? 'text-[#5347CE]' : 'text-slate-400'}`} />
                  Applications
                </div>
                {pendingCount > 0 && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    activeTab === 'applications' ? 'bg-[#5347CE] text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {pendingCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('codes')}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm ${
                  activeTab === 'codes' 
                    ? 'bg-[#5347CE]/10 text-[#5347CE]' 
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                <Icons.Key className={`w-[18px] h-[18px] ${activeTab === 'codes' ? 'text-[#5347CE]' : 'text-slate-400'}`} />
                Invite Codes
              </button>
            </nav>
          </div>
          
        </div>

        {/* Bottom Profile / Support Area */}
        <div className="p-4 border-t border-slate-200/60 shrink-0 flex flex-col gap-2">
          <button 
            onClick={() => window.open('/', '_blank')} 
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors text-sm font-medium"
          >
            <Icons.Globe className="w-[18px] h-[18px] text-slate-400" />
            Live Site
          </button>
          
          <div className="flex items-center justify-between p-3 bg-white rounded-[16px] shadow-[0_2px_10px_rgb(0,0,0,0.03)] border border-slate-100 mt-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#16C8C7] to-[#4896FE] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                AD
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-800">Admin</span>
                <span className="text-[10px] text-slate-400 font-medium">Reinvent Africa</span>
              </div>
            </div>
            <button 
              onClick={handleSignOut}
              className="text-slate-400 hover:text-rose-500 transition-colors p-1.5 rounded-lg hover:bg-rose-50"
              title="Sign Out"
            >
              <Icons.LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header (Hidden on Desktop) */}
      <header className="md:hidden flex items-center justify-between px-5 h-16 bg-white border-b border-slate-200 sticky top-0 z-50">
        <Image
          src="/reinvent-logo.png"
          alt="Reinvent Africa Network Logo"
          width={130}
          height={32}
          className="h-8 w-auto object-contain"
          priority
        />
        <div className="flex gap-2">
          <div className="relative">
             <select 
               value={activeTab} 
               onChange={(e) => setActiveTab(e.target.value as Tab)}
               className="bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium pl-2.5 pr-7 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#5347CE]/20 appearance-none cursor-pointer"
             >
               <option value="dashboard">Dashboard</option>
               <option value="applications">Applications</option>
               <option value="codes">Invite Codes</option>
             </select>
             <svg 
               className="w-3 h-3 text-slate-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" 
               fill="none" 
               stroke="currentColor" 
               strokeWidth="2.5" 
               viewBox="0 0 24 24"
             >
               <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
             </svg>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[1200px] mx-auto p-4 md:p-8 lg:p-10 overflow-x-hidden">
        
        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-[28px] font-bold text-slate-800 tracking-tight">
              {activeTab === 'dashboard' ? 'Dashboard' : activeTab === 'applications' ? 'Applicant Curation' : 'Invitation Codes'}
            </h1>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              {activeTab === 'dashboard' && 'Core metrics and network velocity insights.'}
              {activeTab === 'applications' && 'Review and curate attendee submissions.'}
              {activeTab === 'codes' && 'Manage invitation passes and monitor user flows.'}
            </p>
          </div>
          
          {/* Quick Actions (e.g. Code Gen) */}
          {activeTab === 'codes' && (
            <div className="flex items-center gap-3 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm">
              <div className="relative">
                <select 
                  value={newCodeCategory} 
                  onChange={(e) => setNewCodeCategory(e.target.value)}
                  className="pl-3 pr-8 py-2 bg-slate-50 border-transparent rounded-lg text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#5347CE]/20 transition-all cursor-pointer appearance-none"
                >
                  <option value="VIP">VIP</option>
                  <option value="Sponsor">Sponsor</option>
                  <option value="Media">Media</option>
                  <option value="Speaker">Speaker</option>
                </select>
                <svg 
                  className="w-3 h-3 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <button 
                onClick={onGenerateCode}
                disabled={isGenerating}
                className="flex items-center gap-2 px-4 py-2 bg-[#5347CE] text-white rounded-lg text-sm font-bold shadow-sm hover:shadow-md hover:bg-[#4337b5] hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50"
              >
                {isGenerating ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                )}
                Generate
              </button>
            </div>
          )}
        </div>

        {/* --- DASHBOARD TAB --- */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            
            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              
              {/* Total Applications */}
              <div className="bg-white rounded-[20px] p-6 border border-slate-100 shadow-[0_4px_24px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2 text-slate-500 font-medium text-[13px]">
                    <Icons.Eye className="w-4 h-4" />
                    Total Apps
                  </div>
                  <Icons.Eye className="w-3.5 h-3.5 text-slate-300" />
                </div>
                <div className="flex items-baseline gap-3">
                  <h3 className="text-[32px] font-bold text-slate-800 tracking-tight leading-none">{totalApps}</h3>
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-[#16C8C7]/10 text-[#16C8C7] text-[11px] font-bold">
                    +15.8% <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7h-10M17 7v10" /></svg>
                  </span>
                </div>
              </div>

              {/* Pending Review */}
              <div className="bg-white rounded-[20px] p-6 border border-slate-100 shadow-[0_4px_24px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2 text-slate-500 font-medium text-[13px]">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Pending Review
                  </div>
                </div>
                <div className="flex items-baseline gap-3">
                  <h3 className="text-[32px] font-bold text-slate-800 tracking-tight leading-none">{pendingCount}</h3>
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-[#887CFD]/10 text-[#887CFD] text-[11px] font-bold">
                    Queue <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                  </span>
                </div>
              </div>

              {/* Approved */}
              <div className="bg-white rounded-[20px] p-6 border border-slate-100 shadow-[0_4px_24px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2 text-slate-500 font-medium text-[13px]">
                    <Icons.CheckCircle className="w-4 h-4" />
                    Approved
                  </div>
                </div>
                <div className="flex items-baseline gap-3">
                  <h3 className="text-[32px] font-bold text-slate-800 tracking-tight leading-none">{approvedCount}</h3>
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-[#5347CE]/10 text-[#5347CE] text-[11px] font-bold">
                    Steady <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" /></svg>
                  </span>
                </div>
              </div>

              {/* Codes Claimed */}
              <div className="bg-white rounded-[20px] p-6 border border-slate-100 shadow-[0_4px_24px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2 text-slate-500 font-medium text-[13px]">
                    <Icons.Key className="w-4 h-4" />
                    Codes Claimed
                  </div>
                </div>
                <div className="flex items-baseline gap-3">
                  <h3 className="text-[32px] font-bold text-slate-800 tracking-tight leading-none">{claimedCodes}</h3>
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-[#4896FE]/10 text-[#4896FE] text-[11px] font-bold">
                    {claimVelocity} / 24h
                  </span>
                </div>
              </div>
            </div>

            {/* Main Visualizations Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Sales Overview (Room Mix representation) */}
              <div className="bg-white rounded-[20px] p-6 border border-slate-100 shadow-[0_4px_24px_rgb(0,0,0,0.02)] lg:col-span-2 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                    Room Mix Distribution
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-end min-h-[220px]">
                  <div className="flex items-end justify-around h-[180px] w-full px-4 gap-4">
                    {Object.keys(roomMix).length > 0 ? (
                      Object.entries(roomMix).map(([cat, count]: [string, any], idx) => {
                        const pct = totalApps > 0 ? Math.round((count / totalApps) * 100) : 0;
                        const colors = [
                          'bg-gradient-to-t from-[#5347CE]/80 to-[#887CFD]',
                          'bg-gradient-to-t from-[#4896FE]/80 to-[#16C8C7]',
                          'bg-gradient-to-t from-[#887CFD]/80 to-[#5347CE]',
                          'bg-gradient-to-t from-[#16C8C7]/80 to-[#4896FE]'
                        ];
                        const barColor = colors[idx % colors.length];
                        return (
                          <div key={cat} className="flex flex-col items-center gap-3 w-16 group">
                            <span className="text-xs font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">{count}</span>
                            <div 
                              className={`w-full rounded-t-lg ${barColor} shadow-sm transition-all duration-700 ease-out`}
                              style={{ height: `${Math.max(pct, 10)}%` }}
                            ></div>
                            <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap overflow-hidden text-ellipsis w-20 text-center">
                              {cat}
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <div className="w-full flex items-center justify-center text-slate-400 text-sm h-full">No data yet</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Acceptance Rate Ring */}
              <div className="bg-white rounded-[20px] p-6 border border-slate-100 shadow-[0_4px_24px_rgb(0,0,0,0.02)] flex flex-col justify-between">
                <div className="flex items-center gap-2 text-slate-700 font-bold text-sm mb-4">
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                  Acceptance Rate
                </div>
                <div className="flex-1 flex flex-col items-center justify-center relative">
                  <div className="relative w-40 h-40 shrink-0 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-100"
                        strokeWidth="4"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-[#5347CE] transition-all duration-1000 ease-out"
                        strokeWidth="4"
                        strokeDasharray={`${acceptanceRate}, 100`}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-slate-800 tracking-tight">{acceptanceRate}%</span>
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mt-1">Approved</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* --- APPLICATIONS & CODES TABLES --- */}
        {activeTab !== 'dashboard' && (
          <div className="bg-white rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-slate-100/60 overflow-hidden flex flex-col">
            
            {/* Table Header & Controls */}
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white">
              <h2 className="text-[15px] font-bold text-slate-800 flex items-center gap-2">
                <Icons.Filter className="w-4 h-4 text-slate-400" />
                {activeTab === 'applications' ? 'All Applicants' : 'Invitation List'}
              </h2>
              
              <div className="flex flex-wrap items-center gap-3">
                {activeTab === 'applications' && (
                  <>
                    <div className="relative">
                      <Icons.Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input 
                        type="text" 
                        placeholder="Search..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#5347CE]/20 focus:border-[#5347CE] transition-all w-48 text-slate-700 placeholder-slate-400" 
                      />
                    </div>
                    <div className="relative">
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="pl-4 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#5347CE]/20 cursor-pointer appearance-none"
                      >
                        <option value="All">All Statuses</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Accepted">Approved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                      <svg 
                        className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2.5" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="h-64 flex flex-col items-center justify-center gap-3 bg-slate-50/30">
                <span className="w-6 h-6 border-2 border-slate-200 border-t-[#5347CE] rounded-full animate-spin"></span>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest animate-pulse">Syncing Data</p>
              </div>
            ) : activeTab === 'applications' ? (
              
              /* Applications Table */
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50/80 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 font-semibold text-slate-400 text-[11px] uppercase tracking-wider">Applicant Info</th>
                      <th className="px-6 py-4 font-semibold text-slate-400 text-[11px] uppercase tracking-wider">Role & Company</th>
                      <th className="px-6 py-4 font-semibold text-slate-400 text-[11px] uppercase tracking-wider">Category</th>
                      <th className="px-6 py-4 font-semibold text-slate-400 text-[11px] uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 font-semibold text-slate-400 text-[11px] uppercase tracking-wider text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAppsList.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-16 text-center text-slate-400">
                          <p className="font-medium text-sm">No applications found.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredAppsList.map((app) => {
                        const avatarStyle = getAvatarStyle(app.first_name || "", app.last_name || "");
                        const initials = `${(app.first_name?.[0] || "").toUpperCase()}${(app.last_name?.[0] || "").toUpperCase()}`;

                        return (
                          <tr 
                            key={app.id} 
                            onClick={() => setSelectedApplicant(app)}
                            className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className={avatarStyle}>{initials || "??"}</div>
                                <div>
                                  <div className="font-bold text-slate-800 text-[14px]">{app.first_name} {app.last_name}</div>
                                  <div className="text-xs font-medium text-slate-500 mt-0.5">{app.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-[13px] font-bold text-slate-700">{app.current_role || "No Role"}</div>
                              <div className="text-[12px] font-medium text-slate-500 mt-0.5">{app.company || app.university}</div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">{app.category}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all ${
                                app.status === 'Accepted' 
                                  ? 'bg-[#16C8C7]/10 text-[#16C8C7]' 
                                  : app.status === 'Rejected' 
                                  ? 'bg-rose-500/10 text-rose-500' 
                                  : 'bg-[#887CFD]/10 text-[#887CFD]'
                              }`}>
                                {app.status === 'Accepted' ? 'Approved' : app.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              {app.status === 'Under Review' ? (
                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); onDecline(app.id); }}
                                    disabled={processingId !== null}
                                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 text-xs font-bold transition-all disabled:opacity-50"
                                  >
                                    Decline
                                  </button>
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); onApprove(app.id); }}
                                    disabled={processingId !== null}
                                    className="px-3 py-1.5 rounded-lg bg-[#5347CE] text-white hover:bg-[#4337b5] text-xs font-bold transition-all shadow-sm hover:shadow disabled:opacity-50"
                                  >
                                    Approve
                                  </button>
                                </div>
                              ) : (
                                <span className="text-slate-400 text-xs font-medium italic">Reviewed</span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

            ) : (

              /* Invite Codes Table */
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50/80 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 font-semibold text-slate-400 text-[11px] uppercase tracking-wider">Invite Code</th>
                      <th className="px-6 py-4 font-semibold text-slate-400 text-[11px] uppercase tracking-wider">Category</th>
                      <th className="px-6 py-4 font-semibold text-slate-400 text-[11px] uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 font-semibold text-slate-400 text-[11px] uppercase tracking-wider">Claimed By</th>
                      <th className="px-6 py-4 font-semibold text-slate-400 text-[11px] uppercase tracking-wider text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {inviteCodes.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-16 text-center text-slate-400 font-medium text-sm">No codes generated yet.</td>
                      </tr>
                    ) : (
                      inviteCodes.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-mono font-bold text-slate-700 text-[13px]">{item.code}</td>
                          <td className="px-6 py-4 text-slate-600 text-[13px] font-bold">{item.category}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${
                              item.status === 'Active' 
                                ? 'bg-[#4896FE]/10 text-[#4896FE]' 
                                : item.status === 'Claimed' 
                                ? 'bg-[#16C8C7]/10 text-[#16C8C7]' 
                                : 'bg-slate-100 text-slate-500'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-500 text-[13px] font-medium">
                            {item.claimed_by_email || <span className="text-slate-300">-</span>}
                          </td>
                          <td className="px-6 py-4 text-right">
                            {item.status !== 'Claimed' && (
                              <button
                                onClick={() => onToggleCode(item.id, item.status)}
                                disabled={processingId !== null}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50 ${
                                  item.status === 'Active' 
                                    ? 'bg-rose-50 text-rose-500 hover:bg-rose-100' 
                                    : 'bg-[#5347CE]/10 text-[#5347CE] hover:bg-[#5347CE]/20'
                                }`}
                              >
                                {processingId === item.id ? "..." : item.status === 'Active' ? "Deactivate" : "Activate"}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* --- DRAWER (SIDE PANEL) --- */}
        <AnimatePresence>
          {selectedApplicant && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedApplicant(null)}
                className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[100]"
              />

              {/* Drawer Panel */}
              <motion.div
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "100%", opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed top-0 bottom-0 right-0 w-full max-w-xl bg-white shadow-2xl z-[101] flex flex-col overflow-hidden border-l border-slate-100"
              >
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50 shrink-0">
                  <div className="flex items-center gap-4">
                    <div className={`${getAvatarStyle(selectedApplicant.first_name || "", selectedApplicant.last_name || "")} w-14 h-14 text-lg shadow-md`}>
                      {`${(selectedApplicant.first_name?.[0] || "").toUpperCase()}${(selectedApplicant.last_name?.[0] || "").toUpperCase()}` || "??"}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-800">{selectedApplicant.first_name} {selectedApplicant.last_name}</h2>
                      <p className="text-sm font-medium text-slate-500 mb-1.5">{selectedApplicant.email}</p>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        selectedApplicant.status === 'Accepted' 
                          ? 'bg-[#16C8C7]/10 text-[#16C8C7]' 
                          : selectedApplicant.status === 'Rejected' 
                          ? 'bg-rose-500/10 text-rose-500' 
                          : 'bg-[#887CFD]/10 text-[#887CFD]'
                      }`}>
                        {selectedApplicant.status === 'Accepted' ? 'Approved' : selectedApplicant.status}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedApplicant(null)}
                    className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <Icons.XCircle className="w-6 h-6" />
                  </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8 bg-white">
                  
                  {/* Quick Info Grid */}
                  <div className="grid grid-cols-2 gap-y-6 gap-x-4 p-5 bg-slate-50 rounded-2xl border border-slate-100/60">
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Role</span>
                      <span className="text-sm font-bold text-slate-700">{selectedApplicant.current_role || "N/A"}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Company / Uni</span>
                      <span className="text-sm font-bold text-slate-700">{selectedApplicant.company || selectedApplicant.university || "N/A"}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Category</span>
                      <span className="text-sm font-bold text-slate-700">{selectedApplicant.category || "N/A"}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Social</span>
                      <span className="text-sm font-bold text-[#5347CE] break-all">{selectedApplicant.social_handle || "N/A"}</span>
                    </div>
                  </div>

                  {/* Q&A Section */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-6 border-b border-slate-100 pb-3">
                      <svg className="w-4 h-4 text-[#5347CE]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                      Application Answers
                    </h3>
                    
                    <div className="space-y-8">
                      {[
                        { q: "What are you currently building or passionate about?", a: selectedApplicant.q1_passion },
                        { q: "What's something you should do differently but haven't yet and why?", a: selectedApplicant.q2_differently },
                        { q: "What are you trying to build or become in the next few years?", a: selectedApplicant.q3_future_goals },
                        { q: "Why are you applying and what are your intentions after the summit?", a: selectedApplicant.q4_intentions },
                        { q: "What's a belief you held strongly that you've since changed?", a: selectedApplicant.q5_changed_belief },
                      ].map((item, idx) => (
                        <div key={idx} className="group">
                          <p className="text-[13px] font-bold text-slate-500 mb-2 leading-snug group-hover:text-[#5347CE] transition-colors">{item.q}</p>
                          <div className="text-[15px] text-slate-800 leading-relaxed font-medium whitespace-pre-wrap pl-4 border-l-2 border-slate-100 group-hover:border-[#5347CE]/30 transition-colors">
                            {item.a || <span className="text-slate-400 italic">No answer provided.</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Footer */}
                {selectedApplicant.status === 'Under Review' && (
                  <div className="p-5 border-t border-slate-100 bg-white flex gap-3 shrink-0">
                    <button 
                      onClick={() => {
                        onDecline(selectedApplicant.id);
                        setSelectedApplicant(null);
                      }}
                      disabled={processingId !== null}
                      className="flex-1 py-3 rounded-xl border-2 border-slate-200 text-slate-600 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 text-sm font-bold transition-all disabled:opacity-50"
                    >
                      Decline Profile
                    </button>
                    <button 
                      onClick={() => {
                        onApprove(selectedApplicant.id);
                        setSelectedApplicant(null);
                      }}
                      disabled={processingId !== null}
                      className="flex-1 py-3 rounded-xl bg-[#5347CE] text-white hover:bg-[#4337b5] text-sm font-bold transition-all shadow-[0_4px_14px_rgba(83,71,206,0.3)] hover:shadow-[0_6px_20px_rgba(83,71,206,0.4)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
                    >
                      Approve Applicant
                    </button>
                  </div>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
        
      </main>
    </div>
  );
}
