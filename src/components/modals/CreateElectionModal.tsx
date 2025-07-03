import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useWeb3 } from '@/contexts/Web3Context';
import { toast } from '@/hooks/use-toast';
import { 
  PlusCircle, 
  Calendar, 
  Users, 
  Shield,
  AlertTriangle,
  Zap,
  CheckCircle2
} from 'lucide-react';

interface CreateElectionProps {
  onElectionCreated?: (election: any) => void;
}

const CreateElectionModal: React.FC<CreateElectionProps> = ({ onElectionCreated }) => {
  const { isConnected, account, web3 } = useWeb3();
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    candidates: ['', ''],
    voterRegistration: 'open', // open, restricted, whitelist
    maxVoters: '',
  });

  const addCandidate = () => {
    setFormData(prev => ({
      ...prev,
      candidates: [...prev.candidates, '']
    }));
  };

  const removeCandidate = (index: number) => {
    if (formData.candidates.length > 2) {
      setFormData(prev => ({
        ...prev,
        candidates: prev.candidates.filter((_, i) => i !== index)
      }));
    }
  };

  const updateCandidate = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      candidates: prev.candidates.map((candidate, i) => 
        i === index ? value : candidate
      )
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) return 'Election title is required';
    if (!formData.description.trim()) return 'Description is required';
    if (!formData.startDate) return 'Start date is required';
    if (!formData.endDate) return 'End date is required';
    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      return 'End date must be after start date';
    }
    if (formData.candidates.some(c => !c.trim())) {
      return 'All candidate names are required';
    }
    return null;
  };

  const createElection = async () => {
    const validationError = validateForm();
    if (validationError) {
      toast({
        title: "Validation Error",
        description: validationError,
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    try {
      // Simulate smart contract deployment
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const newElection = {
        id: Date.now().toString(),
        ...formData,
        creator: account,
        status: 'upcoming',
        totalVotes: 0,
        contractAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
        createdAt: new Date(),
      };

      toast({
        title: "Election Created Successfully!",
        description: `"${formData.title}" has been deployed to the blockchain.`,
      });

      onElectionCreated?.(newElection);
      setIsOpen(false);
      setFormData({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        candidates: ['', ''],
        voterRegistration: 'open',
        maxVoters: '',
      });
    } catch (error) {
      toast({
        title: "Creation Failed",
        description: "Failed to deploy election smart contract",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  if (!isConnected) {
    return (
      <Button variant="outline" disabled className="gap-2">
        <PlusCircle className="w-4 h-4" />
        Connect Wallet to Create
      </Button>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="blockchain" className="gap-2 shadow-glow">
          <PlusCircle className="w-4 h-4" />
          Create Election
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-card border-primary/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary-foreground" />
            </div>
            Create New Election
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Security Notice */}
          <Alert className="border-primary/20 bg-primary/5">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Your election will be deployed as a smart contract on the blockchain, ensuring transparency and immutability.
            </AlertDescription>
          </Alert>

          {/* Basic Information */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Election Details</CardTitle>
              <CardDescription>Basic information about your election</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Election Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Student Council President 2024"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-input border-border/50"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the purpose and scope of this election..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-input border-border/50 min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    className="bg-input border-border/50"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    className="bg-input border-border/50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Candidates */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5" />
                Candidates
              </CardTitle>
              <CardDescription>Add candidates for this election</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.candidates.map((candidate, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Candidate ${index + 1} name`}
                    value={candidate}
                    onChange={(e) => updateCandidate(index, e.target.value)}
                    className="bg-input border-border/50"
                  />
                  {formData.candidates.length > 2 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeCandidate(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                onClick={addCandidate}
                className="w-full"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Candidate
              </Button>
            </CardContent>
          </Card>

          {/* Voting Configuration */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Voting Configuration</CardTitle>
              <CardDescription>Configure voter access and limits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label>Voter Registration</Label>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { value: 'open', label: 'Open to All', description: 'Anyone can vote' },
                    { value: 'restricted', label: 'Restricted', description: 'Limited voter count' },
                    { value: 'whitelist', label: 'Whitelist Only', description: 'Pre-approved voters' }
                  ].map((option) => (
                    <Badge
                      key={option.value}
                      variant={formData.voterRegistration === option.value ? "default" : "outline"}
                      className={`cursor-pointer p-2 ${
                        formData.voterRegistration === option.value 
                          ? 'bg-primary text-primary-foreground' 
                          : 'hover:bg-accent'
                      }`}
                      onClick={() => setFormData(prev => ({ 
                        ...prev, 
                        voterRegistration: option.value as any 
                      }))}
                    >
                      {option.label}
                    </Badge>
                  ))}
                </div>
              </div>

              {formData.voterRegistration === 'restricted' && (
                <div className="space-y-2">
                  <Label htmlFor="maxVoters">Maximum Voters</Label>
                  <Input
                    id="maxVoters"
                    type="number"
                    placeholder="e.g., 1000"
                    value={formData.maxVoters}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxVoters: e.target.value }))}
                    className="bg-input border-border/50"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cost Estimate */}
          <Alert className="border-accent/20 bg-accent/5">
            <Zap className="h-4 w-4" />
            <AlertDescription>
              <div className="flex justify-between items-center">
                <span>Estimated deployment cost: ~0.05 ETH</span>
                <Badge variant="outline">Gas fees included</Badge>
              </div>
            </AlertDescription>
          </Alert>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="blockchain"
              onClick={createElection}
              disabled={isCreating}
              className="flex-1 gap-2"
            >
              {isCreating ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Deploying...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Deploy Election
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateElectionModal;