import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminFundraisers = () => {
  const { fundraisers, addFundraiser, updateFundraiser, donations } = useApp();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addFundraiser({
      title,
      description,
      goalAmount: parseFloat(goalAmount),
      endDate,
      status: 'pending',
    });

    toast({
      title: 'Fundraiser created',
      description: 'New fundraiser has been created',
    });

    setTitle('');
    setDescription('');
    setGoalAmount('');
    setEndDate('');
    setIsOpen(false);
  };

  const updateStatus = (fundraiserId: string, status: 'approved' | 'rejected') => {
    updateFundraiser(fundraiserId, { status });
    toast({
      title: 'Fundraiser updated',
      description: `Fundraiser ${status}`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Fundraiser Management</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-4">
          <Link to="/admin">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Fundraiser
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Fundraiser</DialogTitle>
                <DialogDescription>Create a new fundraising campaign</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Campaign Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goalAmount">Goal Amount ($)</Label>
                  <Input
                    id="goalAmount"
                    type="number"
                    min="1"
                    value={goalAmount}
                    onChange={(e) => setGoalAmount(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Create Fundraiser
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          {fundraisers.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No fundraisers found
              </CardContent>
            </Card>
          ) : (
            fundraisers.map((fundraiser) => {
              const progress = (fundraiser.currentAmount / fundraiser.goalAmount) * 100;
              const fundraiserDonations = donations.filter((d) => d.fundraiserId === fundraiser.id);

              return (
                <Card key={fundraiser.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{fundraiser.title}</CardTitle>
                        <CardDescription>{fundraiser.description}</CardDescription>
                      </div>
                      <Badge
                        variant={
                          fundraiser.status === 'approved'
                            ? 'default'
                            : fundraiser.status === 'rejected'
                            ? 'destructive'
                            : 'secondary'
                        }
                      >
                        {fundraiser.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>${fundraiser.currentAmount.toLocaleString()}</span>
                          <span>${fundraiser.goalAmount.toLocaleString()}</span>
                        </div>
                        <Progress value={progress} />
                        <p className="text-xs text-muted-foreground mt-1">
                          {progress.toFixed(1)}% funded • {fundraiserDonations.length} donations
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div>
                          <span className="font-medium">End Date: </span>
                          {new Date(fundraiser.endDate).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-medium">Created: </span>
                          {new Date(fundraiser.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      {fundraiser.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => updateStatus(fundraiser.id, 'approved')}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => updateStatus(fundraiser.id, 'rejected')}
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminFundraisers;
