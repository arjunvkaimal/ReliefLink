import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';

const Donate = () => {
  const [selectedFundraiser, setSelectedFundraiser] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'money' | 'resource'>('money');
  const [resourceName, setResourceName] = useState('');
  const { currentUser, addDonation, fundraisers } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const approvedFundraisers = fundraisers.filter((f) => f.status === 'approved');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFundraiser) {
      toast({
        title: 'Error',
        description: 'Please select a campaign',
        variant: 'destructive',
      });
      return;
    }

    addDonation({
      userId: currentUser!.id,
      fundraiserId: selectedFundraiser,
      amount: parseFloat(amount),
      type,
      resourceName: type === 'resource' ? resourceName : undefined,
    });

    toast({
      title: 'Donation successful',
      description: 'Thank you for your contribution!',
    });

    setAmount('');
    setResourceName('');
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-4xl">
        <Link to="/dashboard">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Make a Donation</CardTitle>
              <CardDescription>Support active relief campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fundraiser">Select Campaign</Label>
                  <Select value={selectedFundraiser} onValueChange={setSelectedFundraiser}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a campaign" />
                    </SelectTrigger>
                    <SelectContent>
                      {approvedFundraisers.map((f) => (
                        <SelectItem key={f.id} value={f.id}>
                          {f.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Donation Type</Label>
                  <Select value={type} onValueChange={(value: 'money' | 'resource') => setType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="money">Money</SelectItem>
                      <SelectItem value="resource">Resource</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">{type === 'money' ? 'Amount ($)' : 'Quantity'}</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>

                {type === 'resource' && (
                  <div className="space-y-2">
                    <Label htmlFor="resourceName">Resource Name</Label>
                    <Input
                      id="resourceName"
                      placeholder="e.g., Water bottles, Blankets"
                      value={resourceName}
                      onChange={(e) => setResourceName(e.target.value)}
                      required
                    />
                  </div>
                )}

                <Button type="submit" className="w-full">
                  Donate Now
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h3 className="text-xl font-bold">Active Campaigns</h3>
            {approvedFundraisers.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No active campaigns at the moment
                </CardContent>
              </Card>
            ) : (
              approvedFundraisers.map((fundraiser) => {
                const progress = (fundraiser.currentAmount / fundraiser.goalAmount) * 100;
                return (
                  <Card key={fundraiser.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{fundraiser.title}</CardTitle>
                      <CardDescription>{fundraiser.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>${fundraiser.currentAmount.toLocaleString()}</span>
                          <span>${fundraiser.goalAmount.toLocaleString()}</span>
                        </div>
                        <Progress value={progress} />
                        <p className="text-xs text-muted-foreground">
                          {progress.toFixed(1)}% funded
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donate;
