import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, MapPin, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Disasters() {
  const navigate = useNavigate();
  const { disasters, addDisaster, updateDisaster } = useApp();
  const { toast } = useToast();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [status, setStatus] = useState<'active' | 'resolved'>('active');

  const handleAddDisaster = () => {
    addDisaster({
      name,
      location,
      description,
      severity,
      status,
    });

    toast({
      title: 'Disaster Added',
      description: 'New disaster has been added to the system.',
    });

    setIsAddDialogOpen(false);
    setName('');
    setLocation('');
    setDescription('');
    setSeverity('medium');
    setStatus('active');
  };

  const handleUpdateStatus = (id: string, newStatus: 'active' | 'resolved') => {
    updateDisaster(id, { status: newStatus });
    toast({
      title: 'Status Updated',
      description: `Disaster status has been updated to ${newStatus}.`,
    });
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge className="bg-destructive">Critical</Badge>;
      case 'high':
        return <Badge className="bg-warning">High</Badge>;
      case 'medium':
        return <Badge className="bg-primary">Medium</Badge>;
      default:
        return <Badge variant="outline">Low</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/admin/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Disaster Management</h1>
            <p className="text-muted-foreground">Track and manage active disasters</p>
          </div>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Disaster
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Disaster</DialogTitle>
              <DialogDescription>Create a new disaster record in the system</DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Disaster Name</label>
                <Input
                  placeholder="e.g., Flood in Downtown Area"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Location</label>
                <Input
                  placeholder="City or region"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Textarea
                  placeholder="Describe the disaster situation..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Severity</label>
                <Select value={severity} onValueChange={(value: any) => setSeverity(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <Select value={status} onValueChange={(value: any) => setStatus(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddDisaster}>Add Disaster</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {disasters.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">No disasters recorded. Add one to get started.</p>
            </CardContent>
          </Card>
        ) : (
          disasters.map((disaster) => (
            <Card key={disaster.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-destructive" />
                      <CardTitle>{disaster.name}</CardTitle>
                      {getSeverityBadge(disaster.severity)}
                      <Badge variant={disaster.status === 'active' ? 'default' : 'outline'}>
                        {disaster.status}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {disaster.location}
                    </CardDescription>
                  </div>
                  
                  {disaster.status === 'active' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateStatus(disaster.id, 'resolved')}
                    >
                      Mark as Resolved
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{disaster.description}</p>
                <p className="text-xs text-muted-foreground mt-4">
                  Created: {new Date(disaster.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
