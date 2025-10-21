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
  Users,
  AlertCircle,
  Package,
  Heart,
  FileText,
  LayoutDashboard
} from "lucide-react";
import { AdminStats } from "@/components/admin/AdminStats";
import { VolunteerCallManagement } from "@/components/admin/VolunteerCallManagement";
import { VictimRequestsManagement } from "@/components/admin/VictimRequestsManagement";
import { ResourceManagement } from "@/components/admin/ResourceManagement";
import { FundraiserManagement } from "@/components/admin/FundraiserManagement";
import { VolunteerManagement } from "@/components/admin/VolunteerManagement";
import { ReportsView } from "@/components/admin/ReportsView";

export default function AdminDashboard() {
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

        // Check user role
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .single();

        if (roleError || !roleData || roleData.role !== 'admin') {
          // User is not admin, redirect to user dashboard
          toast({
            title: "Access Denied",
            description: "You don't have admin permissions.",
            variant: "destructive",
          });
          navigate('/user-dashboard');
          return;
        }

        setLoading(false);
      } catch (error) {
        console.error('Error checking authentication:', error);
        navigate('/auth');
      }
    };

    checkAuth();
  }, [navigate, toast]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Verifying admin access...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-muted-foreground">Welcome   back, {profile?.name || 'Admin'}</p>
            </div>
          </div>
          <Button onClick={handleSignOut} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 lg:w-auto">
            <TabsTrigger value="overview">
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="calls">
              <AlertCircle className="w-4 h-4 mr-2" />
              Calls
            </TabsTrigger>
            <TabsTrigger value="requests">
              <AlertCircle className="w-4 h-4 mr-2" />
              Requests
            </TabsTrigger>
            <TabsTrigger value="volunteers">
              <Users className="w-4 h-4 mr-2" />
              Volunteers
            </TabsTrigger>
            <TabsTrigger value="resources">
              <Package className="w-4 h-4 mr-2" />
              Resources
            </TabsTrigger>
            <TabsTrigger value="fundraisers">
              <Heart className="w-4 h-4 mr-2" />
              Fundraisers
            </TabsTrigger>
            <TabsTrigger value="reports">
              <FileText className="w-4 h-4 mr-2" />
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <AdminStats />
          </TabsContent>

          <TabsContent value="calls" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Volunteer Call Management</CardTitle>
                <CardDescription>Create and manage volunteer opportunities</CardDescription>
              </CardHeader>
              <CardContent>
                <VolunteerCallManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requests" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Victim Requests</CardTitle>
                <CardDescription>Review and manage help requests</CardDescription>
              </CardHeader>
              <CardContent>
                <VictimRequestsManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="volunteers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Volunteer Management</CardTitle>
                <CardDescription>Manage registered volunteers</CardDescription>
              </CardHeader>
              <CardContent>
                <VolunteerManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Resource Management</CardTitle>
                <CardDescription>Track and allocate relief resources</CardDescription>
              </CardHeader>
              <CardContent>
                <ResourceManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fundraisers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Fundraiser Management</CardTitle>
                <CardDescription>Create and manage fundraising campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <FundraiserManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Field Reports</CardTitle>
                <CardDescription>View reports from volunteers and field workers</CardDescription>
              </CardHeader>
              <CardContent>
                <ReportsView />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
