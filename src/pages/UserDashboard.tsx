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

export default function UserDashboard() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user is authenticated
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          navigate('/auth');
          return;
        }

        setUser(session.user);

        // Fetch user profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileData) {
          setProfile(profileData);
        }

        // Check if user is admin and redirect
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .single();

        if (roleData?.role === 'admin') {
          // Redirect admins to admin dashboard
          navigate('/admin-dashboard');
          return;
        }

        setLoading(false);
      } catch (error) {
        console.error('Error checking authentication:', error);
        navigate('/auth');
      }
    };

    checkAuth();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">ReliefLink</h1>
              <p className="text-muted-foreground">Welcome back, {profile?.name || 'User'}</p>
            </div>
          </div>
          <Button onClick={handleSignOut} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="requests" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger value="requests">
              <AlertCircle className="w-4 h-4 mr-2" />
              Requests
            </TabsTrigger>
            <TabsTrigger value="volunteer">
              <Users className="w-4 h-4 mr-2" />
              Volunteer
            </TabsTrigger>
            <TabsTrigger value="calls">
              <FileText className="w-4 h-4 mr-2" />
              Calls
            </TabsTrigger>
            <TabsTrigger value="donate">
              <Heart className="w-4 h-4 mr-2" />
              Donate
            </TabsTrigger>
          </TabsList>

          <TabsContent value="requests" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Submit Help Request</CardTitle>
                <CardDescription>Request assistance during an emergency</CardDescription>
              </CardHeader>
              <CardContent>
                <VictimRequestForm userId={user?.id} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>My Requests</CardTitle>
                <CardDescription>Track your submitted requests</CardDescription>
              </CardHeader>
              <CardContent>
                <UserRequestsList userId={user?.id} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="volunteer" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Register as Volunteer</CardTitle>
                <CardDescription>Join our volunteer network to help others</CardDescription>
              </CardHeader>
              <CardContent>
                <VolunteerRegistrationForm userId={user?.id} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>My Volunteer Status</CardTitle>
                <CardDescription>View your volunteer profile and applications</CardDescription>
              </CardHeader>
              <CardContent>
                <UserVolunteerStatus userId={user?.id} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calls" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Volunteer Opportunities</CardTitle>
                <CardDescription>Browse and apply to volunteer calls</CardDescription>
              </CardHeader>
              <CardContent>
                <VolunteerCallBoard userId={user?.id} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="donate" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Make a Donation</CardTitle>
                <CardDescription>Support relief efforts with your contribution</CardDescription>
              </CardHeader>
              <CardContent>
                <DonationForm userId={user?.id} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>My Donations</CardTitle>
                <CardDescription>View your donation history</CardDescription>
              </CardHeader>
              <CardContent>
                <UserDonationsList userId={user?.id} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
