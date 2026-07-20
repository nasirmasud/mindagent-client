"use client";

import { GoogleAuthButton } from "@/components/auth/google-auth-button";
import { api } from "@/lib/api";
import { useAuthContext } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const IMAGEBB_KEY = process.env.NEXT_PUBLIC_IMAGEBB_API_KEY;

async function uploadToImageBB(base64: string): Promise<string> {
  if (!IMAGEBB_KEY) throw new Error("ImageBB API key is not configured");
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMAGEBB_KEY}`, {
    method: "POST",
    body: new URLSearchParams({ image: base64 }),
  });
  const data = await res.json();
  if (!data.success)
    throw new Error(data.error?.message || "Image upload failed");
  return data.data.url;
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthContext();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  // Login form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginErrors, setLoginErrors] = useState({
    email: false,
    password: false,
  });

  // Register form
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [regTerms, setRegTerms] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [regErrors, setRegErrors] = useState({
    name: false,
    email: false,
    password: false,
    confirm: false,
    terms: false,
  });
  const [regStrength, setRegStrength] = useState(0);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const loginTabRef = useRef<HTMLButtonElement>(null);
  const registerTabRef = useRef<HTMLButtonElement>(null);
  const registerPanelRef = useRef<HTMLDivElement>(null);
  const [underlineStyle, setUnderlineStyle] = useState({ width: 0, left: 0 });
  const [panelMinHeight, setPanelMinHeight] = useState(0);

  useEffect(() => {
    const tab =
      activeTab === "login" ? loginTabRef.current : registerTabRef.current;
    if (tab) {
      setUnderlineStyle({ width: tab.offsetWidth, left: tab.offsetLeft });
    }
  }, [activeTab]);

  useEffect(() => {
    if (registerPanelRef.current) {
      setPanelMinHeight(registerPanelRef.current.offsetHeight);
    }
  }, []);

  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailValid = isValidEmail(loginEmail);
    const passwordValid = loginPassword.length >= 6;
    setLoginErrors({ email: !emailValid, password: !passwordValid });
    if (!emailValid || !passwordValid) return;

    setLoginLoading(true);
    try {
      const data: any = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      login(data.token, data.user);
      toast.success("Logged in successfully!");
      router.push("/");
    } catch (err: any) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const nameValid = regName.trim().length > 1;
    const emailValid = isValidEmail(regEmail);
    const passwordValid = regPassword.length >= 6;
    const confirmValid = regConfirm === regPassword && regConfirm.length > 0;
    const termsValid = regTerms;
    setRegErrors({
      name: !nameValid,
      email: !emailValid,
      password: !passwordValid,
      confirm: !confirmValid,
      terms: !termsValid,
    });
    if (
      !nameValid ||
      !emailValid ||
      !passwordValid ||
      !confirmValid ||
      !termsValid
    )
      return;

    setRegLoading(true);
    try {
      let avatarUrl: string | undefined;
      if (avatarPreview) {
        const base64 = avatarPreview.split(",")[1];
        avatarUrl = await uploadToImageBB(base64);
      }
      const data: any = await api("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: regName.trim(),
          email: regEmail,
          password: regPassword,
          avatar: avatarUrl,
        }),
      });
      login(data.token, data.user);
      toast.success("Account created — welcome!");
      router.push("/");
    } catch (err: any) {
      toast.error(err.message || "Registration failed");
    } finally {
      setRegLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoginLoading(true);
    try {
      const data: any = await api("/auth/demo-login", { method: "POST" });
      login(data.token, data.user);
      toast.success("Logged in as demo user");
      router.push("/");
    } catch (err: any) {
      toast.error(err.message || "Demo login failed");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleAvatarChange = (file: File | null) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) =>
      setAvatarPreview((e.target?.result as string) || null);
    reader.readAsDataURL(file);
  };

  const updateStrength = (v: string) => {
    let score = 0;
    if (v.length >= 6) score++;
    if (/[A-Z]/.test(v) && /[0-9]/.test(v)) score++;
    if (v.length >= 10 && /[^A-Za-z0-9]/.test(v)) score++;
    setRegStrength(score);
  };

  const strengthColors = ["#ef4444", "#f59e0b", "#22c55e"];
  const strengthLabels = [
    "Too weak",
    "Weak — add numbers or symbols",
    "Good password strength",
    "Strong password",
  ];

  return (
    <>
      <style>{`
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-14px) rotate(3deg); }
        }
        .float-orb { animation: floatSlow 7s ease-in-out infinite; }
        .float-orb-delay { animation: floatSlow 9s ease-in-out infinite; animation-delay: 1.2s; }
        .field-error {
          max-height: 0; opacity: 0; overflow: hidden;
          transition: opacity .2s ease, max-height .25s ease;
        }
        .field-error.show {
          max-height: 40px; opacity: 1;
        }
      `}</style>

      <div className='min-h-full w-full flex items-center justify-center px-4 py-4 bg-indigo-50 dark:bg-[#0A0820]'>
        <div className='auth-card relative w-full max-w-4xl mx-auto bg-white dark:bg-[#1E1A35] rounded-3xl shadow-xl shadow-indigo-100 dark:shadow-indigo-900/20 overflow-hidden grid grid-cols-1 lg:grid-cols-2'>
          {/* Left: brand / promo panel */}
          <div
            className='relative hidden lg:flex flex-col justify-between p-8 text-white overflow-hidden'
            style={{
              background:
                "radial-gradient(circle at 20% 15%, rgba(255,255,255,0.14), transparent 45%), linear-gradient(135deg, #4f3fd6 0%, #6c4ee6 55%, #8b5cf6 100%)",
            }}
          >
            <div className='pointer-events-none absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white/10 blur-2xl float-orb' />
            <div className='pointer-events-none absolute -bottom-16 -right-10 w-56 h-56 rounded-full bg-white/10 blur-2xl float-orb-delay' />

            {activeTab === "login" ? (
              <>
                <div className='relative'>
                  <div className='flex items-center gap-2'>
                    <img
                      src='/favicon.ico'
                      alt='MindAgent'
                      className='w-8 h-8'
                    />
                    <span className='font-bold text-lg'>MindAgent</span>
                  </div>
                  <h1 className='mt-10 text-3xl font-bold leading-tight'>
                    AI Agents That
                    <br />
                    Think. Create.
                    <br />
                    Deliver Results.
                  </h1>
                  <p className='mt-4 text-white/80 text-sm max-w-xs'>
                    Sign in to access your AI agents, saved analyses, and
                    personalized insights.
                  </p>
                </div>
                <div className='relative flex flex-col gap-2.5'>
                  <div className='flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-300 hover:translate-x-1 hover:bg-white/10'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth={2}
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='w-4 h-4 text-white/90 flex-shrink-0'
                    >
                      <rect x='3' y='3' width='18' height='18' rx='2' ry='2' />
                      <line x1='3' y1='9' x2='21' y2='9' />
                      <line x1='9' y1='21' x2='9' y2='9' />
                    </svg>
                    <span className='text-sm text-white/90'>
                      Turn CSV, Excel & JSON into instant insights
                    </span>
                  </div>
                  <div className='flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-300 hover:translate-x-1 hover:bg-white/10'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth={2}
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='w-4 h-4 text-white/90 flex-shrink-0'
                    >
                      <path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' />
                    </svg>
                    <span className='text-sm text-white/90'>
                      Your data is encrypted and always private
                    </span>
                  </div>
                  <div className='flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-300 hover:translate-x-1 hover:bg-white/10'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth={2}
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='w-4 h-4 text-white/90 flex-shrink-0'
                    >
                      <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
                      <circle cx='9' cy='7' r='4' />
                      <path d='M22 21v-2a4 4 0 0 0-3-3.87' />
                      <path d='M16 3.13a4 4 0 0 1 0 7.75' />
                    </svg>
                    <span className='text-sm text-white/90'>
                      Trusted by 15,000+ users worldwide
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className='relative'>
                  <div className='flex items-center gap-2'>
                    <img
                      src='/favicon.ico'
                      alt='MindAgent'
                      className='w-8 h-8'
                    />
                    <span className='font-bold text-lg'>MindAgent</span>
                  </div>
                  <h1 className='mt-10 text-3xl font-bold leading-tight'>
                    Join 15,000+
                    <br />
                    Teams Building
                    <br />
                    with AI Agents.
                  </h1>
                  <p className='mt-4 text-white/80 text-sm max-w-xs'>
                    Create your free account and start turning data, docs, and
                    ideas into results in seconds.
                  </p>
                </div>
                <div className='relative flex flex-col gap-2.5'>
                  <div className='flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-300 hover:translate-x-1 hover:bg-white/10'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth={2}
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='w-4 h-4 text-white/90 flex-shrink-0'
                    >
                      <path d='M13 2 3 14h9l-1 8 10-12h-9l1-8z' />
                    </svg>
                    <span className='text-sm text-white/90'>
                      Free plan — no credit card required
                    </span>
                  </div>
                  <div className='flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-300 hover:translate-x-1 hover:bg-white/10'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth={2}
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='w-4 h-4 text-white/90 flex-shrink-0'
                    >
                      <rect x='3' y='3' width='18' height='18' rx='2' ry='2' />
                      <line x1='3' y1='9' x2='21' y2='9' />
                      <line x1='9' y1='21' x2='9' y2='9' />
                    </svg>
                    <span className='text-sm text-white/90'>
                      Analyze CSV, Excel & JSON instantly
                    </span>
                  </div>
                  <div className='flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-300 hover:translate-x-1 hover:bg-white/10'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth={2}
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='w-4 h-4 text-white/90 flex-shrink-0'
                    >
                      <path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' />
                    </svg>
                    <span className='text-sm text-white/90'>
                      Your data is encrypted and always private
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right: form panel */}
          <div className='relative p-6 sm:p-8'>
            {/* mobile logo */}
            <div className='flex lg:hidden items-center gap-2 mb-6'>
              <img src='/favicon.ico' alt='MindAgent' className='w-7 h-7' />
              <span className='font-bold text-slate-900 dark:text-white'>
                MindAgent
              </span>
            </div>

            {/* Tabs */}
            <div className='relative flex gap-8 border-b border-slate-200 dark:border-[#2E274A] mb-7'>
              <button
                ref={loginTabRef}
                onClick={() => setActiveTab("login")}
                className={`relative pb-3 text-sm font-semibold transition-colors ${
                  activeTab === "login"
                    ? "text-indigo-600"
                    : "text-slate-400 dark:text-slate-500"
                }`}
              >
                Log In
              </button>
              <button
                ref={registerTabRef}
                onClick={() => setActiveTab("register")}
                className={`relative pb-3 text-sm font-semibold transition-colors ${
                  activeTab === "register"
                    ? "text-indigo-600"
                    : "text-slate-400 dark:text-slate-500"
                }`}
              >
                Register
              </button>
              <span
                className='absolute bottom-0 h-0.5 bg-indigo-600 rounded-full transition-all duration-350'
                style={{
                  width: underlineStyle.width,
                  left: underlineStyle.left,
                }}
              />
            </div>

            {/* Form panels container — grid stacking keeps height consistent */}
            <div
              className='grid grid-cols-1'
              style={{ minHeight: panelMinHeight || undefined }}
            >
              {/* LOGIN PANEL */}
              <div
                className={`col-start-1 row-start-1 transition-all duration-300 ${
                  activeTab === "login"
                    ? "opacity-100"
                    : "opacity-0 pointer-events-none"
                }`}
              >
                <h2 className='text-xl font-bold text-slate-900 dark:text-white'>
                  Welcome back
                </h2>
                <p className='text-sm text-slate-500 dark:text-slate-400 mt-1 mb-6'>
                  Log in to continue to your dashboard.
                </p>

                <form onSubmit={handleLogin} noValidate>
                  <label className='block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5'>
                    Email address
                  </label>
                  <div className='relative mb-1'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth={2}
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2'
                    >
                      <rect width='20' height='16' x='2' y='4' rx='2' />
                      <path d='m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7' />
                    </svg>
                    <input
                      type='email'
                      placeholder='you@example.com'
                      value={loginEmail}
                      onChange={(e) => {
                        setLoginEmail(e.target.value);
                        setLoginErrors((prev) => ({ ...prev, email: false }));
                      }}
                      className={`w-full h-11 pl-10 pr-3 rounded-xl border text-sm text-slate-800 dark:text-white outline-none transition-all duration-250 ${
                        loginErrors.email
                          ? "border-red-500 shadow-[0_0_0_4px_rgba(239,68,68,0.10)]"
                          : "border-slate-200 dark:border-[#2E274A] bg-slate-50 dark:bg-[#16132B] focus:border-indigo-500 focus:shadow-[0_0_0_4px_rgba(108,78,230,0.12)] focus:bg-white dark:focus:bg-[#1E1A35]"
                      }`}
                    />
                  </div>
                  <p
                    className={`field-error text-xs text-red-500 mb-3 ${loginErrors.email ? "show" : ""}`}
                  >
                    Please enter a valid email address.
                  </p>

                  <label className='block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5'>
                    Password
                  </label>
                  <div className='relative mb-1'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth={2}
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2'
                    >
                      <rect width='18' height='11' x='3' y='11' rx='2' ry='2' />
                      <path d='M7 11V7a5 5 0 0 1 10 0v4' />
                    </svg>
                    <input
                      type='password'
                      placeholder='••••••••'
                      value={loginPassword}
                      onChange={(e) => {
                        setLoginPassword(e.target.value);
                        setLoginErrors((prev) => ({
                          ...prev,
                          password: false,
                        }));
                      }}
                      className={`w-full h-11 pl-10 pr-10 rounded-xl border text-sm text-slate-800 dark:text-white outline-none transition-all duration-250 ${
                        loginErrors.password
                          ? "border-red-500 shadow-[0_0_0_4px_rgba(239,68,68,0.10)]"
                          : "border-slate-200 dark:border-[#2E274A] bg-slate-50 dark:bg-[#16132B] focus:border-indigo-500 focus:shadow-[0_0_0_4px_rgba(108,78,230,0.12)] focus:bg-white dark:focus:bg-[#1E1A35]"
                      }`}
                    />
                  </div>
                  <p
                    className={`field-error text-xs text-red-500 mb-1 ${loginErrors.password ? "show" : ""}`}
                  >
                    Password must be at least 6 characters.
                  </p>

                  <div className='flex items-center justify-between mt-3 mb-6'>
                    <label className='flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 cursor-pointer'>
                      <input
                        type='checkbox'
                        className='w-3.5 h-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500'
                      />
                      Remember me
                    </label>
                    <a
                      href='#'
                      className='text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:hover:text-indigo-400'
                    >
                      Forgot password?
                    </a>
                  </div>

                  <button
                    type='submit'
                    disabled={loginLoading}
                    className='w-full h-11 rounded-xl bg-indigo-600 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-250 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-8px_rgba(108,78,230,0.45)] active:translate-y-0 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed'
                  >
                    {loginLoading ? "Logging in..." : "Log In"}
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth={2}
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='w-4 h-4'
                    >
                      <path d='M5 12h14' />
                      <path d='m12 5 7 7-7 7' />
                    </svg>
                  </button>
                </form>

                <button
                  onClick={handleDemoLogin}
                  disabled={loginLoading}
                  className='w-full h-11 mt-3 rounded-xl border border-dashed border-indigo-200 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400 font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-250 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:-translate-y-0.5 disabled:opacity-60'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth={2}
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='w-4 h-4'
                  >
                    <path d='M10 2v2' />
                    <path d='M14 2v2' />
                    <path d='M16 8a6 6 0 0 1 6 6v2' />
                    <path d='M4 16a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v2' />
                    <rect x='2' y='16' width='20' height='6' rx='2' />
                  </svg>
                  Login as Test User
                </button>

                <div className='flex items-center gap-3 my-6'>
                  <div className='flex-1 h-px bg-slate-200 dark:bg-[#2E274A]' />
                  <span className='text-xs text-slate-400 dark:text-slate-500'>
                    or continue with
                  </span>
                  <div className='flex-1 h-px bg-slate-200 dark:bg-[#2E274A]' />
                </div>

                <GoogleAuthButton />

                <p className='text-center text-xs text-slate-500 dark:text-slate-400 mt-6'>
                  Don&apos;t have an account?{" "}
                  <button
                    onClick={() => setActiveTab("register")}
                    className='font-semibold text-indigo-600 hover:text-indigo-700 dark:hover:text-indigo-400'
                  >
                    Sign up free
                  </button>
                </p>
              </div>

              {/* REGISTER PANEL */}
              <div
                ref={registerPanelRef}
                className={`col-start-1 row-start-1 transition-all duration-300 ${
                  activeTab === "register"
                    ? "opacity-100"
                    : "opacity-0 pointer-events-none"
                }`}
              >
                <span className='inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 px-3 py-1 rounded-full uppercase mb-4'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth={2}
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='w-3.5 h-3.5'
                  >
                    <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
                    <circle cx='9' cy='7' r='4' />
                    <path d='M22 21v-2a4 4 0 0 0-3-3.87' />
                    <path d='M16 3.13a4 4 0 0 1 0 7.75' />
                  </svg>
                  Get Started Free
                </span>

                <h2 className='text-xl font-bold text-slate-900 dark:text-white'>
                  Create your account
                </h2>
                <p className='text-sm text-slate-500 dark:text-slate-400 mt-1 mb-4'>
                  It takes less than a minute.
                </p>

                <form onSubmit={handleRegister} noValidate>
                  {/* Avatar upload */}
                  <div className='flex flex-col items-center mb-4'>
                    <input
                      ref={avatarInputRef}
                      type='file'
                      accept='image/*'
                      className='hidden'
                      onChange={(e) =>
                        handleAvatarChange(e.target.files?.[0] || null)
                      }
                    />
                    <div
                      onClick={() => avatarInputRef.current?.click()}
                      className='relative w-20 h-20 rounded-full border-2 border-dashed border-slate-300 dark:border-[#2E274A] flex items-center justify-center cursor-pointer bg-slate-50 dark:bg-[#16132B] transition-all duration-250 hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10'
                    >
                      {avatarPreview ? (
                        <>
                          <img
                            src={avatarPreview}
                            alt='Avatar'
                            className='w-full h-full rounded-full object-cover'
                          />
                          <button
                            type='button'
                            onClick={(e) => {
                              e.stopPropagation();
                              setAvatarPreview(null);
                              if (avatarInputRef.current)
                                avatarInputRef.current.value = "";
                            }}
                            className='absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors'
                          >
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              viewBox='0 0 24 24'
                              fill='none'
                              stroke='currentColor'
                              strokeWidth={2}
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              className='w-2.5 h-2.5'
                            >
                              <path d='M18 6 6 18' />
                              <path d='m6 6 12 12' />
                            </svg>
                          </button>
                        </>
                      ) : (
                        <>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            viewBox='0 0 24 24'
                            fill='none'
                            stroke='currentColor'
                            strokeWidth={2}
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            className='w-6 h-6 text-slate-400'
                          >
                            <path d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2' />
                            <circle cx='12' cy='7' r='4' />
                          </svg>
                          <div className='absolute bottom-0 right-0 w-6 h-6 rounded-full bg-indigo-600 border-2 border-white dark:border-[#1E1A35] flex items-center justify-center'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              viewBox='0 0 24 24'
                              fill='none'
                              stroke='currentColor'
                              strokeWidth={2}
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              className='w-3 h-3 text-white'
                            >
                              <path d='M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z' />
                              <circle cx='12' cy='13' r='3' />
                            </svg>
                          </div>
                        </>
                      )}
                    </div>
                    <p className='text-center text-xs text-slate-400 dark:text-slate-500 mt-1.5'>
                      Add a profile photo{" "}
                      <span className='text-slate-300 dark:text-slate-600'>
                        (optional)
                      </span>
                    </p>
                  </div>

                  <label className='block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5'>
                    Full name
                  </label>
                  <div className='relative mb-1'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth={2}
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2'
                    >
                      <path d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2' />
                      <circle cx='12' cy='7' r='4' />
                    </svg>
                    <input
                      type='text'
                      placeholder='Jane Doe'
                      value={regName}
                      onChange={(e) => {
                        setRegName(e.target.value);
                        setRegErrors((prev) => ({ ...prev, name: false }));
                      }}
                      className={`w-full h-11 pl-10 pr-3 rounded-xl border text-sm text-slate-800 dark:text-white outline-none transition-all duration-250 ${
                        regErrors.name
                          ? "border-red-500 shadow-[0_0_0_4px_rgba(239,68,68,0.10)]"
                          : "border-slate-200 dark:border-[#2E274A] bg-slate-50 dark:bg-[#16132B] focus:border-indigo-500 focus:shadow-[0_0_0_4px_rgba(108,78,230,0.12)] focus:bg-white dark:focus:bg-[#1E1A35]"
                      }`}
                    />
                  </div>
                  <p
                    className={`field-error text-xs text-red-500 mb-3 ${regErrors.name ? "show" : ""}`}
                  >
                    Please enter your full name.
                  </p>

                  <label className='block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5'>
                    Email address
                  </label>
                  <div className='relative mb-1'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth={2}
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2'
                    >
                      <rect width='20' height='16' x='2' y='4' rx='2' />
                      <path d='m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7' />
                    </svg>
                    <input
                      type='email'
                      placeholder='you@example.com'
                      value={regEmail}
                      onChange={(e) => {
                        setRegEmail(e.target.value);
                        setRegErrors((prev) => ({ ...prev, email: false }));
                      }}
                      className={`w-full h-11 pl-10 pr-3 rounded-xl border text-sm text-slate-800 dark:text-white outline-none transition-all duration-250 ${
                        regErrors.email
                          ? "border-red-500 shadow-[0_0_0_4px_rgba(239,68,68,0.10)]"
                          : "border-slate-200 dark:border-[#2E274A] bg-slate-50 dark:bg-[#16132B] focus:border-indigo-500 focus:shadow-[0_0_0_4px_rgba(108,78,230,0.12)] focus:bg-white dark:focus:bg-[#1E1A35]"
                      }`}
                    />
                  </div>
                  <p
                    className={`field-error text-xs text-red-500 mb-3 ${regErrors.email ? "show" : ""}`}
                  >
                    Please enter a valid email address.
                  </p>

                  <label className='block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5'>
                    Password
                  </label>
                  <div className='relative mb-1'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth={2}
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2'
                    >
                      <rect width='18' height='11' x='3' y='11' rx='2' ry='2' />
                      <path d='M7 11V7a5 5 0 0 1 10 0v4' />
                    </svg>
                    <input
                      type='password'
                      placeholder='Create a password'
                      value={regPassword}
                      onChange={(e) => {
                        setRegPassword(e.target.value);
                        setRegErrors((prev) => ({ ...prev, password: false }));
                        updateStrength(e.target.value);
                      }}
                      className={`w-full h-11 pl-10 pr-10 rounded-xl border text-sm text-slate-800 dark:text-white outline-none transition-all duration-250 ${
                        regErrors.password
                          ? "border-red-500 shadow-[0_0_0_4px_rgba(239,68,68,0.10)]"
                          : "border-slate-200 dark:border-[#2E274A] bg-slate-50 dark:bg-[#16132B] focus:border-indigo-500 focus:shadow-[0_0_0_4px_rgba(108,78,230,0.12)] focus:bg-white dark:focus:bg-[#1E1A35]"
                      }`}
                    />
                  </div>

                  {/* Strength meter */}
                  <div className='flex gap-1.5 mt-2 mb-1'>
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className='h-1 flex-1 rounded-full bg-slate-200 dark:bg-[#2E274A] overflow-hidden'
                      >
                        <div
                          className='h-full rounded-full transition-all duration-350'
                          style={{
                            width: regStrength > i ? "100%" : "0%",
                            backgroundColor:
                              regStrength > 0
                                ? strengthColors[Math.min(regStrength - 1, 2)]
                                : "#e2e8f0",
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  <p className='text-xs text-slate-400 dark:text-slate-500 mb-1'>
                    {regPassword.length === 0
                      ? "Use 6+ characters, mixing letters & numbers."
                      : strengthLabels[regStrength]}
                  </p>

                  <p
                    className={`field-error text-xs text-red-500 mb-3 ${regErrors.password ? "show" : ""}`}
                  >
                    Password must be at least 6 characters.
                  </p>

                  <label className='block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5'>
                    Confirm password
                  </label>
                  <div className='relative mb-1'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth={2}
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2'
                    >
                      <rect width='18' height='11' x='3' y='11' rx='2' ry='2' />
                      <path d='M7 11V7a5 5 0 0 1 10 0v4' />
                    </svg>
                    <input
                      type='password'
                      placeholder='Re-enter your password'
                      value={regConfirm}
                      onChange={(e) => {
                        setRegConfirm(e.target.value);
                        setRegErrors((prev) => ({ ...prev, confirm: false }));
                      }}
                      className={`w-full h-11 pl-10 pr-10 rounded-xl border text-sm text-slate-800 dark:text-white outline-none transition-all duration-250 ${
                        regErrors.confirm
                          ? "border-red-500 shadow-[0_0_0_4px_rgba(239,68,68,0.10)]"
                          : "border-slate-200 dark:border-[#2E274A] bg-slate-50 dark:bg-[#16132B] focus:border-indigo-500 focus:shadow-[0_0_0_4px_rgba(108,78,230,0.12)] focus:bg-white dark:focus:bg-[#1E1A35]"
                      }`}
                    />
                  </div>
                  <p
                    className={`field-error text-xs text-red-500 mb-3 ${regErrors.confirm ? "show" : ""}`}
                  >
                    Passwords do not match.
                  </p>

                  <label className='flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1 mt-2 cursor-pointer'>
                    <input
                      type='checkbox'
                      checked={regTerms}
                      onChange={(e) => {
                        setRegTerms(e.target.checked);
                        setRegErrors((prev) => ({ ...prev, terms: false }));
                      }}
                      className='w-3.5 h-3.5 mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500'
                    />
                    I agree to the{" "}
                    <a href='#' className='text-indigo-600 font-semibold'>
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href='#' className='text-indigo-600 font-semibold'>
                      Privacy Policy
                    </a>
                  </label>
                  <p
                    className={`field-error text-xs text-red-500 mb-3 ${regErrors.terms ? "show" : ""}`}
                  >
                    Please accept the terms to continue.
                  </p>

                  <button
                    type='submit'
                    disabled={regLoading}
                    className='w-full h-11 mt-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-250 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-8px_rgba(108,78,230,0.45)] active:translate-y-0 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed'
                  >
                    {regLoading ? "Creating..." : "Create Account"}
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth={2}
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='w-4 h-4'
                    >
                      <path d='M5 12h14' />
                      <path d='m12 5 7 7-7 7' />
                    </svg>
                  </button>
                </form>

                <div className='flex items-center gap-3 my-4'>
                  <div className='flex-1 h-px bg-slate-200 dark:bg-[#2E274A]' />
                  <span className='text-xs text-slate-400 dark:text-slate-500'>
                    or continue with
                  </span>
                  <div className='flex-1 h-px bg-slate-200 dark:bg-[#2E274A]' />
                </div>

                <GoogleAuthButton />

                <p className='text-center text-xs text-slate-500 dark:text-slate-400 mt-4'>
                  Already have an account?{" "}
                  <button
                    onClick={() => setActiveTab("login")}
                    className='font-semibold text-indigo-600 hover:text-indigo-700 dark:hover:text-indigo-400'
                  >
                    Log in
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
