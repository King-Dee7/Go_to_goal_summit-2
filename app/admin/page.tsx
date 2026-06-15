/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { 
  approveApplication, 
  declineApplication, 
  fetchApplications, 
  fetchInviteCodes,
  generateInviteCode,
  toggleInviteCodeStatus,
  deleteApplication,
  deleteInviteCode
} from "@/app/actions/admin-actions";

/* ─────────────────────────────────────────────────────────────
   TYPES
   ───────────────────────────────────────────────────────────── */

type Tab = 'dashboard' | 'applications' | 'codes';
type DesignTheme = 'current' | 'stripe' | 'linear' | 'vercel' | 'airtable' | 'supabase';

interface ThemeTokens {
  name: string;
  dot: string;
  isDark: boolean;
  bgPage: string;
  bgCard: string;
  bgSidebar: string;
  bgTableHead: string;
  bgInput: string;
  bgHover: string;
  bgDrawerHead: string;
  bgInfoGrid: string;
  textHeading: string;
  textBody: string;
  textMuted: string;
  textOnAccent: string;
  accent: string;
  accentHover: string;
  accentSoft: string;
  border: string;
  borderSubtle: string;
  cardShadow: string;
  cardHoverShadow: string;
  cardRadius: string;
  btnRadius: string;
  success: string;
  successSoft: string;
  danger: string;
  dangerSoft: string;
  pending: string;
  pendingSoft: string;
  info: string;
  infoSoft: string;
  barColors: string[];
  ringColor: string;
  ringTrack: string;
  avatarColors: string[];
  spinnerTrack: string;
  spinnerHead: string;
}

/* ─────────────────────────────────────────────────────────────
   THEME DEFINITIONS — Six distinct brand design systems
   ───────────────────────────────────────────────────────────── */

const themes: Record<DesignTheme, ThemeTokens> = {

  /* ── Current (Original RAN Style) ────────────────────────── */
  current: {
    name: 'Current',
    dot: '#5347CE',
    isDark: false,
    bgPage: '#F4F5F7',
    bgCard: '#FFFFFF',
    bgSidebar: '#F8F9FA',
    bgTableHead: 'rgba(248,250,252,0.8)',
    bgInput: '#F8FAFC',
    bgHover: 'rgba(248,250,252,0.5)',
    bgDrawerHead: 'rgba(248,250,252,0.5)',
    bgInfoGrid: '#F8FAFC',
    textHeading: '#1e293b',
    textBody: '#64748b',
    textMuted: '#94a3b8',
    textOnAccent: '#FFFFFF',
    accent: '#5347CE',
    accentHover: '#4337B5',
    accentSoft: 'rgba(83,71,206,0.1)',
    border: '#F1F5F9',
    borderSubtle: 'rgba(226,232,240,0.6)',
    cardShadow: '0 4px 24px rgb(0 0 0 / 0.02)',
    cardHoverShadow: '0 8px 30px rgb(0 0 0 / 0.04)',
    cardRadius: '20px',
    btnRadius: '12px',
    success: '#16C8C7',
    successSoft: 'rgba(22,200,199,0.1)',
    danger: '#F43F5E',
    dangerSoft: 'rgba(244,63,94,0.1)',
    pending: '#887CFD',
    pendingSoft: 'rgba(136,124,253,0.1)',
    info: '#4896FE',
    infoSoft: 'rgba(72,150,254,0.1)',
    barColors: ['#5347CE', '#4896FE', '#887CFD', '#16C8C7'],
    ringColor: '#5347CE',
    ringTrack: '#F1F5F9',
    avatarColors: ['#5347CE', '#887CFD', '#4896FE', '#16C8C7'],
    spinnerTrack: '#E2E8F0',
    spinnerHead: '#5347CE',
  },

  /* ── Stripe (Premium Fintech) ────────────────────────────── */
  stripe: {
    name: 'Stripe',
    dot: '#533AFD',
    isDark: false,
    bgPage: '#F6F9FC',
    bgCard: '#FFFFFF',
    bgSidebar: '#FFFFFF',
    bgTableHead: '#F6F9FC',
    bgInput: '#F6F9FC',
    bgHover: '#F6F9FC',
    bgDrawerHead: '#F6F9FC',
    bgInfoGrid: '#F6F9FC',
    textHeading: '#061B31',
    textBody: '#64748D',
    textMuted: '#8898AA',
    textOnAccent: '#FFFFFF',
    accent: '#533AFD',
    accentHover: '#4434D4',
    accentSoft: 'rgba(83,58,253,0.08)',
    border: '#E5EDF5',
    borderSubtle: '#E5EDF5',
    cardShadow: 'rgba(50,50,93,0.25) 0px 2px 5px -1px, rgba(0,0,0,0.05) 0px 1px 3px -1px',
    cardHoverShadow: 'rgba(50,50,93,0.25) 0px 6px 12px -2px, rgba(0,0,0,0.1) 0px 3px 7px -3px',
    cardRadius: '8px',
    btnRadius: '6px',
    success: '#15BE53',
    successSoft: 'rgba(21,190,83,0.1)',
    danger: '#EA2261',
    dangerSoft: 'rgba(234,34,97,0.1)',
    pending: '#8898AA',
    pendingSoft: 'rgba(136,152,170,0.12)',
    info: '#533AFD',
    infoSoft: 'rgba(83,58,253,0.08)',
    barColors: ['#533AFD', '#6554F0', '#7B6FF0', '#A78BFA'],
    ringColor: '#533AFD',
    ringTrack: '#E5EDF5',
    avatarColors: ['#533AFD', '#6C63FF', '#4434D4', '#2E2B8C'],
    spinnerTrack: '#E5EDF5',
    spinnerHead: '#533AFD',
  },

  /* ── Linear (Dark-mode Precision) ────────────────────────── */
  linear: {
    name: 'Linear',
    dot: '#5E6AD2',
    isDark: true,
    bgPage: '#08090A',
    bgCard: '#111213',
    bgSidebar: '#0F1011',
    bgTableHead: '#161718',
    bgInput: '#191A1B',
    bgHover: 'rgba(255,255,255,0.03)',
    bgDrawerHead: '#141516',
    bgInfoGrid: '#161718',
    textHeading: '#F7F8F8',
    textBody: '#D0D6E0',
    textMuted: '#8A8F98',
    textOnAccent: '#FFFFFF',
    accent: '#5E6AD2',
    accentHover: '#828FFF',
    accentSoft: 'rgba(94,106,210,0.15)',
    border: '#23252A',
    borderSubtle: 'rgba(255,255,255,0.06)',
    cardShadow: 'none',
    cardHoverShadow: '0 0 0 1px rgba(255,255,255,0.08)',
    cardRadius: '8px',
    btnRadius: '6px',
    success: '#27A644',
    successSoft: 'rgba(39,166,68,0.18)',
    danger: '#E5484D',
    dangerSoft: 'rgba(229,72,77,0.18)',
    pending: '#828FFF',
    pendingSoft: 'rgba(130,143,255,0.15)',
    info: '#5E6AD2',
    infoSoft: 'rgba(94,106,210,0.15)',
    barColors: ['#5E6AD2', '#7170FF', '#828FFF', '#9CA0FF'],
    ringColor: '#5E6AD2',
    ringTrack: '#23252A',
    avatarColors: ['#5E6AD2', '#7170FF', '#828FFF', '#4D58C2'],
    spinnerTrack: '#23252A',
    spinnerHead: '#5E6AD2',
  },

  /* ── Vercel (Ultra-minimal Infrastructure) ───────────────── */
  vercel: {
    name: 'Vercel',
    dot: '#000000',
    isDark: false,
    bgPage: '#FAFAFA',
    bgCard: '#FFFFFF',
    bgSidebar: '#FFFFFF',
    bgTableHead: '#FAFAFA',
    bgInput: '#FAFAFA',
    bgHover: '#FAFAFA',
    bgDrawerHead: '#FAFAFA',
    bgInfoGrid: '#FAFAFA',
    textHeading: '#171717',
    textBody: '#666666',
    textMuted: '#999999',
    textOnAccent: '#FFFFFF',
    accent: '#171717',
    accentHover: '#000000',
    accentSoft: 'rgba(23,23,23,0.06)',
    border: '#EBEBEB',
    borderSubtle: '#EBEBEB',
    cardShadow: 'rgba(0,0,0,0.08) 0px 0px 0px 1px, rgba(0,0,0,0.02) 0px 1px 2px',
    cardHoverShadow: 'rgba(0,0,0,0.12) 0px 0px 0px 1px, rgba(0,0,0,0.06) 0px 4px 8px',
    cardRadius: '12px',
    btnRadius: '8px',
    success: '#0070F3',
    successSoft: 'rgba(0,112,243,0.08)',
    danger: '#EE0000',
    dangerSoft: 'rgba(238,0,0,0.08)',
    pending: '#F5A623',
    pendingSoft: 'rgba(245,166,35,0.08)',
    info: '#0070F3',
    infoSoft: 'rgba(0,112,243,0.08)',
    barColors: ['#171717', '#444444', '#666666', '#888888'],
    ringColor: '#171717',
    ringTrack: '#EBEBEB',
    avatarColors: ['#171717', '#0070F3', '#7928CA', '#FF0080'],
    spinnerTrack: '#EBEBEB',
    spinnerHead: '#171717',
  },

  /* ── Airtable (Friendly Operations) ──────────────────────── */
  airtable: {
    name: 'Airtable',
    dot: '#1B61C9',
    isDark: false,
    bgPage: '#F7F9FC',
    bgCard: '#FFFFFF',
    bgSidebar: '#FFFFFF',
    bgTableHead: '#F2F5FA',
    bgInput: '#F2F5FA',
    bgHover: '#F2F5FA',
    bgDrawerHead: '#F2F5FA',
    bgInfoGrid: '#F2F5FA',
    textHeading: '#181D26',
    textBody: '#333333',
    textMuted: '#7B8794',
    textOnAccent: '#FFFFFF',
    accent: '#1B61C9',
    accentHover: '#154FA3',
    accentSoft: 'rgba(27,97,201,0.08)',
    border: '#E0E2E6',
    borderSubtle: '#E8EAEE',
    cardShadow: 'rgba(15,48,106,0.04) 0px 2px 12px, rgba(0,0,0,0.03) 0px 0px 1px',
    cardHoverShadow: 'rgba(15,48,106,0.08) 0px 4px 20px, rgba(0,0,0,0.04) 0px 0px 1px',
    cardRadius: '16px',
    btnRadius: '12px',
    success: '#008A00',
    successSoft: 'rgba(0,138,0,0.08)',
    danger: '#CC0000',
    dangerSoft: 'rgba(204,0,0,0.08)',
    pending: '#9B6829',
    pendingSoft: 'rgba(155,104,41,0.1)',
    info: '#1B61C9',
    infoSoft: 'rgba(27,97,201,0.08)',
    barColors: ['#1B61C9', '#2D7FF9', '#4D9BFF', '#7BB8FF'],
    ringColor: '#1B61C9',
    ringTrack: '#E0E2E6',
    avatarColors: ['#1B61C9', '#2D7FF9', '#7B61FF', '#0D6EFD'],
    spinnerTrack: '#E0E2E6',
    spinnerHead: '#1B61C9',
  },

  /* ── Supabase (Developer Dark + Emerald) ─────────────────── */
  supabase: {
    name: 'Supabase',
    dot: '#3ECF8E',
    isDark: true,
    bgPage: '#171717',
    bgCard: '#1F1F1F',
    bgSidebar: '#1A1A1A',
    bgTableHead: '#262626',
    bgInput: '#262626',
    bgHover: 'rgba(255,255,255,0.03)',
    bgDrawerHead: '#262626',
    bgInfoGrid: '#262626',
    textHeading: '#FAFAFA',
    textBody: '#B4B4B4',
    textMuted: '#898989',
    textOnAccent: '#0F0F0F',
    accent: '#3ECF8E',
    accentHover: '#2DB97A',
    accentSoft: 'rgba(62,207,142,0.12)',
    border: '#2E2E2E',
    borderSubtle: '#363636',
    cardShadow: 'none',
    cardHoverShadow: '0 0 0 1px rgba(62,207,142,0.15)',
    cardRadius: '8px',
    btnRadius: '9999px',
    success: '#3ECF8E',
    successSoft: 'rgba(62,207,142,0.12)',
    danger: '#F87171',
    dangerSoft: 'rgba(248,113,113,0.15)',
    pending: '#FBBF24',
    pendingSoft: 'rgba(251,191,36,0.12)',
    info: '#3ECF8E',
    infoSoft: 'rgba(62,207,142,0.12)',
    barColors: ['#3ECF8E', '#2DB97A', '#10B981', '#34D399'],
    ringColor: '#3ECF8E',
    ringTrack: '#2E2E2E',
    avatarColors: ['#3ECF8E', '#2DB97A', '#10B981', '#059669'],
    spinnerTrack: '#2E2E2E',
    spinnerHead: '#3ECF8E',
  },
};

/* ─────────────────────────────────────────────────────────────
   ICONS — Inline SVGs for clean unboxed styling
   ───────────────────────────────────────────────────────────── */

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


/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
   ───────────────────────────────────────────────────────────── */

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
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  /* ── New: Theme State ── */
  const [designTheme] = useState<DesignTheme>('linear');
  const t = themes[designTheme];

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

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
      setApplications(apps || []);
      setInviteCodes(codes || []);
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

  const onDeleteApplication = async (id: string) => {
    if (!confirm("Are you sure you want to DELETE this applicant permanently?")) return;
    setProcessingId(id);
    const res = await deleteApplication(id);
    if (res.success) {
      loadData();
    } else {
      alert(res.error);
    }
    setProcessingId(null);
  };

  const onDeleteCode = async (id: string) => {
    if (!confirm("Are you sure you want to DELETE this invite code permanently?")) return;
    setProcessingId(id);
    const res = await deleteInviteCode(id);
    if (res.success) {
      loadData();
    } else {
      alert(res.error);
    }
    setProcessingId(null);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("All Applicants - From Go To Goal Summit", 14, 15);
    
    const tableColumn = ["Name", "Email", "Category", "Role / Company", "Social", "Status"];
    const tableRows: any[] = [];
    
    safeApps.forEach(app => {
      const appData = [
        `${app.first_name || ''} ${app.last_name || ''}`,
        app.email || '',
        app.category || '',
        `${app.current_role || 'N/A'}\n${app.company || app.university || 'N/A'}`,
        `${app.social_platform ? app.social_platform + ': ' : ''}${app.social_handle || 'N/A'}`,
        app.status || ''
      ];
      tableRows.push(appData);
    });
    
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 22,
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [83, 71, 206] },
    });
    
    doc.save("Applicants_List.pdf");
  };

  /* ── Computed Values ── */
  const safeApps = applications || [];
  const safeCodes = inviteCodes || [];
  const pendingCount = safeApps.filter(a => a.status === 'Under Review').length;
  const approvedCount = safeApps.filter(a => a.status === 'Accepted').length;
  const totalApps = safeApps.length;
  const claimedCodes = safeCodes.filter(c => c.status === 'Claimed').length;
  const acceptanceRate = totalApps > 0 ? Math.round((approvedCount / totalApps) * 100) : 0;
  
  const roomMix = safeApps.reduce((acc: any, app: any) => {
    acc[app.category] = (acc[app.category] || 0) + 1;
    return acc;
  }, {});

  const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const claimVelocity = safeCodes.filter(c => c.status === 'Claimed' && c.claimed_at && new Date(c.claimed_at) > last24h).length;

  const filteredAppsList = safeApps.filter((app) => {
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

  /* ── Theme-aware avatar helper ── */
  const getAvatarInlineStyle = (first: string, last: string, size: 'sm' | 'lg' = 'sm'): React.CSSProperties => {
    const charCodeSum = (first?.charCodeAt(0) || 0) + (last?.charCodeAt(0) || 0);
    const idx = charCodeSum % t.avatarColors.length;
    return {
      width: size === 'lg' ? '56px' : '40px',
      height: size === 'lg' ? '56px' : '40px',
      borderRadius: '50%',
      backgroundColor: t.avatarColors[idx],
      color: '#FFFFFF',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 700,
      fontSize: size === 'lg' ? '18px' : '14px',
      flexShrink: 0,
    };
  };

  /* ── Reusable themed style helpers ── */
  const cardStyle: React.CSSProperties = {
    backgroundColor: t.bgCard,
    borderRadius: t.cardRadius,
    boxShadow: t.cardShadow,
    border: `1px solid ${t.border}`,
    transition: 'background-color 0.4s ease, box-shadow 0.33s ease, border-color 0.33s ease',
  };

  const statusBadge = (status: string): React.CSSProperties => {
    if (status === 'Accepted' || status === 'Active') return { backgroundColor: t.successSoft, color: t.success };
    if (status === 'Rejected') return { backgroundColor: t.dangerSoft, color: t.danger };
    if (status === 'Claimed') return { backgroundColor: t.infoSoft, color: t.info };
    if (status === 'Under Review') return { backgroundColor: t.pendingSoft, color: t.pending };
    return { backgroundColor: t.accentSoft, color: t.textMuted };
  };

  /* ─────────────────────────────────────────────────────────
     RENDER
     ───────────────────────────────────────────────────────── */
  return (
    <div
      className="min-h-screen font-sans flex flex-col md:flex-row"
      style={{
        backgroundColor: t.bgPage,
        color: t.textBody,
        /* CSS custom properties for hover effects */
        ['--card-hover-shadow' as string]: t.cardHoverShadow,
        ['--bg-hover' as string]: t.bgHover,
        ['--accent' as string]: t.accent,
        ['--accent-hover' as string]: t.accentHover,
        transition: 'background-color 0.4s ease, color 0.3s ease',
      }}
    >
      {/* Global hover styles via CSS custom properties */}
      <style>{`
        .themed-card { transition: box-shadow 0.33s ease, transform 0.2s ease, background-color 0.4s ease, border-color 0.33s ease; }
        .themed-card:hover { box-shadow: var(--card-hover-shadow); transform: translateY(-2px); }
        .themed-row:hover { background-color: var(--bg-hover); }
        .themed-btn { transition: background-color 0.33s ease, color 0.33s ease, box-shadow 0.25s ease, transform 0.15s ease; }
        .themed-btn:hover { transform: translateY(-1px); }
        .themed-sidebar-item { transition: background-color 0.2s ease, color 0.2s ease; }
        .theme-transition { transition: background-color 0.4s ease, color 0.3s ease, border-color 0.3s ease; }
      `}</style>

      {/* ═══════════════════════════════════════════════════════
          SIDEBAR NAVIGATION
          ═══════════════════════════════════════════════════════ */}
      <aside
        className="hidden md:flex flex-col w-[260px] sticky top-0 h-screen shrink-0 z-40 theme-transition"
        style={{
          backgroundColor: t.bgSidebar,
          borderRight: `1px solid ${t.borderSubtle}`,
        }}
      >
        {/* Brand Header */}
        <div
          className="h-[76px] flex items-center px-6 shrink-0"
          style={{ borderBottom: `1px solid ${t.borderSubtle}` }}
        >
          <Image
            src={t.isDark ? "/reinvent-logo-white.png" : "/reinvent-logo.png"}
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
            <h3
              className="px-3 text-[11px] font-bold uppercase tracking-wider mb-3"
              style={{ color: t.textMuted }}
            >
              General
            </h3>
            <nav className="flex flex-col gap-1">
              {/* Dashboard */}
              <button
                onClick={() => setActiveTab('dashboard')}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl themed-sidebar-item font-medium text-sm"
                style={{
                  backgroundColor: activeTab === 'dashboard' ? t.accentSoft : 'transparent',
                  color: activeTab === 'dashboard' ? t.accent : t.textBody,
                }}
              >
                <Icons.Dashboard className="w-[18px] h-[18px]" style={{ color: activeTab === 'dashboard' ? t.accent : t.textMuted }} />
                Dashboard
              </button>
              
              {/* Applications */}
              <button
                onClick={() => setActiveTab('applications')}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl themed-sidebar-item font-medium text-sm"
                style={{
                  backgroundColor: activeTab === 'applications' ? t.accentSoft : 'transparent',
                  color: activeTab === 'applications' ? t.accent : t.textBody,
                }}
              >
                <div className="flex items-center gap-3">
                  <Icons.Users className="w-[18px] h-[18px]" style={{ color: activeTab === 'applications' ? t.accent : t.textMuted }} />
                  Applications
                </div>
                {pendingCount > 0 && (
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: activeTab === 'applications' ? t.accent : (t.isDark ? t.border : '#E2E8F0'),
                      color: activeTab === 'applications' ? t.textOnAccent : t.textBody,
                    }}
                  >
                    {pendingCount}
                  </span>
                )}
              </button>

              {/* Invite Codes */}
              <button
                onClick={() => setActiveTab('codes')}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl themed-sidebar-item font-medium text-sm"
                style={{
                  backgroundColor: activeTab === 'codes' ? t.accentSoft : 'transparent',
                  color: activeTab === 'codes' ? t.accent : t.textBody,
                }}
              >
                <Icons.Key className="w-[18px] h-[18px]" style={{ color: activeTab === 'codes' ? t.accent : t.textMuted }} />
                Invite Codes
              </button>
            </nav>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 shrink-0 flex flex-col gap-2" style={{ borderTop: `1px solid ${t.borderSubtle}` }}>
          <button 
            onClick={() => window.open('/', '_blank')} 
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl themed-sidebar-item text-sm font-medium"
            style={{ color: t.textBody }}
          >
            <Icons.Globe className="w-[18px] h-[18px]" style={{ color: t.textMuted }} />
            Live Site
          </button>
          
          <div
            className="flex items-center justify-between p-3 rounded-[16px] mt-2"
            style={{
              backgroundColor: t.bgCard,
              boxShadow: t.isDark ? 'none' : '0 2px 10px rgb(0 0 0 / 0.03)',
              border: `1px solid ${t.border}`,
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs"
                style={{ background: `linear-gradient(135deg, ${t.avatarColors[0]}, ${t.avatarColors[2]})`, color: '#FFFFFF' }}
              >
                AD
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold" style={{ color: t.textHeading }}>Admin</span>
                <span className="text-[10px] font-medium" style={{ color: t.textMuted }}>Reinvent Africa</span>
              </div>
            </div>
            <button 
              onClick={handleSignOut}
              className="p-1.5 rounded-lg themed-sidebar-item"
              style={{ color: t.textMuted }}
              title="Sign Out"
            >
              <Icons.LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ═══════════════════════════════════════════════════════
          MOBILE HEADER
          ═══════════════════════════════════════════════════════ */}
      <header
        className="md:hidden flex items-center justify-between px-5 h-16 sticky top-0 z-50 theme-transition"
        style={{
          backgroundColor: t.bgCard,
          borderBottom: `1px solid ${t.border}`,
        }}
      >
        <Image
          src={t.isDark ? "/reinvent-logo-white.png" : "/reinvent-logo.png"}
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
               className="rounded-lg text-xs font-medium pl-2.5 pr-7 py-1.5 focus:outline-none appearance-none cursor-pointer"
               style={{
                 backgroundColor: t.bgInput,
                 border: `1px solid ${t.border}`,
                 color: t.textHeading,
               }}
             >
               <option value="dashboard">Dashboard</option>
               <option value="applications">Applications</option>
               <option value="codes">Invite Codes</option>
             </select>
             <svg 
               className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" 
               fill="none" 
               stroke="currentColor" 
               strokeWidth="2.5" 
               viewBox="0 0 24 24"
               style={{ color: t.textMuted }}
             >
               <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
             </svg>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════
          MAIN CONTENT AREA
          ═══════════════════════════════════════════════════════ */}
      <main className="flex-1 w-full max-w-[1200px] mx-auto p-4 md:p-8 lg:p-10 overflow-x-hidden pb-28">
        
        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1
              className="text-2xl md:text-[28px] font-bold tracking-tight"
              style={{ color: t.textHeading }}
            >
              {activeTab === 'dashboard' ? 'Dashboard' : activeTab === 'applications' ? 'Applicant Curation' : 'Invitation Codes'}
            </h1>
            <p className="text-sm mt-1 font-medium" style={{ color: t.textMuted }}>
              {activeTab === 'dashboard' && 'Core metrics and network velocity insights.'}
              {activeTab === 'applications' && 'Review and curate attendee submissions.'}
              {activeTab === 'codes' && 'Manage invitation passes and monitor user flows.'}
            </p>
          </div>
          
          {/* Quick Actions for Codes Tab */}
          {activeTab === 'codes' && (
            <div
              className="flex items-center gap-3 p-1.5 rounded-xl"
              style={{
                backgroundColor: t.bgCard,
                border: `1px solid ${t.border}`,
                boxShadow: t.isDark ? 'none' : '0 1px 3px rgb(0 0 0 / 0.04)',
              }}
            >
              <div className="relative">
                <select 
                  value={newCodeCategory} 
                  onChange={(e) => setNewCodeCategory(e.target.value)}
                  className="pl-3 pr-8 py-2 rounded-lg text-sm font-semibold focus:outline-none cursor-pointer appearance-none"
                  style={{
                    backgroundColor: t.bgInput,
                    color: t.textHeading,
                    border: 'none',
                  }}
                >
                  <option value="VIP">VIP</option>
                  <option value="Sponsor">Sponsor</option>
                  <option value="Media">Media</option>
                  <option value="Speaker">Speaker</option>
                </select>
                <svg className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ color: t.textMuted }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <button 
                onClick={onGenerateCode}
                disabled={isGenerating}
                className="flex items-center gap-2 px-4 py-2 text-sm font-bold themed-btn disabled:opacity-50"
                style={{
                  backgroundColor: t.accent,
                  color: t.textOnAccent,
                  borderRadius: t.btnRadius,
                }}
              >
                {isGenerating ? (
                  <span className="w-4 h-4 rounded-full animate-spin" style={{ border: `2px solid ${t.textOnAccent}30`, borderTopColor: t.textOnAccent }}></span>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                )}
                Generate
              </button>
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════════════════════
            DASHBOARD TAB
            ═══════════════════════════════════════════════════ */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            
            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              
              {/* Total Applications */}
              <div className="themed-card p-6" style={cardStyle}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2 font-medium text-[13px]" style={{ color: t.textMuted }}>
                    <Icons.Eye className="w-4 h-4" />
                    Total Apps
                  </div>
                  <Icons.Eye className="w-3.5 h-3.5" style={{ color: t.isDark ? t.border : '#CBD5E1' }} />
                </div>
                <div className="flex items-baseline gap-3">
                  <h3 className="text-[32px] font-bold tracking-tight leading-none" style={{ color: t.textHeading, fontFeatureSettings: '"tnum"' }}>{totalApps}</h3>
                  <span
                    className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[11px] font-bold"
                    style={{ backgroundColor: t.successSoft, color: t.success }}
                  >
                    +15.8% <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7h-10M17 7v10" /></svg>
                  </span>
                </div>
              </div>

              {/* Pending Review */}
              <div className="themed-card p-6" style={cardStyle}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2 font-medium text-[13px]" style={{ color: t.textMuted }}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Pending Review
                  </div>
                </div>
                <div className="flex items-baseline gap-3">
                  <h3 className="text-[32px] font-bold tracking-tight leading-none" style={{ color: t.textHeading, fontFeatureSettings: '"tnum"' }}>{pendingCount}</h3>
                  <span
                    className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[11px] font-bold"
                    style={{ backgroundColor: t.pendingSoft, color: t.pending }}
                  >
                    Queue <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                  </span>
                </div>
              </div>

              {/* Approved */}
              <div className="themed-card p-6" style={cardStyle}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2 font-medium text-[13px]" style={{ color: t.textMuted }}>
                    <Icons.CheckCircle className="w-4 h-4" />
                    Approved
                  </div>
                </div>
                <div className="flex items-baseline gap-3">
                  <h3 className="text-[32px] font-bold tracking-tight leading-none" style={{ color: t.textHeading, fontFeatureSettings: '"tnum"' }}>{approvedCount}</h3>
                  <span
                    className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[11px] font-bold"
                    style={{ backgroundColor: t.accentSoft, color: t.accent }}
                  >
                    Steady <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" /></svg>
                  </span>
                </div>
              </div>

              {/* Codes Claimed */}
              <div className="themed-card p-6" style={cardStyle}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2 font-medium text-[13px]" style={{ color: t.textMuted }}>
                    <Icons.Key className="w-4 h-4" />
                    Codes Claimed
                  </div>
                </div>
                <div className="flex items-baseline gap-3">
                  <h3 className="text-[32px] font-bold tracking-tight leading-none" style={{ color: t.textHeading, fontFeatureSettings: '"tnum"' }}>{claimedCodes}</h3>
                  <span
                    className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[11px] font-bold"
                    style={{ backgroundColor: t.infoSoft, color: t.info }}
                  >
                    {claimVelocity} / 24h
                  </span>
                </div>
              </div>
            </div>

            {/* Main Visualizations Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Room Mix Distribution */}
              <div className="themed-card p-6 lg:col-span-2 flex flex-col" style={cardStyle}>
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2 font-bold text-sm" style={{ color: t.textHeading }}>
                    <svg className="w-4 h-4" style={{ color: t.textMuted }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                    Room Mix Distribution
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-end min-h-[220px]">
                  <div className="flex items-end justify-around h-[180px] w-full px-4 gap-4">
                    {Object.keys(roomMix).length > 0 ? (
                      Object.entries(roomMix).map(([cat, count]: [string, any], idx) => {
                        const pct = totalApps > 0 ? Math.round((count / totalApps) * 100) : 0;
                        const barColor = t.barColors[idx % t.barColors.length];
                        return (
                          <div key={cat} className="flex flex-col items-center gap-3 w-16 group">
                            <span className="text-xs font-bold" style={{ color: t.textBody, fontFeatureSettings: '"tnum"' }}>{count}</span>
                            <div 
                              className="w-full rounded-t-lg transition-all duration-700 ease-out"
                              style={{ 
                                height: `${Math.max(pct, 10)}%`,
                                backgroundColor: barColor,
                                opacity: 0.85,
                              }}
                            ></div>
                            <span
                              className="text-[11px] font-medium whitespace-nowrap overflow-hidden text-ellipsis w-20 text-center"
                              style={{ color: t.textMuted }}
                            >
                              {cat}
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <div className="w-full flex items-center justify-center text-sm h-full" style={{ color: t.textMuted }}>No data yet</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Acceptance Rate Ring */}
              <div className="themed-card p-6 flex flex-col justify-between" style={cardStyle}>
                <div className="flex items-center gap-2 font-bold text-sm mb-4" style={{ color: t.textHeading }}>
                  <svg className="w-4 h-4" style={{ color: t.textMuted }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                  Acceptance Rate
                </div>
                <div className="flex-1 flex flex-col items-center justify-center relative">
                  <div className="relative w-40 h-40 shrink-0 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        strokeWidth="4"
                        stroke={t.ringTrack}
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        strokeWidth="4"
                        strokeDasharray={`${acceptanceRate}, 100`}
                        strokeLinecap="round"
                        stroke={t.ringColor}
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        style={{ transition: 'stroke 0.4s ease, stroke-dasharray 1s ease-out' }}
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold tracking-tight" style={{ color: t.textHeading, fontFeatureSettings: '"tnum"' }}>{acceptanceRate}%</span>
                      <span className="text-[10px] uppercase tracking-wider font-semibold mt-1" style={{ color: t.textMuted }}>Approved</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════
            APPLICATIONS & CODES TABLES
            ═══════════════════════════════════════════════════ */}
        {activeTab !== 'dashboard' && (
          <div
            className="overflow-hidden flex flex-col"
            style={{
              backgroundColor: t.bgCard,
              borderRadius: t.cardRadius,
              boxShadow: t.cardShadow,
              border: `1px solid ${t.border}`,
              transition: 'background-color 0.4s ease, box-shadow 0.33s ease, border-color 0.33s ease',
            }}
          >
            
            {/* Table Header & Controls */}
            <div
              className="p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4"
              style={{
                backgroundColor: t.bgCard,
                borderBottom: `1px solid ${t.border}`,
              }}
            >
              <h2 className="text-[15px] font-bold flex items-center gap-2" style={{ color: t.textHeading }}>
                <Icons.Filter className="w-4 h-4" style={{ color: t.textMuted }} />
                {activeTab === 'applications' ? 'All Applicants' : 'Invitation List'}
              </h2>
              
              <div className="flex flex-wrap items-center gap-3">
                {activeTab === 'applications' && (
                  <>
                    <button
                      onClick={exportPDF}
                      className="px-4 py-2 rounded-xl text-sm font-bold themed-btn flex items-center gap-2"
                      style={{ backgroundColor: t.accent, color: t.textOnAccent }}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Export PDF
                    </button>
                    <div className="relative">
                      <Icons.Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: t.textMuted }} />
                      <input 
                        type="text" 
                        placeholder="Search..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 pr-4 py-2 rounded-xl text-sm font-medium focus:outline-none w-48"
                        style={{
                          backgroundColor: t.bgInput,
                          border: `1px solid ${t.border}`,
                          color: t.textHeading,
                          borderRadius: t.btnRadius,
                        }}
                      />
                    </div>
                    <div className="relative">
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="pl-4 pr-9 py-2 rounded-xl text-sm font-medium focus:outline-none cursor-pointer appearance-none"
                        style={{
                          backgroundColor: t.bgInput,
                          border: `1px solid ${t.border}`,
                          color: t.textBody,
                          borderRadius: t.btnRadius,
                        }}
                      >
                        <option value="All">All Statuses</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Accepted">Approved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                      <svg className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ color: t.textMuted }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="h-64 flex flex-col items-center justify-center gap-3" style={{ backgroundColor: t.isDark ? 'transparent' : 'rgba(248,250,252,0.3)' }}>
                <span className="w-6 h-6 rounded-full animate-spin" style={{ border: `2px solid ${t.spinnerTrack}`, borderTopColor: t.spinnerHead }}></span>
                <p className="text-xs font-semibold uppercase tracking-widest animate-pulse" style={{ color: t.textMuted }}>Syncing Data</p>
              </div>
            ) : activeTab === 'applications' ? (
              
              /* ── Applications Table ── */
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead style={{ backgroundColor: t.bgTableHead, borderBottom: `1px solid ${t.border}` }}>
                    <tr>
                      <th className="px-6 py-4 font-semibold text-[11px] uppercase tracking-wider" style={{ color: t.textMuted }}>Applicant Info</th>
                      <th className="px-6 py-4 font-semibold text-[11px] uppercase tracking-wider" style={{ color: t.textMuted }}>Role & Company</th>
                      <th className="px-6 py-4 font-semibold text-[11px] uppercase tracking-wider" style={{ color: t.textMuted }}>Category</th>
                      <th className="px-6 py-4 font-semibold text-[11px] uppercase tracking-wider" style={{ color: t.textMuted }}>Status</th>
                      <th className="px-6 py-4 font-semibold text-[11px] uppercase tracking-wider text-right" style={{ color: t.textMuted }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAppsList.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-16 text-center">
                          <p className="font-medium text-sm" style={{ color: t.textMuted }}>No applications found.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredAppsList.map((app) => {
                        const initials = `${(app.first_name?.[0] || "").toUpperCase()}${(app.last_name?.[0] || "").toUpperCase()}`;
                        return (
                          <tr 
                            key={app.id} 
                            onClick={() => setSelectedApplicant(app)}
                            className="themed-row cursor-pointer group"
                            style={{ borderBottom: `1px solid ${t.isDark ? t.border : t.borderSubtle}` }}
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div style={getAvatarInlineStyle(app.first_name || "", app.last_name || "")}>{initials || "??"}</div>
                                <div>
                                  <div className="font-bold text-[14px]" style={{ color: t.textHeading }}>{app.first_name} {app.last_name}</div>
                                  <div className="text-xs font-medium mt-0.5" style={{ color: t.textMuted }}>{app.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-[13px] font-bold" style={{ color: t.textHeading }}>{app.current_role || "No Role"}</div>
                              <div className="text-[12px] font-medium mt-0.5" style={{ color: t.textMuted }}>{app.company || app.university}</div>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className="text-[11px] font-bold px-2.5 py-1 rounded-md"
                                style={{
                                  backgroundColor: t.isDark ? t.border : (t.bgTableHead || '#F1F5F9'),
                                  color: t.textBody,
                                }}
                              >
                                {app.category}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider"
                                style={statusBadge(app.status)}
                              >
                                {app.status === 'Accepted' ? 'Approved' : app.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end items-center gap-3">
                                {app.status !== 'Under Review' && (
                                  <span className="text-[11px] font-medium italic mt-0.5" style={{ color: t.textMuted }}>Reviewed</span>
                                )}
                                <div className="relative">
                                  <button
                                    onClick={(e) => { e.stopPropagation(); setOpenDropdownId(openDropdownId === app.id ? null : app.id); }}
                                    className="p-1.5 rounded-lg themed-sidebar-item"
                                    style={{
                                      backgroundColor: openDropdownId === app.id ? (t.isDark ? t.border : '#F1F5F9') : 'transparent',
                                      color: openDropdownId === app.id ? t.textHeading : t.textMuted,
                                    }}
                                  >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                                  </button>
                                  <AnimatePresence>
                                    {openDropdownId === app.id && (
                                      <>
                                        <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setOpenDropdownId(null); }} />
                                        <motion.div
                                          initial={{ opacity: 0, y: -5, scale: 0.95 }}
                                          animate={{ opacity: 1, y: 0, scale: 1 }}
                                          exit={{ opacity: 0, y: -5, scale: 0.95 }}
                                          className="absolute right-0 top-full mt-1 w-36 z-50 py-1.5 overflow-hidden"
                                          style={{
                                            backgroundColor: t.bgCard,
                                            border: `1px solid ${t.border}`,
                                            borderRadius: t.btnRadius,
                                            boxShadow: t.isDark ? '0 8px 30px rgba(0,0,0,0.4)' : '0 8px 30px rgb(0 0 0 / 0.08)',
                                          }}
                                        >
                                          {app.status === 'Under Review' && (
                                            <>
                                              <button 
                                                onClick={(e) => { e.stopPropagation(); onApprove(app.id); setOpenDropdownId(null); }}
                                                disabled={processingId !== null}
                                                className="w-full flex items-center gap-2 px-4 py-2 text-[13px] font-bold themed-sidebar-item"
                                                style={{ color: t.textHeading }}
                                              >
                                                Approve
                                              </button>
                                              <button 
                                                onClick={(e) => { e.stopPropagation(); onDecline(app.id); setOpenDropdownId(null); }}
                                                disabled={processingId !== null}
                                                className="w-full flex items-center gap-2 px-4 py-2 text-[13px] font-bold themed-sidebar-item"
                                                style={{ color: t.textHeading }}
                                              >
                                                Decline
                                              </button>
                                              <div className="h-px my-1" style={{ backgroundColor: t.border }}></div>
                                            </>
                                          )}
                                          <button 
                                            onClick={(e) => { e.stopPropagation(); onDeleteApplication(app.id); setOpenDropdownId(null); }}
                                            disabled={processingId !== null}
                                            className="w-full flex items-center gap-2 px-4 py-2 text-[13px] font-bold themed-sidebar-item"
                                            style={{ color: t.danger }}
                                          >
                                            Delete
                                          </button>
                                        </motion.div>
                                      </>
                                    )}
                                  </AnimatePresence>
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

            ) : (

              /* ── Invite Codes Table ── */
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead style={{ backgroundColor: t.bgTableHead, borderBottom: `1px solid ${t.border}` }}>
                    <tr>
                      <th className="px-6 py-4 font-semibold text-[11px] uppercase tracking-wider" style={{ color: t.textMuted }}>Invite Code</th>
                      <th className="px-6 py-4 font-semibold text-[11px] uppercase tracking-wider" style={{ color: t.textMuted }}>Category</th>
                      <th className="px-6 py-4 font-semibold text-[11px] uppercase tracking-wider" style={{ color: t.textMuted }}>Status</th>
                      <th className="px-6 py-4 font-semibold text-[11px] uppercase tracking-wider" style={{ color: t.textMuted }}>Claimed By</th>
                      <th className="px-6 py-4 font-semibold text-[11px] uppercase tracking-wider text-right" style={{ color: t.textMuted }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {safeCodes.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-16 text-center font-medium text-sm" style={{ color: t.textMuted }}>No codes generated yet.</td>
                      </tr>
                    ) : (
                      safeCodes.map((item) => (
                        <tr
                          key={item.id}
                          className="themed-row"
                          style={{ borderBottom: `1px solid ${t.isDark ? t.border : t.borderSubtle}` }}
                        >
                          <td className="px-6 py-4 font-mono font-bold text-[13px]" style={{ color: t.textHeading }}>
                            <div className="flex items-center gap-2 group">
                              <span>{item.code}</span>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleCopyCode(item.code, item.id); }}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md themed-sidebar-item"
                                style={{ color: t.textMuted }}
                                title="Copy Code"
                              >
                                {copiedCodeId === item.id ? (
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={t.success} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                ) : (
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                                )}
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-[13px] font-bold" style={{ color: t.textBody }}>{item.category}</td>
                          <td className="px-6 py-4">
                            <span
                              className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider"
                              style={statusBadge(item.status)}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-[13px] font-medium" style={{ color: t.textMuted }}>
                            {item.claimed_by_email || <span style={{ color: t.isDark ? t.border : '#CBD5E1' }}>-</span>}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              {item.status !== 'Claimed' && (
                                <button
                                  onClick={(e) => { e.stopPropagation(); onToggleCode(item.id, item.status); }}
                                  disabled={processingId !== null}
                                  className="px-3 py-1.5 text-xs font-bold themed-btn disabled:opacity-50"
                                  style={{
                                    backgroundColor: item.status === 'Active' ? t.dangerSoft : t.accentSoft,
                                    color: item.status === 'Active' ? t.danger : t.accent,
                                    borderRadius: t.btnRadius,
                                  }}
                                >
                                  {processingId === item.id ? "..." : item.status === 'Active' ? "Deactivate" : "Activate"}
                                </button>
                              )}
                              <button
                                onClick={(e) => { e.stopPropagation(); onDeleteCode(item.id); }}
                                disabled={processingId !== null}
                                className="px-3 py-1.5 text-xs font-bold themed-btn disabled:opacity-50"
                                style={{
                                  backgroundColor: 'transparent',
                                  color: t.danger,
                                  border: `1px solid ${t.isDark ? t.danger + '40' : t.danger + '30'}`,
                                  borderRadius: t.btnRadius,
                                }}
                              >
                                Delete
                              </button>
                            </div>
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

        {/* ═══════════════════════════════════════════════════
            DRAWER (SIDE PANEL)
            ═══════════════════════════════════════════════════ */}
        <AnimatePresence>
          {selectedApplicant && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedApplicant(null)}
                className="fixed inset-0 z-[100]"
                style={{ backgroundColor: t.isDark ? 'rgba(0,0,0,0.6)' : 'rgba(15,23,42,0.2)', backdropFilter: 'blur(4px)' }}
              />

              {/* Drawer Panel */}
              <motion.div
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "100%", opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed top-0 bottom-0 right-0 w-full max-w-xl z-[101] flex flex-col overflow-hidden"
                style={{
                  backgroundColor: t.bgCard,
                  boxShadow: t.isDark ? '-8px 0 40px rgba(0,0,0,0.5)' : '-8px 0 40px rgba(0,0,0,0.08)',
                  borderLeft: `1px solid ${t.border}`,
                }}
              >
                {/* Header */}
                <div
                  className="p-6 flex items-start justify-between shrink-0"
                  style={{
                    backgroundColor: t.bgDrawerHead,
                    borderBottom: `1px solid ${t.border}`,
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div style={getAvatarInlineStyle(selectedApplicant.first_name || "", selectedApplicant.last_name || "", 'lg')}>
                      {`${(selectedApplicant.first_name?.[0] || "").toUpperCase()}${(selectedApplicant.last_name?.[0] || "").toUpperCase()}` || "??"}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold" style={{ color: t.textHeading }}>{selectedApplicant.first_name} {selectedApplicant.last_name}</h2>
                      <p className="text-sm font-medium mb-1.5" style={{ color: t.textMuted }}>{selectedApplicant.email}</p>
                      <span
                        className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider"
                        style={statusBadge(selectedApplicant.status)}
                      >
                        {selectedApplicant.status === 'Accepted' ? 'Approved' : selectedApplicant.status}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedApplicant(null)}
                    className="p-2 rounded-full themed-sidebar-item"
                    style={{ color: t.textMuted }}
                  >
                    <Icons.XCircle className="w-6 h-6" />
                  </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8" style={{ backgroundColor: t.bgCard }}>
                  
                  {/* Quick Info Grid */}
                  <div
                    className="grid grid-cols-2 gap-y-6 gap-x-4 p-5 rounded-2xl"
                    style={{
                      backgroundColor: t.bgInfoGrid,
                      border: `1px solid ${t.borderSubtle}`,
                      borderRadius: t.cardRadius,
                    }}
                  >
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: t.textMuted }}>Role</span>
                      <span className="text-sm font-bold" style={{ color: t.textHeading }}>{selectedApplicant.current_role || "N/A"}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: t.textMuted }}>Company / Uni</span>
                      <span className="text-sm font-bold" style={{ color: t.textHeading }}>{selectedApplicant.company || selectedApplicant.university || "N/A"}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: t.textMuted }}>Category</span>
                      <span className="text-sm font-bold" style={{ color: t.textHeading }}>{selectedApplicant.category || "N/A"}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: t.textMuted }}>Social</span>
                      <span className="text-sm font-bold break-all" style={{ color: t.accent }}>
                        {selectedApplicant.social_platform ? `${selectedApplicant.social_platform}: ` : ''}
                        {selectedApplicant.social_handle || "N/A"}
                      </span>
                    </div>
                  </div>

                  {/* Q&A Section */}
                  <div>
                    <h3
                      className="text-sm font-bold flex items-center gap-2 mb-6 pb-3"
                      style={{ color: t.textHeading, borderBottom: `1px solid ${t.border}` }}
                    >
                      <svg className="w-4 h-4" style={{ color: t.accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
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
                          <p className="text-[13px] font-bold mb-2 leading-snug" style={{ color: t.textMuted }}>{item.q}</p>
                          <div
                            className="text-[15px] leading-relaxed font-medium whitespace-pre-wrap pl-4"
                            style={{
                              color: t.textHeading,
                              borderLeft: `2px solid ${t.border}`,
                            }}
                          >
                            {item.a || <span style={{ color: t.textMuted, fontStyle: 'italic' }}>No answer provided.</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Footer */}
                {selectedApplicant.status === 'Under Review' && (
                  <div className="p-5 flex gap-3 shrink-0" style={{ backgroundColor: t.bgCard, borderTop: `1px solid ${t.border}` }}>
                    <button 
                      onClick={() => {
                        onDecline(selectedApplicant.id);
                        setSelectedApplicant(null);
                      }}
                      disabled={processingId !== null}
                      className="flex-1 py-3 text-sm font-bold themed-btn disabled:opacity-50"
                      style={{
                        border: `2px solid ${t.border}`,
                        borderRadius: t.btnRadius,
                        color: t.textBody,
                        backgroundColor: 'transparent',
                      }}
                    >
                      Decline Profile
                    </button>
                    <button 
                      onClick={() => {
                        onApprove(selectedApplicant.id);
                        setSelectedApplicant(null);
                      }}
                      disabled={processingId !== null}
                      className="flex-1 py-3 text-sm font-bold themed-btn disabled:opacity-50"
                      style={{
                        backgroundColor: t.accent,
                        color: t.textOnAccent,
                        borderRadius: t.btnRadius,
                        boxShadow: `0 4px 14px ${t.accent}40`,
                      }}
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
