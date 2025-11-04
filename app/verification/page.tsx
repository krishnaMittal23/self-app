'use client';

import React, { useState, useEffect } from 'react';
import { getUniversalLink } from "@selfxyz/core";
import {
  SelfQRcodeWrapper,
  SelfAppBuilder,
  type SelfApp,
} from "@selfxyz/qrcode";
import { ethers } from "ethers";

function VerificationPage() {
  const [selfApp, setSelfApp] = useState<SelfApp | null>(null);
  const [universalLink, setUniversalLink] = useState("");
  const [userId] = useState(ethers.ZeroAddress);
  const [verificationStatus, setVerificationStatus] = useState<string>('idle');
  const [verificationResult, setVerificationResult] = useState<any>(null);

  useEffect(() => {
    try {
      const app = new SelfAppBuilder({
        version: 2,
        appName: process.env.NEXT_PUBLIC_SELF_APP_NAME || "Self Authentication App",
        scope: process.env.NEXT_PUBLIC_SELF_SCOPE || "self-auth-demo",
        endpoint: process.env.NEXT_PUBLIC_SELF_ENDPOINT || "https://your-app.ngrok.io/api/verify",
        logoBase64: "https://i.postimg.cc/mrmVf9hm/self.png",
        userId: userId,
        endpointType: "staging_https",
        userIdType: "hex",
        userDefinedData: "Self Authentication Demo",
        disclosures: {
          // Check the API reference for more disclosure attributes!
          minimumAge: 18,
          nationality: true,
          gender: true,
        }
      }).build();

      setSelfApp(app);
      setUniversalLink(getUniversalLink(app));
    } catch (error) {
      console.error("Failed to initialize Self app:", error);
      setVerificationStatus('error');
    }
  }, [userId]);

  const handleSuccessfulVerification = (result: any) => {
    console.log("Verification successful!", result);
    setVerificationStatus('success');
    setVerificationResult(result);
  };

  const handleVerificationError = (error: any) => {
    console.error("Error: Failed to verify identity", error);
    setVerificationStatus('error');
  };

  const resetVerification = () => {
    setVerificationStatus('idle');
    setVerificationResult(null);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Identity Verification
            </h1>
            <p className="text-gray-600">
              Scan the QR code below with the Self app to verify your identity
            </p>
          </div>

          <div className="flex justify-center mb-8">
            {selfApp ? (
              <div className="text-center">
                <SelfQRcodeWrapper
                  selfApp={selfApp}
                  onSuccess={handleSuccessfulVerification}
                  onError={handleVerificationError}
                />
                <p className="text-sm text-gray-500 mt-4">
                  Don't have the Self app? Download it from your app store
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 w-64 bg-gray-100 rounded-lg">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading QR Code...</p>
                </div>
              </div>
            )}
          </div>

          {/* Verification Status */}
          <div className="text-center">
            {verificationStatus === 'idle' && (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <span className="text-yellow-700">Waiting for verification...</span>
              </div>
            )}
            
            {verificationStatus === 'success' && (
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-green-700 font-medium">Verification successful!</span>
                </div>
                
                {verificationResult && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left">
                    <h3 className="font-medium text-green-800 mb-2">Verified Information:</h3>
                    <pre className="text-sm text-green-700 whitespace-pre-wrap overflow-x-auto">
                      {JSON.stringify(verificationResult, null, 2)}
                    </pre>
                  </div>
                )}
                
                <button
                  onClick={resetVerification}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Verify Again
                </button>
              </div>
            )}
            
            {verificationStatus === 'error' && (
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <span className="text-red-700 font-medium">Verification failed</span>
                </div>
                
                <button
                  onClick={resetVerification}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <h3 className="font-medium text-gray-900 mb-3">How it works:</h3>
            <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
              <li>Download the Self app from your mobile app store</li>
              <li>Create an account and verify your identity document</li>
              <li>Scan the QR code above with the Self app</li>
              <li>Review the information being requested</li>
              <li>Approve the verification to complete the process</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerificationPage;