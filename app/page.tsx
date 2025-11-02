import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <main className="flex min-h-screen flex-col items-center justify-center py-32 px-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Self Authentication Demo
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Experience secure, privacy-preserving identity verification using Self Protocol. 
              Verify your age, nationality, and other attributes without revealing your personal information.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              What is Self Protocol?
            </h2>
            <p className="text-gray-600 mb-6">
              Self Protocol enables privacy-preserving identity verification using zero-knowledge proofs. 
              Users can prove attributes like age or nationality without revealing their actual identity documents.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="bg-indigo-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-800 mb-2">Secure</h3>
                <p className="text-sm text-gray-600">Zero-knowledge proofs ensure your data stays private</p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-800 mb-2">Verified</h3>
                <p className="text-sm text-gray-600">Cryptographically prove your attributes</p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-800 mb-2">Private</h3>
                <p className="text-sm text-gray-600">Share only what's necessary, nothing more</p>
              </div>
            </div>
            
            <Link 
              href="/verification"
              className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Try Identity Verification
            </Link>
          </div>
          
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Requirements:</h3>
            <ul className="text-gray-600 space-y-2">
              <li>• Download the Self app from your mobile app store</li>
              <li>• Verify your identity document (passport, ID card, etc.)</li>
              <li>• Must be 18+ years old for this demo</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
