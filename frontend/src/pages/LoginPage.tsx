import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login, register, isLoading: authLoading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        await login({ email: formData.email, password: formData.password });
      } else {
        await register(formData);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0f172a] relative overflow-hidden px-4 selection:bg-primary-500/30">
      {/* Dynamic Background */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-primary-500/20 rounded-full blur-[120px] animate-pulse-slow shadow-[0_0_100px_rgba(139,92,246,0.1)]" />
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] animate-pulse-slow shadow-[0_0_100px_rgba(59,130,246,0.1)]" />
      
      <div className="relative w-full max-w-[450px] animate-fade-in">
        <div className="glass rounded-[40px] p-10 border-white/40 dark:border-slate-800/50 shadow-2xl shadow-primary-500/10 backdrop-blur-3xl">
          <div className="mb-10 text-center space-y-3">
            <div className="w-20 h-20 bg-gradient-to-tr from-primary-600 to-blue-500 rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-primary-500/30 rotate-3 hover:rotate-0 transition-transform duration-500 group">
              <svg className="w-10 h-10 text-white drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                SkyCast
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-[0.3em] mt-1">
                Weather Intelligence
              </p>
            </div>
            <p className="text-slate-400 dark:text-slate-500 text-sm font-medium pt-2">
              {isLogin ? 'Access your intelligence dashboard' : 'Join the weather revolution'}
            </p>
          </div>
  
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2 animate-slide-up">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">Full Name</label>
                <div className="relative group">
                   <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl text-slate-900 dark:text-white focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all placeholder:text-slate-400"
                    placeholder="Enter your name"
                  />
                </div>
              </div>
            )}
  
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">Email Address</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl text-slate-900 dark:text-white focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all placeholder:text-slate-400"
                placeholder="name@company.com"
              />
            </div>
  
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">Secure Password</label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl text-slate-900 dark:text-white focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all placeholder:text-slate-400"
                placeholder="••••••••"
              />
            </div>
  
            {!isLogin && (
              <div className="space-y-2 animate-slide-up">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">Confirm Security Key</label>
                <input
                  type="password"
                  name="password_confirmation"
                  required
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl text-slate-900 dark:text-white focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all placeholder:text-slate-400"
                  placeholder="••••••••"
                />
              </div>
            )}
  
            {error && (
              <div className="text-rose-500 text-xs font-bold bg-rose-500/10 p-4 rounded-2xl border border-rose-500/20 flex items-center gap-3 animate-shake">
                <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}
  
            <button
              type="submit"
              disabled={loading || authLoading}
              className="w-full btn-primary !py-4 text-base flex items-center justify-center gap-2 group"
            >
              {loading ? (
                 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Sign In to Dashboard' : 'Initialize Account'}
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </form>
  
          <div className="mt-8 pt-8 border-t border-slate-200/50 dark:border-slate-800/50 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors uppercase tracking-widest"
            >
              {isLogin ? "Need an account? Sign Up" : 'Returning user? Sign In'}
            </button>
          </div>
        </div>
        
        <p className="text-[10px] text-center text-slate-400 dark:text-slate-600 mt-8 font-black uppercase tracking-[0.2em] px-10 leading-relaxed">
          Proprietary Weather Intelligence Platform • Protected by Advanced Encryption
        </p>
      </div>
    </div>
  );
}
