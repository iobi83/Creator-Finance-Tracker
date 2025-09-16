import { useRouter } from 'next/router';

export default function Cancel() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md mx-auto text-center bg-white p-8 rounded-lg shadow">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Cancelled</h1>
        <p className="text-gray-600 mb-6">No worries! You can try again anytime.</p>
        <button 
          onClick={() => router.push('/')}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}