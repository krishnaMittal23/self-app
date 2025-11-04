'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { roscaService, CreateCircleParams } from '@/lib/services/roscaService';

export default function CreateCircle() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [formData, setFormData] = useState<CreateCircleParams>({
    monthlyAmount: '100',
    maxMembers: 10,
    duration: 12,
    country: 'USA',
    minAge: 18,
    maxAge: 65,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'monthlyAmount' ? value : Number(value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return;

    setIsLoading(true);
    setError('');

    try {
      // Initialize service
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        await roscaService.initialize((window as any).ethereum);
      }

      const result = await roscaService.createCircle(formData);
      
      alert(`Circle created successfully! Circle ID: ${result.circleId}\nTransaction: ${result.transactionHash}`);
      router.push('/rosca');
    } catch (err: any) {
      console.error('Error creating circle:', err);
      setError(err.message || 'Failed to create circle');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md">
          <h1 className="text-2xl font-bold mb-4">Connect Your Wallet</h1>
          <p className="text-gray-600 mb-6">
            Connect your wallet to create a ROSCA circle
          </p>
          <ConnectButton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Create ROSCA Circle</h1>
                <p className="text-gray-600">Set up a new savings circle</p>
              </div>
              <Link 
                href="/rosca"
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                ← Back to Dashboard
              </Link>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Monthly Amount */}
              <div>
                <label htmlFor="monthlyAmount" className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Contribution (PYUSD)
                </label>
                <input
                  type="number"
                  id="monthlyAmount"
                  name="monthlyAmount"
                  value={formData.monthlyAmount}
                  onChange={handleChange}
                  min="1"
                  step="0.01"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="100"
                />
                <p className="mt-1 text-sm text-gray-500">Amount each member contributes monthly</p>
              </div>

              {/* Max Members */}
              <div>
                <label htmlFor="maxMembers" className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Members
                </label>
                <input
                  type="number"
                  id="maxMembers"
                  name="maxMembers"
                  value={formData.maxMembers}
                  onChange={handleChange}
                  min="2"
                  max="100"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="10"
                />
                <p className="mt-1 text-sm text-gray-500">Total number of members in the circle</p>
              </div>

              {/* Duration */}
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (Months)
                </label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  min="1"
                  max="60"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="12"
                />
                <p className="mt-1 text-sm text-gray-500">Length of the savings cycle</p>
              </div>

              {/* Country */}
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                  Country Restriction
                </label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="USA">United States</option>
                  <option value="IND">India</option>
                  <option value="GBR">United Kingdom</option>
                  <option value="CAN">Canada</option>
                  <option value="AUS">Australia</option>
                  <option value="DEU">Germany</option>
                  <option value="FRA">France</option>
                  <option value="JPN">Japan</option>
                  <option value="BRA">Brazil</option>
                  <option value="MEX">Mexico</option>
                </select>
                <p className="mt-1 text-sm text-gray-500">Members must be from this country</p>
              </div>

              {/* Age Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="minAge" className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Age
                  </label>
                  <input
                    type="number"
                    id="minAge"
                    name="minAge"
                    value={formData.minAge}
                    onChange={handleChange}
                    min="18"
                    max="100"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="18"
                  />
                </div>
                <div>
                  <label htmlFor="maxAge" className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Age
                  </label>
                  <input
                    type="number"
                    id="maxAge"
                    name="maxAge"
                    value={formData.maxAge}
                    onChange={handleChange}
                    min="18"
                    max="100"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="65"
                  />
                </div>
              </div>
              <p className="text-sm text-gray-500">Age range for eligible members</p>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              {/* Summary Box */}
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h3 className="font-bold text-indigo-900 mb-2">Circle Summary</h3>
                <div className="space-y-1 text-sm text-indigo-700">
                  <p>• Total Pool: {Number(formData.monthlyAmount) * formData.maxMembers} PYUSD per month</p>
                  <p>• Each member receives: {Number(formData.monthlyAmount) * formData.maxMembers} PYUSD once</p>
                  <p>• Total Duration: {formData.duration} months</p>
                  <p>• Restricted to: {formData.country}, Ages {formData.minAge}-{formData.maxAge}</p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating Circle...' : 'Create Circle'}
              </button>
            </form>
          </div>

          {/* Info Box */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-bold text-blue-900 mb-2">ℹ️ How ROSCA Circles Work</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Each member contributes a fixed amount monthly</li>
              <li>• One member receives the total pool each month</li>
              <li>• The cycle continues until all members have received the payout</li>
              <li>• Members must be KYC verified to join</li>
              <li>• Smart contracts ensure transparent and secure operations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
