import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Shield,
  LogOut,
  AlertCircle,
  Heart,
  Users,
  FileText
} from "lucide-react";
import { VictimRequestForm } from "@/components/user/VictimRequestForm";
import { VolunteerRegistrationForm } from "@/components/user/VolunteerRegistrationForm";
import { VolunteerCallBoard } from "@/components/user/VolunteerCallBoard";
import { DonationForm } from "@/components/user/DonationForm";
import { UserRequestsList } from "@/components/user/UserRequestsList";
import { UserDonationsList } from "@/components/user/UserDonationsList";
import { UserVolunteerStatus } from "@/components/user/UserVolunteerStatus";
import { UserReportForm } from "@/components/user/UserReportForm";
import { UserReportsList } from "@/components/user/UserReportsList";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshReports, setRefreshReports] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    setUser(session.user);

    // Check if user has admin role
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("*")
      .eq("user_id", session.user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (roleData) {
      navigate("/admin");
      return;
    }

    // Fetch profile
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    setProfile(profileData);
    setLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
    toast({
      title: "Signed out successfully",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">User Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {profile?.name || user?.email}
            </span>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="requests" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="requests">Requests</TabsTrigger>
            <TabsTrigger value="volunteer">Volunteer</TabsTrigger>
            <TabsTrigger value="calls">Calls</TabsTrigger>
            <TabsTrigger value="donate">Donate</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Requests Tab */}
          <TabsContent value="requests" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Submit Help Request
                </CardTitle>
                <CardDescription>
                  Request assistance during emergencies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <VictimRequestForm userId={user?.id} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Requests</CardTitle>
                <CardDescription>
                  Track your submitted help requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserRequestsList userId={user?.id} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Volunteer Tab */}
          <TabsContent value="volunteer" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Volunteer Registration
                </CardTitle>
                <CardDescription>
                  Register as a volunteer and help others
                </CardDescription>
              </CardHeader>
              <CardContent>
                <VolunteerRegistrationForm userId={user?.id} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Volunteer Status</CardTitle>
                <CardDescription>
                  View your volunteer profile and applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserVolunteerStatus userId={user?.id} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Calls Tab */}
          <TabsContent value="calls" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Active Volunteer Calls
                </CardTitle>
                <CardDescription>
                  Apply for disaster relief volunteer opportunities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <VolunteerCallBoard userId={user?.id} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Donate Tab */}
          <TabsContent value="donate" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Make a Donation
                </CardTitle>
                <CardDescription>
                  Support active relief campaigns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DonationForm userId={user?.id} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Donations</CardTitle>
                <CardDescription>
                  View your contribution history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserDonationsList userId={user?.id} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Submit Field Report
                </CardTitle>
                <CardDescription>
                  Report your volunteer activities and observations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserReportForm onSuccess={() => setRefreshReports(prev => prev + 1)} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Reports</CardTitle>
                <CardDescription>
                  View your submitted field reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserReportsList refreshTrigger={refreshReports} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default UserDashboard;
