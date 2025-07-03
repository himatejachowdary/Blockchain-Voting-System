import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Vote,
  Clock,
  Shield,
  Globe,
  Eye
} from 'lucide-react';

interface ElectionAnalyticsProps {
  election: {
    id: string;
    title: string;
    totalVotes: number;
    totalVoters: number;
    candidates: Array<{
      id: string;
      name: string;
      votes: number;
      percentage: number;
    }>;
  };
}

const ElectionAnalytics: React.FC<ElectionAnalyticsProps> = ({ election }) => {
  const [timeRange, setTimeRange] = useState('24h');

  // Mock data for analytics
  const hourlyVotes = [
    { hour: '00:00', votes: 45 },
    { hour: '04:00', votes: 23 },
    { hour: '08:00', votes: 89 },
    { hour: '12:00', votes: 156 },
    { hour: '16:00', votes: 234 },
    { hour: '20:00', votes: 189 },
  ];

  const geographicData = [
    { region: 'North America', votes: 456, percentage: 36.6 },
    { region: 'Europe', votes: 312, percentage: 25.0 },
    { region: 'Asia', votes: 289, percentage: 23.2 },
    { region: 'Other', votes: 190, percentage: 15.2 },
  ];

  const voterDemographics = [
    { age: '18-25', count: 234 },
    { age: '26-35', count: 456 },
    { age: '36-45', count: 312 },
    { age: '46-55', count: 167 },
    { age: '55+', count: 78 },
  ];

  const COLORS = ['hsl(210, 100%, 60%)', 'hsl(260, 100%, 60%)', 'hsl(120, 100%, 50%)', 'hsl(25, 100%, 55%)', 'hsl(0, 100%, 55%)'];

  const turnoutRate = (election.totalVotes / election.totalVoters) * 100;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-card shadow-glow border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Votes</p>
                <p className="text-2xl font-bold text-primary">{election.totalVotes.toLocaleString()}</p>
              </div>
              <Vote className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-glow border-accent/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Turnout Rate</p>
                <p className="text-2xl font-bold text-accent">{turnoutRate.toFixed(1)}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-glow border-trust/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Eligible Voters</p>
                <p className="text-2xl font-bold text-trust">{election.totalVoters.toLocaleString()}</p>
              </div>
              <Users className="w-8 h-8 text-trust" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-glow border-warning/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Candidates</p>
                <p className="text-2xl font-bold text-warning">{election.candidates.length}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="results" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
        </TabsList>

        <TabsContent value="results" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Vote Distribution */}
            <Card className="bg-gradient-card shadow-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Vote Distribution
                </CardTitle>
                <CardDescription>Current vote counts by candidate</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={election.candidates}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="votes"
                    >
                      {election.candidates.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => [`${value} votes`, 'Votes']} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {election.candidates.map((candidate, index) => (
                    <div key={candidate.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-sm font-medium">{candidate.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold">{candidate.votes}</div>
                        <div className="text-xs text-muted-foreground">{candidate.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Leading Candidate */}
            <Card className="bg-gradient-card shadow-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Current Leader
                </CardTitle>
                <CardDescription>Leading candidate analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Vote className="w-10 h-10 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold">{election.candidates[0]?.name}</h3>
                  <p className="text-muted-foreground">{election.candidates[0]?.percentage}% of votes</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Vote count</span>
                    <span className="font-semibold">{election.candidates[0]?.votes}</span>
                  </div>
                  <Progress value={election.candidates[0]?.percentage} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <span>Lead margin</span>
                    <span className="font-semibold">
                      {election.candidates[0]?.votes - (election.candidates[1]?.votes || 0)} votes
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card className="bg-gradient-card shadow-card border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Voting Activity Over Time
                  </CardTitle>
                  <CardDescription>Hourly voting patterns</CardDescription>
                </div>
                <div className="flex gap-2">
                  {['24h', '7d', '30d'].map((range) => (
                    <Button
                      key={range}
                      variant={timeRange === range ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTimeRange(range)}
                    >
                      {range}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={hourlyVotes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="votes" 
                    stroke="hsl(210, 100%, 60%)" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(210, 100%, 60%)', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demographics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gradient-card shadow-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Age Demographics
                </CardTitle>
                <CardDescription>Voter distribution by age group</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={voterDemographics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="age" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(210, 100%, 60%)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Geographic Distribution
                </CardTitle>
                <CardDescription>Votes by region</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {geographicData.map((region, index) => (
                  <div key={region.region} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{region.region}</span>
                      <span className="font-semibold">{region.votes} votes</span>
                    </div>
                    <Progress value={region.percentage} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="blockchain" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gradient-card shadow-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Blockchain Verification
                </CardTitle>
                <CardDescription>Smart contract and transaction details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Contract Address</span>
                    <Badge variant="outline" className="font-mono text-xs">
                      0x1234...5678
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Network</span>
                    <Badge variant="outline">Ethereum Mainnet</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Transactions</span>
                    <span className="font-semibold">{election.totalVotes}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Gas Used</span>
                    <span className="font-semibold">2.4 ETH</span>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full gap-2">
                  <Eye className="w-4 h-4" />
                  View on Etherscan
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card border-border/50">
              <CardHeader>
                <CardTitle>Security Features</CardTitle>
                <CardDescription>Built-in security and transparency measures</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/5 border border-accent/20">
                  <Shield className="w-5 h-5 text-accent" />
                  <div>
                    <p className="font-semibold text-sm">End-to-End Encryption</p>
                    <p className="text-xs text-muted-foreground">All votes are encrypted</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg bg-trust/5 border border-trust/20">
                  <Vote className="w-5 h-5 text-trust" />
                  <div>
                    <p className="font-semibold text-sm">Anonymous Voting</p>
                    <p className="text-xs text-muted-foreground">Voter privacy protected</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold text-sm">Immutable Records</p>
                    <p className="text-xs text-muted-foreground">Cannot be tampered with</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ElectionAnalytics;