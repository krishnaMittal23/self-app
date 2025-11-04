'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { roscaService, CircleInfo } from '@/lib/services/roscaService';

export default function ROSCADashboard() {
  const { address, isConnected } = useAccount();
  const [userCircles, setUserCircles] = useState<number[]>([]);
  const [allCircles, setAllCircles] = useState<CircleInfo[]>([]);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState('USA');

  useEffect(() => {
    if (isConnected && address) {
      loadDashboardData();
    }
  }, [isConnected, address, selectedCountry]);

  const loadDashboardData = async () => {
    if (!address) return;

    try {
      setLoading(true);

      // Initialize service
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        await roscaService.initialize((window as any).ethereum);
      }

      // Check verification status
      const verified = await roscaService.isUserVerified(address);
      setIsVerified(verified);

      // Load user circles
      const circles = await roscaService.getUserCircles(address);
      setUserCircles(circles);

      // Load circles by country
      const countryCircles = await roscaService.getCirclesByCountry(selectedCountry);
      const circleDetails = await Promise.all(
        countryCircles.map(async (id) => {
          const info = await roscaService.getCircleInfo(id);
          return { id, ...info };
        })
      );
      setAllCircles(circleDetails as any);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinCircle = async (circleId: number) => {
    if (!address) return;

    try {
      // Check eligibility first
      const circle = allCircles.find((c: any) => c.id === circleId);
      if (!circle) return;

      const eligibility = await roscaService.checkEligibility(
        address,
        circle.country,
        Number(circle.minAge),
        Number(circle.maxAge)
      );

      if (!eligibility.eligible) {
        alert(`Not eligible: ${eligibility.reason}`);
        return;
      }

      const txHash = await roscaService.joinCircle(circleId);
      alert(`Successfully joined circle! Transaction: ${txHash}`);
      loadDashboardData();
    } catch (error: any) {
      console.error('Error joining circle:', error);
      alert(`Failed to join circle: ${error.message}`);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md">
          <h1 className="text-2xl font-bold mb-4">Connect Your Wallet</h1>
          <p className="text-gray-600 mb-6">
            Connect your wallet to access ROSCA circles
          </p>
          <ConnectButton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">ROSCA Dashboard</h1>
              <p className="text-gray-600">Manage your savings circles</p>
            </div>
            <div className="flex gap-4 items-center">
              <Link 
                href="/"
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                ← Back to Home
              </Link>
              <ConnectButton />
            </div>
          </div>

          {/* Verification Status */}
          <div className={`p-4 rounded-lg ${isVerified ? 'bg-green-50' : 'bg-yellow-50'}`}>
            <div className="flex items-center gap-2">
              {isVerified ? (
                <>
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-green-700 font-medium">KYC Verified</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-yellow-700 font-medium">Not Verified</span>
                  <Link href="/verification" className="ml-2 text-yellow-900 underline">
                    Verify Now
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* My Circles */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">My Circles</h2>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : userCircles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userCircles.map((circleId) => (
                <CircleCard key={circleId} circleId={circleId} isJoined={true} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">You haven't joined any circles yet</p>
          )}
        </div>

        {/* Create New Circle */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Create New Circle</h2>
              <p className="text-gray-600">Start a new savings circle</p>
            </div>
            <Link 
              href="/rosca/create"
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
            >
              Create Circle
            </Link>
          </div>
        </div>

        {/* Available Circles */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Available Circles</h2>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="USA">USA</option>
              <option value="IND">India</option>
              <option value="GBR">United Kingdom</option>
              <option value="CAN">Canada</option>
              <option value="AUS">Australia</option>
            </select>
          </div>

          {loading ? (
            <p className="text-gray-500">Loading circles...</p>
          ) : allCircles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allCircles.map((circle: any) => (
                <div key={circle.id} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-lg mb-2">Circle #{circle.id}</h3>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-600">
                      <span className="font-medium">Monthly:</span> {roscaService.formatPYUSD(circle.monthlyAmount)} PYUSD
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Members:</span> {circle.currentMembers.toString()}/{circle.maxMembers.toString()}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Country:</span> {circle.country}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Age Range:</span> {circle.minAge.toString()}-{circle.maxAge.toString()}
                    </p>
                    <p className={`font-medium ${circle.isActive ? 'text-green-600' : 'text-red-600'}`}>
                      {circle.isActive ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                  {circle.isActive && (
                    <button
                      onClick={() => handleJoinCircle(circle.id)}
                      disabled={!isVerified}
                      className="w-full mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      {isVerified ? 'Join Circle' : 'Verify to Join'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No circles available in {selectedCountry}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function CircleCard({ circleId, isJoined }: { circleId: number; isJoined: boolean }) {
  const [info, setInfo] = useState<CircleInfo | null>(null);

  useEffect(() => {
    loadCircleInfo();
  }, [circleId]);

  const loadCircleInfo = async () => {
    try {
      const circleInfo = await roscaService.getCircleInfo(circleId);
      setInfo(circleInfo);
    } catch (error) {
      console.error('Error loading circle info:', error);
    }
  };

  if (!info) return <div className="p-4 border rounded">Loading...</div>;

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-green-50">
      <h3 className="font-bold text-lg mb-2">Circle #{circleId}</h3>
      <div className="space-y-2 text-sm">
        <p className="text-gray-600">
          <span className="font-medium">Monthly:</span> {roscaService.formatPYUSD(info.monthlyAmount)} PYUSD
        </p>
        <p className="text-gray-600">
          <span className="font-medium">Members:</span> {info.currentMembers.toString()}/{info.maxMembers.toString()}
        </p>
        <p className="text-gray-600">
          <span className="font-medium">Country:</span> {info.country}
        </p>
      </div>
      {isJoined && (
        <span className="inline-block mt-4 bg-green-600 text-white px-3 py-1 rounded text-sm">
          Joined ✓
        </span>
      )}
    </div>
  );
}
