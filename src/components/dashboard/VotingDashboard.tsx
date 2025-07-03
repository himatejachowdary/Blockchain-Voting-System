import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CreateElectionModal from '@/components/modals/CreateElectionModal';
import VotingModal from '@/components/modals/VotingModal';
import ElectionAnalytics from '@/components/analytics/ElectionAnalytics';
import MetaMaskConnection from '@/components/wallet/MetaMaskConnection';
import { useWeb3 } from '@/contexts/Web3Context';
import { 
  Vote, 
  Users, 
  Shield, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  PlusCircle,
  BarChart3,
  TrendingUp,
  Wallet
} from 'lucide-react';

interface Election {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'upcoming' | 'ended';
  startDate: Date;
  endDate: Date;
  totalVotes: number;
  totalVoters: number;
  candidates: Candidate[];
}

interface Candidate {
  id: string;
  name: string;
  description: string;
  votes: number;
  percentage: number;
}

const VotingDashboard = () => {
  const { isConnected, account } = useWeb3();
  const [elections] = useState<Election[]>([
    {
      id: '1',
      title: 'Student Council President Election 2024',
      description: 'Annual election for the student council president position',
      status: 'active',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-12-31'),
      totalVotes: 1247,
      totalVoters: 2500,
      candidates: [
        { id: '1', name: 'Alice Johnson', description: 'Computer Science Major', votes: 623, percentage: 50 },
        { id: '2', name: 'Bob Smith', description: 'Business Administration', votes: 374, percentage: 30 },
        { id: '3', name: 'Carol Davis', description: 'Engineering Student', votes: 250, percentage: 20 },
      ]
    },
    {
      id: '2',
      title: 'Department Budget Allocation',
      description: 'Vote on how to allocate the department budget for next year',
      status: 'upcoming',
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-02-15'),
      totalVotes: 0,
      totalVoters: 150,
      candidates: [
        { id: '1', name: 'Infrastructure', description: 'Lab equipment and facilities', votes: 0, percentage: 0 },
        { id: '2', name: 'Research', description: 'Research grants and projects', votes: 0, percentage: 0 },
        { id: '3', name: 'Student Activities', description: 'Events and student programs', votes: 0, percentage: 0 },
      ]
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Clock className="w-4 h-4 text-accent" />;
      case 'upcoming':
        return <AlertCircle className="w-4 h-4 text-warning" />;
      case 'ended':
        return <CheckCircle className="w-4 h-4 text-muted-foreground" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-accent text-accent-foreground';
      case 'upcoming':
        return 'bg-warning text-warning-foreground';
      case 'ended':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted';
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <MetaMaskConnection />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-card shadow-card hover:shadow-trust transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Elections</p>
                <p className="text-2xl font-bold text-accent">2</p>
              </div>
              <Vote className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card hover:shadow-trust transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Votes Cast</p>
                <p className="text-2xl font-bold text-trust">1,247</p>
              </div>
              <BarChart3 className="w-8 h-8 text-trust" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card hover:shadow-trust transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Registered Voters</p>
                <p className="text-2xl font-bold text-primary">2,650</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card hover:shadow-trust transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Participation Rate</p>
                <p className="text-2xl font-bold text-accent">47.1%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard */}
      <Tabs defaultValue="elections" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="elections">Elections</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <CreateElectionModal />
        </div>

        <TabsContent value="elections" className="space-y-6">
          <div className="grid gap-6">
            {elections.map((election) => (
              <Card key={election.id} className="bg-gradient-card shadow-card hover:shadow-cyber transition-all duration-300 border-border/50">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-xl">{election.title}</CardTitle>
                      <CardDescription>{election.description}</CardDescription>
                    </div>
                    <Badge className={`${getStatusColor(election.status)} gap-1`}>
                      {getStatusIcon(election.status)}
                      {election.status.charAt(0).toUpperCase() + election.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Election Info */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Start Date</p>
                      <p className="font-medium">{election.startDate.toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">End Date</p>
                      <p className="font-medium">{election.endDate.toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Votes</p>
                      <p className="font-medium">{election.totalVotes.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Turnout</p>
                      <p className="font-medium">
                        {((election.totalVotes / election.totalVoters) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  {/* Candidates */}
                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Candidates
                    </h4>
                    <div className="space-y-3">
                      {election.candidates.map((candidate) => (
                        <div key={candidate.id} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <div>
                              <p className="font-medium">{candidate.name}</p>
                              <p className="text-muted-foreground">{candidate.description}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">{candidate.votes} votes</p>
                              <p className="text-xs text-muted-foreground">{candidate.percentage}%</p>
                            </div>
                          </div>
                          <Progress value={candidate.percentage} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    {election.status === 'active' && (
                      <VotingModal
                        election={election}
                        trigger={
                          <Button variant="trust" className="gap-2 shadow-glow">
                            <Vote className="w-4 h-4" />
                            Vote Now
                          </Button>
                        }
                      />
                    )}
                    <Button variant="outline" className="gap-2">
                      <Shield className="w-4 h-4" />
                      View on Blockchain
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          <Card className="bg-gradient-card shadow-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Election Results
              </CardTitle>
              <CardDescription>
                Transparent and immutable voting results stored on the blockchain
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                Detailed results and analytics will be displayed here
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {elections.length > 0 && (
            <ElectionAnalytics election={elections[0]} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VotingDashboard;