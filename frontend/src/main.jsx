import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ClerkProvider } from '@clerk/react';
import { BrowserRouter } from "react-router";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {PUBLISHABLE_KEY ? (
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ClerkProvider>
    ) : (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-800 p-6">
        <div className="max-w-md w-full bg-white shadow-md rounded-lg p-6 border border-gray-200 text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Missing Clerk Publishable Key</h2>
          <p className="text-sm text-gray-600 mb-4">
            Clerk Authentication requires a publishable key to function.
          </p>
          <div className="bg-gray-100 p-3 rounded text-left text-xs font-mono mb-4 text-gray-700 overflow-x-auto">
            VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
          </div>
          <p className="text-xs text-gray-500">
            Create a <strong>.env</strong> file inside the <code>frontend</code> folder with your Clerk Publishable Key and restart the dev server.
          </p>
        </div>
      </div>
    )}
  </StrictMode>
);
