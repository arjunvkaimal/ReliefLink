import { Link } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminRequests = () => {
  const { victimRequests, users, updateVictimRequest, resources, allocateResource } = useApp();
  const { toast } = useToast();

  const updateStatus = (requestId: string, status: 'approved' | 'rejected' | 'completed') => {
    updateVictimRequest(requestId, { status });
    toast({
      title: 'Request updated',
      description: `Request ${status}`,
    });
  };

  const handleAllocateResource = (requestId: string, resourceId: string, quantity: number) => {
    allocateResource({
      requestId,
      resourceId,
      quantity,
      allocatedDate: new Date().toISOString(),
    });
    toast({
      title: 'Resource allocated',
      description: 'Resource has been allocated to the request',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Victim Requests</h1>
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
          {victimRequests.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No requests found
              </CardContent>
            </Card>
          ) : (
            victimRequests.map((request) => {
              const user = users.find((u) => u.id === request.userId);
              return (
                <Card key={request.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{request.name}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          By: {user?.name} ({user?.email})
                        </p>
                      </div>
                      <Badge
                        variant={
                          request.urgency === 'critical'
                            ? 'destructive'
                            : request.urgency === 'high'
                            ? 'default'
                            : 'secondary'
                        }
                      >
                        {request.urgency}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium">Location</p>
                        <p className="text-sm text-muted-foreground">{request.location}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Description</p>
                        <p className="text-sm text-muted-foreground">{request.description}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-sm font-medium">Status</p>
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
                        <div>
                          <p className="text-sm font-medium">Submitted</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {request.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => updateStatus(request.id, 'approved')}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => updateStatus(request.id, 'rejected')}
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                      {request.status === 'approved' && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => updateStatus(request.id, 'completed')}
                        >
                          Mark as Completed
                        </Button>
                      )}
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

export default AdminRequests;
