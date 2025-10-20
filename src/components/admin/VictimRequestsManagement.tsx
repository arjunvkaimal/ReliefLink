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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { Loader2, RefreshCw } from "lucide-react";

type RequestStatus = "completed" | "pending" | "approved" | "in_progress" | "rejected";

interface VictimRequest {
  id: string;
  user_id: string;
  location: string;
  description: string;
  urgent_needs: string | null;
  status: RequestStatus;
  request_date: string | null;
  updated_at: string | null;
  profiles: {
    name: string;
    contact: string | null;
  } | null;
}

export function VictimRequestsManagement() {
  const [requests, setRequests] = useState<VictimRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchRequests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('victim_requests')
      .select(`
        *,
        profiles:user_id (
          name,
          contact
        )
      `)
      .order('request_date', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load requests",
        variant: "destructive",
      });
    } else {
      setRequests(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateStatus = async (requestId: string, newStatus: RequestStatus) => {
    const { error } = await supabase
      .from('victim_requests')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', requestId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Request status updated",
      });
      fetchRequests();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">No victim requests yet</p>
        <Button onClick={fetchRequests} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Total Requests: {requests.length}
        </p>
        <Button onClick={fetchRequests} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Requester</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Urgent Needs</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{request.profiles?.name || 'Unknown'}</div>
                    <div className="text-sm text-muted-foreground">
                      {request.profiles?.contact || 'No contact'}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{request.location}</TableCell>
                <TableCell className="max-w-xs truncate">{request.description}</TableCell>
                <TableCell>{request.urgent_needs || 'None specified'}</TableCell>
                <TableCell>
                  <StatusBadge status={request.status} />
                </TableCell>
                <TableCell>
                  {request.request_date
                    ? new Date(request.request_date).toLocaleDateString()
                    : 'N/A'}
                </TableCell>
                <TableCell>
                  <Select
                    value={request.status}
                    onValueChange={(value) => updateStatus(request.id, value as RequestStatus)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
