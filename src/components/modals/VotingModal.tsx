import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useWeb3 } from '@/contexts/Web3Context';
import { toast } from '@/hooks/use-toast';
import { 
  Vote, 
  Shield, 
  Clock, 
  Users,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Zap
} from 'lucide-react';

interface Candidate {
  id: string;
  name: string;
  description: string;
  votes: number;
  percentage: number;
}

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
  contractAddress?: string;
}

interface VotingModalProps {
  election: Election;
  trigger: React.ReactNode;
  onVoteSubmitted?: (electionId: string, candidateId: string) => void;
}

const VotingModal: React.FC<VotingModalProps> = ({ 
  election, 
  trigger, 
  onVoteSubmitted 
}) => {
  const { isConnected, account, web3 } = useWeb3();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<string>('');
  const [isVoting, setIsVoting] = useState(false);
  const [voteConfirmed, setVoteConfirmed] = useState(false);

  const canVote = election.status === 'active' && isConnected;
  const timeRemaining = election.endDate.getTime() - Date.now();
  const hoursRemaining = Math.max(0, Math.floor(timeRemaining / (1000 * 60 * 60)));

  const submitVote = async () => {
    if (!selectedCandidate) {
      toast({
        title: "No Candidate Selected",
        description: "Please select a candidate before voting.",
        variant: "destructive"
      });
      return;
    }

    setIsVoting(true);
    try {
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const selectedCandidateName = election.candidates.find(
        c => c.id === selectedCandidate
      )?.name;

      toast({
        title: "Vote Submitted Successfully!",
        description: `Your vote for ${selectedCandidateName} has been recorded on the blockchain.`,
      });

      setVoteConfirmed(true);
      onVoteSubmitted?.(election.id, selectedCandidate);
      
      setTimeout(() => {
        setIsOpen(false);
        setVoteConfirmed(false);
        setSelectedCandidate('');
      }, 2000);

    } catch (error) {
      toast({
        title: "Vote Failed",
        description: "Failed to submit vote to blockchain",
        variant: "destructive"
      });
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-gradient-card border-primary/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
              <Vote className="w-4 h-4 text-primary-foreground" />
            </div>
            Cast Your Vote
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Election Info */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">{election.title}</CardTitle>
              <CardDescription>{election.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{election.totalVotes}</div>
                  <div className="text-muted-foreground">Total Votes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">{hoursRemaining}h</div>
                  <div className="text-muted-foreground">Remaining</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-trust">
                    {((election.totalVotes / election.totalVoters) * 100).toFixed(1)}%
                  </div>
                  <div className="text-muted-foreground">Turnout</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <Alert className="border-primary/20 bg-primary/5">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <div className="flex items-center justify-between">
                <span>Your vote is encrypted and anonymous</span>
                <Badge variant="outline" className="gap-1">
                  <Lock className="w-3 h-3" />
                  End-to-End Encrypted
                </Badge>
              </div>
            </AlertDescription>
          </Alert>

          {!canVote ? (
            <Alert className="border-destructive/20 bg-destructive/5">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {!isConnected 
                  ? "Please connect your wallet to vote"
                  : election.status === 'upcoming' 
                    ? "Voting has not started yet"
                    : "Voting has ended"
                }
              </AlertDescription>
            </Alert>
          ) : voteConfirmed ? (
            <Card className="bg-gradient-trust border-accent/20">
              <CardContent className="flex items-center justify-center py-8">
                <div className="text-center space-y-3">
                  <CheckCircle2 className="w-16 h-16 text-accent mx-auto" />
                  <h3 className="text-xl font-semibold text-accent-foreground">Vote Confirmed!</h3>
                  <p className="text-accent-foreground/80">Your vote has been recorded on the blockchain</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Candidate Selection */}
              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Select Your Candidate
                  </CardTitle>
                  <CardDescription>Choose one candidate to cast your vote</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={selectedCandidate} onValueChange={setSelectedCandidate}>
                    <div className="space-y-4">
                      {election.candidates.map((candidate) => (
                        <div key={candidate.id} className="relative">
                          <div className="flex items-center space-x-3 p-4 rounded-lg border border-border/50 hover:border-primary/50 transition-colors cursor-pointer">
                            <RadioGroupItem value={candidate.id} id={candidate.id} />
                            <Label 
                              htmlFor={candidate.id} 
                              className="flex-1 cursor-pointer"
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <h4 className="font-semibold">{candidate.name}</h4>
                                  <p className="text-sm text-muted-foreground">{candidate.description}</p>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm font-medium">{candidate.votes} votes</div>
                                  <div className="text-xs text-muted-foreground">{candidate.percentage}%</div>
                                </div>
                              </div>
                              <Progress value={candidate.percentage} className="mt-2 h-1" />
                            </Label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Voting Cost */}
              <Alert className="border-accent/20 bg-accent/5">
                <Zap className="h-4 w-4" />
                <AlertDescription>
                  <div className="flex justify-between items-center">
                    <span>Transaction fee: ~0.001 ETH</span>
                    <Badge variant="outline">Gas optimized</Badge>
                  </div>
                </AlertDescription>
              </Alert>

              {/* Vote Button */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="trust"
                  onClick={submitVote}
                  disabled={!selectedCandidate || isVoting}
                  className="flex-1 gap-2 shadow-glow"
                >
                  {isVoting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-trust-foreground border-t-transparent rounded-full animate-spin" />
                      Submitting Vote...
                    </>
                  ) : (
                    <>
                      <Vote className="w-4 h-4" />
                      Cast Vote
                    </>
                  )}
                </Button>
              </div>
            </>
          )}

          {/* Blockchain Info */}
          {election.contractAddress && (
            <div className="text-center text-xs text-muted-foreground space-y-1">
              <p>Smart Contract: {election.contractAddress}</p>
              <p>Network: Ethereum Mainnet</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VotingModal;