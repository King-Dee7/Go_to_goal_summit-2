"use client";

import { useState, type InputHTMLAttributes, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { submitApplication } from "@/app/actions/submit-application";
import { claimInviteCode } from "@/app/actions/invite-actions";

export default function ApplyClient() {
  const [activeTab, setActiveTab] = useState<"gateway" | "apply" | "invite" | "virtual">("gateway");

  return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-8 font-sans relative overflow-hidden" style={{ backgroundColor: "#0A1118" }}>
      {/* Background ambient glow */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full blur-[120px] opacity-60" style={{ backgroundColor: "#0f2e3d" }} />
        <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full blur-[120px] opacity-80" style={{ backgroundColor: "#0b202a" }} />
      </div>

      {/* DESIGN INSPO: Outer Corner Accents */}
      {/* Red Polygon - Top Right */}
      <div 
        className="absolute -top-12 -right-12 w-80 h-80 opacity-90 z-0" 
        style={{ 
          backgroundColor: "#af2122", 
          clipPath: "polygon(100% 0, 0 0, 100% 100%)",
          borderRadius: "0 0 0 100%"
        }} 
      />
      
      {/* Yellow Circle - Bottom Left */}
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="absolute -bottom-16 -left-16 w-80 h-80 rounded-full z-0 shadow-2xl" 
        style={{ backgroundColor: "#eac20a" }} 
      />

      {/* Floating Background Shapes */}
      <motion.div 
        animate={{ y: [0, -20, 0], rotate: [45, 60, 45] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[20%] left-[15%] w-8 h-8 rotate-45 border-2 border-white/5 z-0" 
      />
      <motion.div 
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[35%] right-[22%] w-12 h-12 rounded-full border-2 border-white/5 z-0" 
      />
      <motion.div 
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[65%] left-[12%] w-6 h-6 rotate-12 bg-white/5 rounded-sm z-0" 
      />
      <div className="absolute top-[15%] right-[30%] w-4 h-4 rounded-full bg-white/10 z-0" />
      <div className="absolute bottom-[10%] left-[35%] w-10 h-10 border border-white/5 rotate-45 z-0" />

      <Link 
        href="/" 
        className="absolute top-6 right-6 md:top-8 md:right-8 flex items-center justify-center z-50 w-12 h-12 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 group"
        style={{ 
          backgroundColor: "#000000", 
          color: "#ffffff",
          boxShadow: "0 4px 24px rgba(0,0,0,0.15)"
        }}
        aria-label="Back to Site"
      >
        <svg className="w-5 h-5 opacity-80 transition-transform duration-300 group-hover:-translate-x-1 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </Link>

      <div className="w-full max-w-6xl rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-[0_40px_100px_rgba(0,0,0,0.7)] relative z-10 min-h-[650px]" style={{ backgroundColor: "#ffffff" }}>

        {/* LEFT PANEL - PICTURE SIDE */}
        <div className="relative w-full md:w-[45%] h-48 md:h-auto p-8 md:p-12 flex flex-col justify-end overflow-hidden">
          <Image
            src="/Hero_image.png"
            alt="From Go To Goal Summit"
            fill
            className="object-cover object-center absolute inset-0 z-0"
            priority={true}
          />
          <div className="absolute inset-0 z-0" style={{ background: "linear-gradient(to top, rgba(5,11,20,1) 0%, rgba(5,11,20,0.8) 40%, rgba(5,11,20,0.3) 100%)" }} />

          <div className="relative z-10 mt-auto">
            <div className="mb-4 md:mb-6">
              <div className="w-10 md:w-12 h-1 bg-white/40 mb-3 md:mb-4" />
              <h1 className="text-xl md:text-3xl font-bold mb-2 md:mb-4 tracking-tight leading-[1.1]" style={{ color: "#ffffff", fontFamily: "var(--font-syne), sans-serif" }}>
                Attendance by<br />Invitation or Application
              </h1>
            </div>
            <p className="text-sm md:text-base leading-relaxed max-w-sm opacity-90 hidden sm:block" style={{ color: "#ffffff" }}>
              To ensure meaningful connections and a high-caliber environment, attendance to the From Go To Goal Summit is carefully curated.
            </p>
          </div>
        </div>

        {/* RIGHT PANEL - Content/Form Side */}
        <div className="w-full md:w-[55%] p-6 relative flex flex-col justify-center" style={{ backgroundColor: "#ffffff" }}>
          <AnimatePresence mode="wait">
            {activeTab === "gateway" && (
              <GatewayView key="gateway" onSelect={setActiveTab} />
            )}
            {activeTab === "apply" && (
              <ApplicationForm key="apply" onBack={() => setActiveTab("gateway")} />
            )}
            {activeTab === "virtual" && (
              <ApplicationForm key="virtual" isVirtual={true} onBack={() => setActiveTab("gateway")} />
            )}
            {activeTab === "invite" && (
              <InviteForm key="invite" onBack={() => setActiveTab("gateway")} />
            )}
          </AnimatePresence>
        </div>

      </div>
    </main>
  );
}

function GatewayView({ onSelect }: { onSelect: (tab: "apply" | "invite" | "virtual") => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
      className="flex-1 flex flex-col justify-center"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2" style={{ color: "#111827" }}>Welcome</h2>
        <p className="text-sm md:text-base font-semibold" style={{ color: "#111827" }}>Choose your application path below.</p>
        <p className="text-xs md:text-sm mt-1" style={{ color: "#4b5563" }}>Select the option that best applies to you.</p>
      </div>

      <div className="space-y-4 max-w-[420px] mx-auto w-full">
        <button
          onClick={() => onSelect("virtual")}
          className="w-full p-6 rounded-2xl border transition-all hover:bg-[#8f1b1c]/95 hover:shadow-md flex flex-col items-center justify-center text-center focus:outline-none shadow-sm"
          style={{ backgroundColor: "#af2122", borderColor: "#af2122" }}
        >
          <h3 className="text-lg font-bold mb-1" style={{ color: "#ffffff" }}>Register for Virtual Access</h3>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.8)" }}>Join the global community online.</p>
        </button>

        <button
          onClick={() => onSelect("apply")}
          className="w-full p-6 rounded-2xl border transition-all hover:bg-[#8f1b1c]/95 hover:shadow-md flex flex-col items-center justify-center text-center focus:outline-none shadow-sm"
          style={{ backgroundColor: "#af2122", borderColor: "#af2122" }}
        >
          <h3 className="text-lg font-bold mb-1" style={{ color: "#ffffff" }}>Apply to Attend</h3>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.8)" }}>Submit your profile for review.</p>
        </button>

        <button
          onClick={() => onSelect("invite")}
          className="w-full p-6 rounded-2xl border transition-all hover:bg-[#8f1b1c]/95 hover:shadow-md flex flex-col items-center justify-center text-center focus:outline-none shadow-sm"
          style={{ backgroundColor: "#af2122", borderColor: "#af2122" }}
        >
          <h3 className="text-lg font-bold mb-1" style={{ color: "#ffffff" }}>I have an Invite Code</h3>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.8)" }}>Bypass the application process.</p>
        </button>
      </div>
    </motion.div>
  );
}

function ApplicationForm({ onBack, isVirtual = false }: { onBack: () => void, isVirtual?: boolean }) {
  const [step, setStep] = useState(1);
  const maxStep = isVirtual ? 2 : 7;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", phone: "", socialPlatform: "LinkedIn", socialHandle: "", role: "", company: "", category: "",
    university: "", fieldOfStudy: "",
    q1: "", q2: "", q3: "", q4: "", q5: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateStep = () => {
    setError(null);
    if (step === 1) {
      if (!formData.firstName.trim() || !formData.lastName.trim()) {
        setError("First and last name are required.");
        return false;
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError("Please enter a valid email address.");
        return false;
      }

      if (formData.phone) {
        const phoneDigits = formData.phone.replace(/[\s\-\(\)\+]/g, '');
        if (phoneDigits.length < 7 || phoneDigits.length > 15 || !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
          setError("Please enter a valid phone number.");
          return false;
        }
      }

      const handle = formData.socialHandle.trim();
      const platform = formData.socialPlatform;
      
      if (!handle) {
        setError("Please provide a profile link or handle.");
        return false;
      }

      const isValidUrl = (url: string) => /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(url);
      const isHandle = (h: string) => h.startsWith('@');
      const hLower = handle.toLowerCase();

      if (platform === "LinkedIn") {
        if (!hLower.includes("linkedin.com/")) {
          setError("Please enter a valid LinkedIn URL (e.g., linkedin.com/in/username).");
          return false;
        }
      } else if (platform === "Instagram") {
        if (!hLower.includes("instagram.com/") && !isHandle(handle)) {
          setError("Please enter a valid Instagram URL or a handle starting with @.");
          return false;
        }
      } else if (platform === "TikTok") {
        if (!hLower.includes("tiktok.com/") && !isHandle(handle)) {
          setError("Please enter a valid TikTok URL or a handle starting with @.");
          return false;
        }
      } else if (platform === "X (Twitter)") {
        if (!hLower.includes("twitter.com/") && !hLower.includes("x.com/") && !isHandle(handle)) {
          setError("Please enter a valid X (Twitter) URL or a handle starting with @.");
          return false;
        }
      } else if (platform === "Facebook") {
         if (!hLower.includes("facebook.com/")) {
          setError("Please enter a valid Facebook URL.");
          return false;
        }
      } else {
        if (!isValidUrl(handle) && !isHandle(handle)) {
           setError("Please enter a valid URL or a handle starting with @.");
           return false;
        }
      }
    }
    
    if (step === 2) {
      if (!formData.category) {
        setError("Please select a category.");
        return false;
      }
    }

    return true;
  };

  const handleNext = () => setStep((s) => Math.min(s + 1, maxStep));
  const handlePrev = () => {
    setError(null);
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;

    if (step < maxStep) {
      handleNext();
      return;
    }
    setIsSubmitting(true);
    
    try {
      const result = await submitApplication({ ...formData, isVirtual });
      if (result.success) {
        setIsSuccess(true);
      } else {
        setError(result.error || "Submission failed. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      console.error("Submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col justify-center text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: "#16A34A" }}>
          <svg className="w-8 h-8" style={{ color: "#ffffff" }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h2 className="text-3xl font-bold mb-4" style={{ color: "#111827" }}>
          {isVirtual ? "Virtual Spot Secured" : "Application Received"}
        </h2>
        <p className="text-sm max-w-sm mx-auto mb-8 leading-relaxed" style={{ color: "#6b7280" }}>
          {isVirtual 
            ? "Your virtual attendance is confirmed. You will receive an email shortly with streaming details."
            : "Thank you for applying. Your profile is now under review by our curation committee. We will notify you via email regarding your status."}
        </p>
        <Link href="/" className="inline-block px-8 py-3.5 font-semibold rounded-lg hover:bg-[#15803D] hover:shadow-md transition-all text-sm shadow-sm" style={{ backgroundColor: "#16A34A", color: "#ffffff" }}>
          Return to Website
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }} className="flex flex-col h-full">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-5">
          <button onClick={onBack} className="p-2 -ml-2 rounded-2xl transition-colors focus:outline-none" style={{ color: "#9ca3af" }} onMouseEnter={(e) => (e.currentTarget.style.color = "#111827")} onMouseLeave={(e) => (e.currentTarget.style.color = "#9ca3af")}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <h2 className="text-xl font-bold" style={{ color: "#111827" }}>{isVirtual ? "Virtual Registration" : "Application"}</h2>
        </div>
        
      {/* Progress Bar */}
        <div className="w-full h-1 rounded-full overflow-hidden" style={{ backgroundColor: "#f3f4f6" }}>
          <motion.div 
            className="h-full rounded-full"
            style={{ backgroundColor: "#000000" }}
            initial={{ width: `${(1 / maxStep) * 100}%` }}
            animate={{ width: `${(step / maxStep) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        {step === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5 flex-1 flex flex-col justify-center">
            {!isVirtual && (
              <div className="p-4 rounded-2xl border mb-2" style={{ backgroundColor: "#f9fafb", borderColor: "#f3f4f6" }}>
                <p className="text-base leading-relaxed" style={{ color: "#6b7280" }}>
                  <span className="block mb-1" style={{ color: "#111827" }}>A note on curation:</span>
                  Please answer the upcoming questions as honestly as possible. There are no right or wrong answers, only your genuine journey, ambitions, and personal reflections.
                </p>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="First name" name="firstName" value={formData.firstName} onChange={handleChange} icon={<UserIcon />} required />
              <Input label="Last name" name="lastName" value={formData.lastName} onChange={handleChange} icon={<UserIcon />} required />
            </div>
            <Input label="Email address" type="email" name="email" value={formData.email} onChange={handleChange} icon={<MailIcon />} required />
            <Input label="Phone number" type="tel" name="phone" value={formData.phone} onChange={handleChange} icon={<PhoneIcon />} placeholder="+1 (555) 000-0000" required />
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "#111827" }}>Platform</label>
                <div className="relative group">
                  <select name="socialPlatform" value={formData.socialPlatform} onChange={handleChange} className="w-full border rounded-2xl px-4 py-3.5 text-base focus:outline-none transition-all duration-300 focus:ring-1 focus:ring-slate-900 focus:border-slate-900 appearance-none" style={{ backgroundColor: "#ffffff", borderColor: "#e5e7eb", color: "#111827" }} required>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Instagram">Instagram</option>
                    <option value="X (Twitter)">X (Twitter)</option>
                    <option value="TikTok">TikTok</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <Input label="Profile Link / Handle" type="text" name="socialHandle" value={formData.socialHandle} onChange={handleChange} icon={<LinkIcon />} placeholder="e.g. @username or https://..." required />
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 flex-1 flex flex-col justify-center">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#111827" }}>Which category best describes you?</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full border rounded-2xl px-4 py-3.5 text-base focus:outline-none transition-all duration-300 focus:ring-1 focus:ring-slate-900 focus:border-slate-900 appearance-none" style={{ backgroundColor: "#ffffff", borderColor: "#e5e7eb", color: "#111827" }} required>
                <option value="" disabled>Select one...</option>
                <option value="Student">Student</option>
                <option value="Young Professional">Young Professional</option>
                <option value="Founder / Entrepreneur">Founder / Entrepreneur</option>
                <option value="Creative">Creative</option>
              </select>
            </div>
            
            {formData.category && formData.category !== "Student" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Current role" name="role" value={formData.role} onChange={handleChange} placeholder="E.g. Founder" required />
                <Input label="Company" name="company" value={formData.company} onChange={handleChange} placeholder="E.g. Acme Corp" required />
              </motion.div>
            )}
            
            {formData.category === "Student" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="University / Institution" name="university" value={formData.university} onChange={handleChange} placeholder="E.g. Stanford" required />
                <Input label="Field of study" name="fieldOfStudy" value={formData.fieldOfStudy} onChange={handleChange} placeholder="E.g. Computer Science" required />
              </motion.div>
            )}
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col h-full">
            <ConversationalQuestion question="What are you currently building or passionate about?" name="q1" value={formData.q1} onChange={handleChange} />
          </motion.div>
        )}

        {step === 4 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col h-full">
            <ConversationalQuestion question="What's something you should do differently but haven't yet and why?" name="q2" value={formData.q2} onChange={handleChange} />
          </motion.div>
        )}

        {step === 5 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col h-full">
            <ConversationalQuestion question="What are you trying to build or become in the next few years?" name="q3" value={formData.q3} onChange={handleChange} />
          </motion.div>
        )}

        {step === 6 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col h-full">
            <ConversationalQuestion question="Why are you applying and what are your intentions after the summit?" name="q4" value={formData.q4} onChange={handleChange} />
          </motion.div>
        )}

        {step === 7 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col h-full">
            <ConversationalQuestion question="What's a belief you held strongly that you've since changed?" name="q5" value={formData.q5} onChange={handleChange} />
          </motion.div>
        )}

        <div className="mt-auto pt-8 flex gap-3">
          {step > 1 && (
            <button type="button" onClick={handlePrev} className="px-8 py-4 rounded-lg border font-bold text-xs uppercase tracking-widest transition-all hover:bg-gray-50 hover:shadow-sm active:scale-95" style={{ borderColor: "#e5e7eb", color: "#4b5563", backgroundColor: "#ffffff" }}>
              Back
            </button>
          )}
          {error && (
            <div className="w-full p-3 bg-red-50 text-red-600 text-xs font-bold rounded-2xl border border-red-100 uppercase tracking-widest text-center mb-4">
              {error}
            </div>
          )}

          {step < maxStep ? (
            <button type="submit" className="flex-1 py-4 rounded-lg font-bold text-xs uppercase tracking-widest transition-all hover:bg-[#1a1a1a] hover:shadow-md active:scale-95 shadow-sm" style={{ backgroundColor: "#000000", color: "#ffffff" }}>
              Next Step
            </button>
          ) : (
            <button type="submit" disabled={isSubmitting} className="flex-1 py-4 rounded-lg font-bold text-xs uppercase tracking-widest transition-all hover:bg-[#1a1a1a] hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed active:scale-95 shadow-sm" style={{ backgroundColor: "#000000", color: "#ffffff" }}>
              {isSubmitting ? "Submitting..." : (isVirtual ? "Complete Registration" : "Submit Application")}
            </button>
          )}
        </div>
      </form>
    </motion.div>
  );
}

function InviteForm({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(1);
  const [code, setCode] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    company: "",
    category: "Invited Guest"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setIsChecking(true);
    setError("");
    
    try {
      const result = await claimInviteCode(code, userData);

      if (result.success) {
        setIsSuccess(true);
      } else {
        setError(result.error || "Invalid or already claimed invite code.");
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setIsChecking(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col justify-center text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: "#16A34A" }}>
          <svg className="w-8 h-8" style={{ color: "#ffffff" }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h2 className="text-3xl font-bold mb-4" style={{ color: "#111827" }}>Invitation Unlocked</h2>
        <p className="text-sm max-w-sm mx-auto mb-8 leading-relaxed" style={{ color: "#6b7280" }}>
          Welcome to the Summit, {userData.firstName}! Your invitation has been confirmed. You will receive an email shortly with your QR code and event details.
        </p>
        <Link href="/" className="inline-block px-8 py-3.5 font-semibold rounded-lg hover:bg-[#15803D] hover:shadow-md transition-all text-sm shadow-sm" style={{ backgroundColor: "#16A34A", color: "#ffffff" }}>
          Return to Website
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }} className="flex flex-col h-full">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 -ml-2 rounded-2xl transition-colors focus:outline-none" style={{ color: "#9ca3af" }} onMouseEnter={(e) => (e.currentTarget.style.color = "#111827")} onMouseLeave={(e) => (e.currentTarget.style.color = "#9ca3af")}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <h2 className="text-xl font-bold" style={{ color: "#111827" }}>{step === 1 ? "Guest Registration" : "Enter Invite Code"}</h2>
      </div>

      <div className="flex-1 flex flex-col justify-center max-w-[420px] mx-auto w-full">
        {step === 1 ? (
          <form onSubmit={handleNext} className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold" style={{ color: "#111827" }}>Guest Details</h2>
              <p className="text-xs" style={{ color: "#6b7280" }}>Please provide your information before entering your code.</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Input label="First Name" name="firstName" value={userData.firstName} onChange={handleChange} required />
              <Input label="Last Name" name="lastName" value={userData.lastName} onChange={handleChange} required />
            </div>
            <Input label="Email Address" type="email" name="email" value={userData.email} onChange={handleChange} required />
            <Input label="Phone (Optional)" type="tel" name="phone" value={userData.phone} onChange={handleChange} />
            
            <div className="grid grid-cols-2 gap-4">
              <Input label="Role" name="role" value={userData.role} onChange={handleChange} placeholder="e.g. CEO" required />
              <Input label="Company" name="company" value={userData.company} onChange={handleChange} placeholder="e.g. Acme Inc" required />
            </div>

            <button type="submit" className="w-full py-4 rounded-lg font-bold text-xs uppercase tracking-widest transition-all hover:bg-[#1a1a1a] hover:shadow-md active:scale-95 shadow-sm mt-4" style={{ backgroundColor: "#000000", color: "#ffffff" }}>
              Continue to Code
            </button>
          </form>
        ) : (
          <>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2" style={{ color: "#111827" }}>Access Code</h2>
              <p className="text-xs leading-relaxed max-w-[240px] mx-auto" style={{ color: "#6b7280" }}>Enter your unique invitation code to confirm your registration.</p>
            </div>

            <form onSubmit={handleClaim} className="space-y-5">
              <div>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="RAN-XXXX"
                  className="w-full border rounded-2xl px-4 py-5 text-center text-2xl font-mono focus:outline-none transition-all duration-300 focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 uppercase placeholder:normal-case placeholder:tracking-normal placeholder:font-sans placeholder:text-sm"
                  style={{ backgroundColor: "#f4f5f7", borderColor: "#f3f4f6", color: "#111827" }}
                  required
                  autoFocus
                />
              </div>
              {error && (
                <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-[10px] font-bold text-center uppercase tracking-widest" style={{ color: "#ef4444" }}>
                  {error}
                </motion.p>
              )}
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)} className="px-6 py-4 rounded-lg border font-bold text-xs uppercase tracking-widest transition-all hover:bg-gray-50 hover:shadow-sm" style={{ borderColor: "#e5e7eb", color: "#4b5563" }}>
                  Back
                </button>
                <button type="submit" disabled={isChecking} className="flex-1 py-4 rounded-lg font-bold text-xs uppercase tracking-widest transition-all hover:bg-[#1a1a1a] hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed active:scale-95 shadow-sm" style={{ backgroundColor: "#000000", color: "#ffffff" }}>
                  {isChecking ? "Verifying..." : "Confirm & Register"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </motion.div>
  );
}

// Reusable Input Components matched to the inspo
type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon?: ReactNode;
};

const ConversationalQuestion = ({ 
  question, 
  name, 
  value, 
  onChange 
}: { 
  question: string, 
  name: string, 
  value: string, 
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void 
}) => (
  <div className="flex-1 flex flex-col justify-center">
    <h3 className="text-xl md:text-3xl font-bold mb-6 md:mb-8 leading-tight" style={{ color: "#111827" }}>
      {question}
    </h3>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder="Type your answer here..."
      className="w-full text-base md:text-xl leading-relaxed resize-none bg-transparent focus:outline-none placeholder-gray-300"
      style={{ color: "#111827", minHeight: "200px" }}
      required
      autoFocus
    />
  </div>
);

const Input = ({ label, icon, ...props }: InputProps) => (
  <div>
    <label className="block text-sm font-medium mb-1.5" style={{ color: "#111827" }}>{label}</label>
    <div className="relative group">
      {icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-slate-900 transition-colors">
          {icon}
        </div>
      )}
      <input 
        className={`w-full border rounded-2xl ${icon ? 'pl-11' : 'px-4'} py-3.5 text-base focus:outline-none transition-all duration-300 focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900`} 
        style={{ backgroundColor: "#ffffff", borderColor: "#e5e7eb", color: "#111827" }} 
        {...props} 
      />
    </div>
  </div>
);

const UserIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
);

const MailIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
);

const LinkIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
);

const PhoneIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
);
