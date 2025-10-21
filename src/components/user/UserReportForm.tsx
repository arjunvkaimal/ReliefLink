// @ts-nocheck
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, FileText } from "lucide-react";

export const UserReportForm = ({ onSuccess }) => {
  const [reportTitle, setReportTitle] = useState("");
  const [reportText, setReportText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("You must be logged in to submit a report");
      }

      const { error } = await supabase.from("reports").insert({
        user_id: user.id,
        report: reportText,
        report_type: reportTitle || "Field Report",
        report_date: new Date().toISOString(),
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Report submitted successfully",
      });

      setReportTitle("");
      setReportText("");
      
      if (onSuccess) onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit report",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="reportTitle">Report Title/Type</Label>
          <Input
            id="reportTitle"
            value={reportTitle}
            onChange={(e) => setReportTitle(e.target.value)}
            placeholder="e.g., Food Distribution Report, Medical Aid Report"
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="reportText">Report Details</Label>
          <Textarea
            id="reportText"
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
            placeholder="Describe your activities, resources distributed, people helped, observations, etc."
            rows={6}
            required
          />
          <p className="text-xs text-muted-foreground">
            Include details about volunteer activities, resources distributed, challenges faced, etc.
          </p>
        </div>

        <Button type="submit" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Report"
          )}
        </Button>
      </div>
    </form>
  );
};
