'use client';

import { useAuth, useUser, SignInButton, Show } from "@clerk/nextjs";
import { useState } from "react";

export default function TestPage() {
  const { getToken, isLoaded } = useAuth();
  const { user } = useUser();
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testAuth = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Get the 60-second "Ticket" (JWT) from Clerk
      const token = await getToken({
        template: 'django-backend',
      });

      // 2. Send it to your Django "Ride Operator" (Backend)
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.sokoline.app';
      const res = await fetch(`${baseUrl}/api/users/me/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error(`Backend Error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      setResponse(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) return <div className="p-8 text-center text-gray-500">Loading Clerk...</div>;

  return (
    <div className="max-w-2xl mx-auto p-8 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Authentication Test</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
        <Show when="signed-out">
          <div className="text-center">
            <p className="mb-4 text-gray-600 italic">You are currently logged out (No Wristband).</p>
            <div className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition">
              <SignInButton mode="modal" />
            </div>
          </div>
        </Show>

        <Show when="signed-in">
          <div className="space-y-6">
            <div className="flex items-center gap-4 border-b pb-4">
              <img
                src={user?.imageUrl}
                alt="User profile"
                className="w-12 h-12 rounded-full border border-gray-300"
              />
              <div>
                <p className="font-semibold text-gray-900">{user?.fullName || 'User'}</p>
                <p className="text-sm text-gray-500">{user?.primaryEmailAddress?.emailAddress}</p>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
              <p className="text-sm text-blue-800 font-medium mb-2">
                Step 2: Get a 60-second "Ticket" and send to Django
              </p>
              <button
                onClick={testAuth}
                disabled={loading}
                className={`w-full py-2 rounded-md text-white font-semibold transition ${
                  loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-sm'
                }`}
              >
                {loading ? 'Asking Clerk for Ticket...' : 'Verify with Django Backend'}
              </button>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
                <strong>Error:</strong> {error}
              </div>
            )}

            {response && (
              <div className="mt-6">
                <p className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">
                  Response from Django:
                </p>
                <pre className="p-4 bg-gray-900 text-green-400 text-sm rounded-md overflow-x-auto border border-gray-700 shadow-inner">
                  {JSON.stringify(response, null, 2)}
                </pre>
                <p className="mt-2 text-xs text-gray-500 italic text-right">
                  Django just looked at your token and found your user on sokoline.app!
                  </p>              </div>
            )}
          </div>
        </Show>
      </div>
    </div>
  );
}
