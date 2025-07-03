import React from 'react';
import Header from '@/components/layout/Header';
import HeroSection from '@/components/hero/HeroSection';
import VotingDashboard from '@/components/dashboard/VotingDashboard';
import { useWeb3 } from '@/contexts/Web3Context';

const Index = () => {
  const { isConnected } = useWeb3();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section - Always visible */}
      {!isConnected && <HeroSection />}
      
      {/* Dashboard - Only when wallet connected */}
      {isConnected && (
        <main className="container mx-auto px-4 py-8">
          <VotingDashboard />
        </main>
      )}
    </div>
  );
};

export default Index;
