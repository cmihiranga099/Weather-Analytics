import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../hooks/useDarkMode';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { isDark, toggle } = useDarkMode();

  return (
    <nav className="sticky top-0 z-40 glass border-b-0 border-white/10 dark:border-slate-800/50 mb-6">
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
        <div className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-tr from-primary-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:rotate-12 transition-transform duration-300">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
          </div>
          <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 via-primary-700 to-blue-600 dark:from-white dark:via-primary-400 dark:to-blue-400 bg-clip-text text-transparent">
            SkyCast <span className="text-sm font-medium text-slate-500 dark:text-slate-400 hidden sm:inline ml-1">Weather Analytics</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggle}
            className="p-2.5 rounded-xl bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition-all border border-white/20 dark:border-slate-700/50 shadow-sm"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {isAuthenticated && user && (
            <div className="flex items-center gap-4 border-l border-slate-200 dark:border-slate-700 pl-4">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-bold text-slate-900 dark:text-white leading-none">
                  {user.name || 'User'}
                </span>
                <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
                  Standard Plan
                </span>
              </div>
              <button
                onClick={logout}
                className="btn-primary !px-4 !py-2 text-sm"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
