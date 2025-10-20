import { Link } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, AlertCircle, Package, Heart, FileText, AlertTriangle } from 'lucide-react';

const AdminDashboard = () => {
  const { users, victimRequests, volunteers, donations, fundraisers, resources, reports, disasters } = useApp();

  const stats = [
    {
      title: 'Total Users',
      value: users.length,
      icon: Users,
      link: '/admin/users',
      color: 'text-primary',
    },
    {
      title: 'Active Disasters',
      value: disasters.filter(d => d.status === 'active').length,
      icon: AlertTriangle,
      link: '/admin/disasters',
      color: 'text-destructive',
    },
    {
      title: 'Victim Requests',
      value: victimRequests.length,
      icon: AlertCircle,
      link: '/admin/requests',
      color: 'text-warning',
    },
    {
      title: 'Volunteers',
      value: volunteers.length,
      icon: Users,
      link: '/admin/volunteer-calling',
      color: 'text-secondary',
    },
    {
      title: 'Resources',
      value: resources.length,
      icon: Package,
      link: '/admin/resources',
      color: 'text-primary',
    },
    {
      title: 'Fundraisers',
      value: fundraisers.length,
      icon: Heart,
      link: '/admin/fundraisers',
      color: 'text-accent',
    },
    {
      title: 'Reports',
      value: reports.length,
      icon: FileText,
      link: '/admin/reports',
      color: 'text-muted-foreground',
    },
  ];

  const pendingRequests = victimRequests.filter((r) => r.status === 'pending').length;
  const pendingFundraisers = fundraisers.filter((f) => f.status === 'pending').length;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-sm opacity-90">DisasterRelief Management System</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Overview</h2>
          <p className="text-muted-foreground">System statistics and quick actions</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => (
            <Link key={stat.title} to={stat.link}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                Pending Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link to="/admin/requests" className="block">
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                    <span>Victim Requests</span>
                    <span className="font-bold text-destructive">{pendingRequests}</span>
                  </div>
                </Link>
                <Link to="/admin/fundraisers" className="block">
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                    <span>Fundraisers</span>
                    <span className="font-bold text-accent">{pendingFundraisers}</span>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link to="/admin/users" className="block">
                <div className="p-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                  Manage Users
                </div>
              </Link>
              <Link to="/admin/volunteer-calling" className="block">
                <div className="p-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors">
                  Volunteer Calling
                </div>
              </Link>
              <Link to="/admin/resources" className="block">
                <div className="p-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors">
                  Manage Resources
                </div>
              </Link>
              <Link to="/admin/reports" className="block">
                <div className="p-3 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors">
                  View Reports
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-4">
          <Link to="/" className="text-sm text-muted-foreground hover:underline">
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
