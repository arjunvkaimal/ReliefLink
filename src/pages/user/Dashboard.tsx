import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Heart, AlertCircle, LogOut } from 'lucide-react';

const Dashboard = () => {
  const { currentUser, logout, victimRequests, volunteers, donations } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const myRequests = victimRequests.filter((r) => r.userId === currentUser?.id);
  const myVolunteer = volunteers.find((v) => v.userId === currentUser?.id);
  const myDonations = donations.filter((d) => d.userId === currentUser?.id);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">DisasterRelief</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{currentUser.name}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8">My Dashboard</h2>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link to="/dashboard/volunteer">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <Users className="w-12 h-12 text-secondary mb-2" />
                <CardTitle>Volunteer</CardTitle>
                <CardDescription>Offer your skills and time</CardDescription>
              </CardHeader>
              <CardContent>
                {myVolunteer ? (
                  <Badge className="bg-secondary">
                    Status: {myVolunteer.status}
                  </Badge>
                ) : (
                  <p className="text-sm text-muted-foreground">Not registered yet</p>
                )}
              </CardContent>
            </Card>
          </Link>

          <Link to="/dashboard/donate">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <Heart className="w-12 h-12 text-accent mb-2" />
                <CardTitle>Donate</CardTitle>
                <CardDescription>Contribute to campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{myDonations.length}</p>
                <p className="text-sm text-muted-foreground">Total donations</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/dashboard/request">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <AlertCircle className="w-12 h-12 text-destructive mb-2" />
                <CardTitle>Request Help</CardTitle>
                <CardDescription>Submit urgent assistance needs</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{myRequests.length}</p>
                <p className="text-sm text-muted-foreground">Your requests</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        <section className="mb-8">
          <h3 className="text-2xl font-bold mb-4">My Requests</h3>
          <div className="space-y-4">
            {myRequests.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No requests submitted yet
                </CardContent>
              </Card>
            ) : (
              myRequests.map((request) => (
                <Card key={request.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{request.name}</CardTitle>
                        <CardDescription>{request.location}</CardDescription>
                      </div>
                      <Badge
                        variant={
                          request.status === 'approved'
                            ? 'default'
                            : request.status === 'rejected'
                            ? 'destructive'
                            : 'secondary'
                        }
                      >
                        {request.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-2">{request.description}</p>
                    <div className="flex gap-2">
                      <Badge variant="outline">Urgency: {request.urgency}</Badge>
                      <Badge variant="outline">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
