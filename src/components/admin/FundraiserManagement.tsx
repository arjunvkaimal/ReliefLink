import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Loader2, RefreshCw, Plus, DollarSign } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";

interface Fundraiser {
  id: string;
  title: string;
  description: string | null;
  goal_amount: number | null;
  raised_amount: number | null;
  status: "active" | "completed" | "cancelled";
  created_at: string | null;
  created_by: string | null;
  start_date: string | null;
  end_date: string | null;
}

export function FundraiserManagement() {
  const [fundraisers, setFundraisers] = useState<Fundraiser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goal_amount: "",
    end_date: "",
  });
  const { toast } = useToast();

  const fetchFundraisers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('fundraisers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load fundraisers",
        variant: "destructive",
      });
    } else {
      setFundraisers(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFundraisers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase.from('fundraisers').insert({
      title: formData.title,
      description: formData.description,
      goal_amount: parseFloat(formData.goal_amount) || 0,
      raised_amount: 0,
      status: 'active',
      created_by: user?.id || null,
      start_date: new Date().toISOString(),
      end_date: formData.end_date || null,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create fundraiser",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Fundraiser created successfully",
      });
      setIsDialogOpen(false);
      setFormData({ title: "", description: "", goal_amount: "", end_date: "" });
      fetchFundraisers();
    }
  };

  const calculateProgress = (raised: number | null, goal: number | null) => {
    if (!raised || !goal || goal === 0) return 0;
    return Math.min((raised / goal) * 100, 100);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Total: {fundraisers.length} | Active: {fundraisers.filter(f => f.status === 'active').length}
        </p>
        <div className="flex gap-2">
          <Button onClick={fetchFundraisers} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Create Fundraiser
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Fundraiser</DialogTitle>
                <DialogDescription>
                  Create a new fundraising campaign
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Campaign Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Flood Relief Fund 2025"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe the fundraiser purpose"
                      rows={3}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="goal_amount">Goal Amount ($)</Label>
                    <Input
                      id="goal_amount"
                      type="number"
                      step="0.01"
                      value={formData.goal_amount}
                      onChange={(e) => setFormData({ ...formData, goal_amount: e.target.value })}
                      placeholder="e.g., 50000"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="end_date">End Date (Optional)</Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Create Fundraiser</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {fundraisers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No fundraisers yet</p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create First Fundraiser
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Goal</TableHead>
                <TableHead>Raised</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fundraisers.map((fundraiser) => (
                <TableRow key={fundraiser.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{fundraiser.title}</div>
                      {fundraiser.description && (
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {fundraiser.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />
                      {fundraiser.goal_amount?.toLocaleString() || 0}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />
                      {fundraiser.raised_amount?.toLocaleString() || 0}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="w-24">
                      <Progress
                        value={calculateProgress(fundraiser.raised_amount, fundraiser.goal_amount)}
                      />
                      <div className="text-xs text-muted-foreground mt-1">
                        {calculateProgress(fundraiser.raised_amount, fundraiser.goal_amount).toFixed(0)}%
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={fundraiser.status} />
                  </TableCell>
                  <TableCell>
                    {fundraiser.start_date
                      ? new Date(fundraiser.start_date).toLocaleDateString()
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {fundraiser.end_date
                      ? new Date(fundraiser.end_date).toLocaleDateString()
                      : 'No end date'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
