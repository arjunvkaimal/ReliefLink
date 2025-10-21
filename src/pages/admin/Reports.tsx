// @ts-nocheck
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, FileText, Calendar, Trash2, User } from "lucide-react";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [profiles, setProfiles] = useState({});
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const { data: reportsData, error: reportsError } = await supabase
        .from("reports")
        .select("*")
        .order("report_date", { ascending: false });

      if (reportsError) throw reportsError;

      // Fetch profiles for all users
      const userIds = [...new Set(reportsData?.map(r => r.user_id) || [])];
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("*")
        .in("id", userIds);

      const profilesMap = {};
      profilesData?.forEach(p => {
        profilesMap[p.id] = p;
      });

      setProfiles(profilesMap);
      setReports(reportsData || []);
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to load reports",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reportId) => {
    if (!confirm("Are you sure you want to delete this report?")) return;

    setDeleting(reportId);
    try {
      const { error } = await supabase
        .from("reports")
        .delete()
        .eq("id", reportId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Report deleted successfully",
      });

      fetchReports();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete report",
        variant: "destructive",
      });
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Field Reports</CardTitle>
          <CardDescription>
            View all volunteer field reports ({reports.length} total)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reports.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No reports submitted yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" />
                      <h4 className="font-semibold">Field Report</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Submitted</Badge>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(report.id)}
                        disabled={deleting === report.id}
                      >
                        {deleting === report.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 mb-3 whitespace-pre-wrap">
                    {report.report}
                  </p>

                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {profiles[report.user_id]?.name || "Unknown User"}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(report.report_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
