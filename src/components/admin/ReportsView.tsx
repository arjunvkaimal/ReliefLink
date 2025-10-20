// @ts-nocheck
// @ts-nocheck
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, RefreshCw, FileText, User, Calendar } from "lucide-react";

export function ReportsView() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchReports = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('reports')
      .select(`
        *,
        profiles:user_id (
          id,
          name,
          contact
        )
      `)
      .order('report_date', { ascending: false });

    if (error) {
      console.error('Error fetching reports:', error);
      toast({
        title: "Error",
        description: "Failed to load reports",
        variant: "destructive",
      });
      setReports([]);
    } else {
      setReports(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground mb-4">No field reports submitted yet</p>
        <Button onClick={fetchReports} variant="outline">
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
          Total Reports: {reports.length}
        </p>
        <Button onClick={fetchReports} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        {reports.map((report) => (
          <Card key={report.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    {report.report_type || 'Field Report'}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-4 mt-2">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {report.profiles?.name || 'Anonymous'}
                    </span>
                    {report.report_date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(report.report_date).toLocaleDateString()}
                      </span>
                    )}
                  </CardDescription>
                </div>
                <Badge variant="outline">
                  {report.report_type || 'General'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {report.report && (
                <p className="text-sm text-gray-700">{report.report}</p>
              )}
              {report.profiles?.contact && (
                <div className="text-xs text-muted-foreground border-t pt-2 mt-2">
                  Contact: {report.profiles.contact}
                </div>
              )}
              {(report.request_id || report.volunteer_id) && (
                <div className="text-xs text-muted-foreground flex gap-3">
                  {report.request_id && (
                    <span>Request: {report.request_id.substring(0, 8)}...</span>
                  )}
                  {report.volunteer_id && (
                    <span>Volunteer: {report.volunteer_id.substring(0, 8)}...</span>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
