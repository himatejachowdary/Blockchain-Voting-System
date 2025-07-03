import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Vote, 
  Users, 
  Lock, 
  Zap, 
  Globe,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const HeroSection = () => {
  const features = [
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Tamper-Proof",
      description: "Immutable blockchain records"
    },
    {
      icon: <Vote className="w-5 h-5" />,
      title: "Anonymous Voting",
      description: "Privacy-preserving technology"
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Transparent",
      description: "Public verification possible"
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Instant Results",
      description: "Real-time vote counting"
    }
  ];

  const benefits = [
    "End-to-end encryption for vote privacy",
    "Smart contract automation",
    "Decentralized verification system",
    "Audit trail for transparency",
    "Global accessibility via web interface"
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 bg-gradient-hero"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(33,150,243,0.3),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(76,175,80,0.2),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(156,39,176,0.1),transparent_70%)]"></div>
      
      {/* Enhanced Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-pulse-glow shadow-glow"></div>
      <div className="absolute bottom-32 right-16 w-32 h-32 bg-accent/20 rounded-full blur-2xl animate-pulse-glow shadow-neon" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-20 w-16 h-16 bg-trust/20 rounded-full blur-lg animate-pulse-glow shadow-cyber" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-warning/15 rounded-full blur-2xl animate-pulse-glow" style={{ animationDelay: '3s' }}></div>

      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Hero Content */}
          <div className="space-y-8 animate-slide-up">
            <div className="space-y-6">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 gap-2 px-4 py-2">
                <Lock className="w-4 h-4" />
                Powered by Ethereum Blockchain
              </Badge>
              
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Secure
                </span>
                <br />
                <span className="text-foreground">
                  Decentralized
                </span>
                <br />
                <span className="bg-gradient-trust bg-clip-text text-transparent">
                  Voting
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                Experience the future of democratic participation with our blockchain-powered voting system. 
                Transparent, secure, and tamper-proof elections for the digital age.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="blockchain" size="lg" className="gap-2 px-8 py-6 text-lg">
                <Vote className="w-5 h-5" />
                Start Voting
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg" className="gap-2 px-8 py-6 text-lg">
                <Globe className="w-5 h-5" />
                View Live Elections
              </Button>
            </div>

            {/* Feature Pills */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-3 p-3 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="p-2 bg-primary/10 rounded-md text-primary">
                    {feature.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{feature.title}</p>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Feature Cards */}
          <div className="space-y-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            {/* Main Feature Card - Enhanced */}
            <Card className="bg-gradient-card shadow-cyber border-primary/20 hover:shadow-glow transition-all duration-500 hover:scale-105">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-cyber rounded-xl flex items-center justify-center shadow-glow">
                      <Shield className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Blockchain Security</h3>
                      <p className="text-muted-foreground">Cryptographically secured voting</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" />
                        <p className="text-sm text-muted-foreground">{benefit}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="bg-gradient-card shadow-card text-center p-4">
                <CardContent className="p-0">
                  <p className="text-2xl font-bold text-primary">99.9%</p>
                  <p className="text-xs text-muted-foreground">Uptime</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-card shadow-card text-center p-4">
                <CardContent className="p-0">
                  <p className="text-2xl font-bold text-accent">10K+</p>
                  <p className="text-xs text-muted-foreground">Votes Cast</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-card shadow-card text-center p-4">
                <CardContent className="p-0">
                  <p className="text-2xl font-bold text-trust">0</p>
                  <p className="text-xs text-muted-foreground">Incidents</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;