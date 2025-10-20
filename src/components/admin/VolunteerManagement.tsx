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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, CheckCircle, XCircle } from "lucide-react";

interface Volunteer {
  id: string;
  user_id: string;
  skills: string[];
  location: string | null;
  availability: string | null;
  is_active: boolean | null;
  created_at: string | null;
  profiles: {
    name: string;
    contact: string | null;
  } | null;
}

export function VolunteerManagement() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchVolunteers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('volunteers')
      .select(`
        *,
        profiles:user_id (
          name,
          contact
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load volunteers",
        variant: "destructive",
      });
    } else {
      setVolunteers(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const toggleActive = async (volunteerId: string, currentStatus: boolean | null) => {
    const { error } = await supabase
      .from('volunteers')
      .update({ is_active: !currentStatus })
      .eq('id', volunteerId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Volunteer status updated",
      });
      fetchVolunteers();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (volunteers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">No volunteers registered yet</p>
        <Button onClick={fetchVolunteers} variant="outline">
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
          Total Volunteers: {volunteers.length} | Active: {volunteers.filter(v => v.is_active).length}
        </p>
        <Button onClick={fetchVolunteers} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Skills</TableHead>
              <TableHead>Availability</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {volunteers.map((volunteer) => (
              <TableRow key={volunteer.id}>
                <TableCell className="font-medium">
                  {volunteer.profiles?.name || 'Unknown'}
                </TableCell>
                <TableCell>{volunteer.profiles?.contact || 'N/A'}</TableCell>
                <TableCell>{volunteer.location || 'Not specified'}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {volunteer.skills?.slice(0, 3).map((skill, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {volunteer.skills?.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{volunteer.skills.length - 3}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>{volunteer.availability || 'Not specified'}</TableCell>
                <TableCell>
                  {volunteer.is_active ? (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-gray-800">
                      <XCircle className="w-3 h-3 mr-1" />
                      Inactive
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant={volunteer.is_active ? "outline" : "default"}
                    onClick={() => toggleActive(volunteer.id, volunteer.is_active)}
                  >
                    {volunteer.is_active ? 'Deactivate' : 'Activate'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
