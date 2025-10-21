// @ts-nocheck
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Loader2, 
  RefreshCw, 
  Plus, 
  Calendar, 
  MapPin, 
  Users,
  Trash2,
  Eye,
  CheckCircle,
  XCircle
} from "lucide-react";
import { PriorityBadge } from "@/components/PriorityBadge";

export const VolunteerCallManagement = () => {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedCall, setSelectedCall] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [disasterName, setDisasterName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [volunteersNeeded, setVolunteersNeeded] = useState("");
  const [priority, setPriority] = useState("medium");
  const [callDate, setCallDate] = useState("");
  
  const { toast } = useToast();

  const fetchCalls = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("volunteer_calls")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCalls(data || []);
    } catch (error) {
      console.error("Error fetching calls:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load volunteer calls",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async (callId) => {
    setLoadingApplications(true);
    setApplications([]);
    
    try {
      // Step 1: Get applications
      const { data: apps, error: appsError } = await supabase
        .from("volunteer_call_applications")
        .select("*")
        .eq("call_id", callId)
        .order("applied_at", { ascending: false });

      if (appsError) {
        console.error("Apps error:", appsError);
        throw appsError;
      }

      if (!apps || apps.length === 0) {
        setApplications([]);
        setLoadingApplications(false);
        return;
      }

      // Step 2: Get unique user IDs
      const userIds = [...new Set(apps.map(app => app.user_id).filter(Boolean))];

      if (userIds.length === 0) {
        setApplications(apps);
        setLoadingApplications(false);
        return;
      }

      // Step 3: Fetch profiles separately
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, name, email, contact")
        .in("id", userIds);

      if (profilesError) {
        console.error("Profiles error:", profilesError);
      }

      // Step 4: Merge data
      const enrichedApps = apps.map(app => {
        const profile = profiles?.find(p => p.id === app.user_id);
        return {
          ...app,
          profiles: profile || null
        };
      });

      setApplications(enrichedApps);

    } catch (error) {
      console.error("Fetch error:", error);
      setApplications([]);
    } finally {
      setLoadingApplications(false);
    }
  };

  useEffect(() => {
    fetchCalls();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { error } = await supabase.from("volunteer_calls").insert({
        disaster_name: disasterName,
        disaster_location: location,
        description: description || null,
        volunteers_needed: parseInt(volunteersNeeded) || 1,
        priority_level: priority,
        call_date: callDate || new Date().toISOString().split('T')[0],
        required_skills: [],
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Volunteer call created successfully",
      });

      setDisasterName("");
      setLocation("");
      setDescription("");
      setVolunteersNeeded("");
      setPriority("medium");
      setCallDate("");
      setIsDialogOpen(false);
      fetchCalls();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to create volunteer call",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCall = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this call? This will also delete all applications.");
    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from("volunteer_calls")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Volunteer call deleted",
      });
      fetchCalls();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete call",
        variant: "destructive",
      });
    }
  };

  const handleViewApplications = async (call) => {
    setSelectedCall(call);
    setIsViewDialogOpen(true);
    await fetchApplications(call.id);
  };

  const handleUpdateApplicationStatus = async (applicationId, newStatus) => {
    try {
      const { error } = await supabase
        .from("volunteer_call_applications")
        .update({ status: newStatus })
        .eq("id", applicationId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Application ${newStatus}`,
      });
      
      await fetchApplications(selectedCall.id);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update application",
        variant: "destructive",
      });
    }
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
          Total Calls: {calls.length}
        </p>
        <div className="flex gap-2">
          <Button onClick={fetchCalls} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Create Call
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Volunteer Call</DialogTitle>
                <DialogDescription>
                  Create a new volunteer opportunity for disaster relief
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="disasterName">Disaster Name</Label>
                    <Input
                      id="disasterName"
                      value={disasterName}
                      onChange={(e) => setDisasterName(e.target.value)}
                      placeholder="e.g., Flood Relief - Downtown"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g., Downtown District"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe the volunteer activities and requirements"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="volunteersNeeded">Volunteers Needed</Label>
                      <Input
                        id="volunteersNeeded"
                        type="number"
                        value={volunteersNeeded}
                        onChange={(e) => setVolunteersNeeded(e.target.value)}
                        placeholder="e.g., 10"
                        min="1"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="priority">Priority Level</Label>
                      <Select value={priority} onValueChange={setPriority}>
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
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="callDate">Call Date</Label>
                    <Input
                      id="callDate"
                      type="date"
                      value={callDate}
                      onChange={(e) => setCallDate(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Call"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {calls.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No volunteer calls yet</p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create First Call
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Disaster Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Volunteers Needed</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {calls.map((call) => (
                <TableRow key={call.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{call.disaster_name}</div>
                      {call.description && (
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {call.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {call.disaster_location}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {call.volunteers_needed}
                    </div>
                  </TableCell>
                  <TableCell>
                    <PriorityBadge priority={call.priority_level} />
                  </TableCell>
                  <TableCell>
                    {call.call_date ? (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(call.call_date).toLocaleDateString()}
                      </div>
                    ) : (
                      "Not set"
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewApplications(call)}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteCall(call.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Applications Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Applications for {selectedCall?.disaster_name}
            </DialogTitle>
            <DialogDescription>
              Review and manage volunteer applications for this call
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {loadingApplications ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : applications.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  No applications yet for this call
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-lg">
                        {app.profiles?.name || app.profiles?.email || "Unknown User"}
                      </p>
                      <div className="space-y-1 mt-1">
                        <p className="text-sm text-muted-foreground">
                          Applied: {new Date(app.applied_at || app.created_at).toLocaleString()}
                        </p>
                        {app.profiles?.contact && (
                          <p className="text-sm text-muted-foreground">
                            📞 {app.profiles.contact}
                          </p>
                        )}
                        {app.profiles?.email && (
                          <p className="text-sm text-muted-foreground">
                            ✉️ {app.profiles.email}
                          </p>
                        )}
                        {app.notes && (
                          <p className="text-sm text-gray-600 italic mt-2">
                            Notes: {app.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <Badge 
                        variant={
                          app.status === "accepted" ? "default" : 
                          app.status === "rejected" ? "destructive" : 
                          "secondary"
                        }
                        className="capitalize"
                      >
                        {app.status || "pending"}
                      </Badge>
                      {app.status === "pending" && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleUpdateApplicationStatus(app.id, "accepted")}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleUpdateApplicationStatus(app.id, "rejected")}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
