import { Link } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

const AdminReports = () => {
  const { reports, users } = useApp();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Field Reports</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Link to="/admin">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        <div className="space-y-4">
          {reports.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No reports submitted yet
              </CardContent>
            </Card>
          ) : (
            reports.map((report) => {
              const user = users.find((u) => u.id === report.userId);
              return (
                <Card key={report.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{report.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          By: {user?.name} ({user?.email})
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm font-medium">Location</p>
                        <p className="text-sm text-muted-foreground">{report.location}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Description</p>
                        <p className="text-sm text-muted-foreground">{report.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminReports;
