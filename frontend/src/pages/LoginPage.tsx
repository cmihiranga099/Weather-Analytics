import { useAuth0 } from '@auth0/auth0-react';

export default function LoginPage() {
  const { loginWithRedirect, isLoading } = useAuth0();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-gray-100 dark:border-gray-700">
        <div className="mb-6">
          <svg className="w-16 h-16 text-blue-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Weather Analytics
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Sign in to access the Comfort Index Dashboard
          </p>
        </div>

        <button
          onClick={() => loginWithRedirect()}
          disabled={isLoading}
          className="w-full px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Loading...' : 'Sign In'}
        </button>

        <p className="text-xs text-gray-400 dark:text-gray-500 mt-6">
          Only authorized users can access this application.
        </p>
      </div>
    </div>
  );
}
