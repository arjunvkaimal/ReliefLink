import { Link } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminUsers = () => {
  const { users, volunteers, updateUser } = useApp();
  const { toast } = useToast();

  const toggleUserStatus = (userId: string, currentStatus: boolean) => {
    updateUser(userId, { isActive: !currentStatus });
    toast({
      title: 'User updated',
      description: `User ${!currentStatus ? 'activated' : 'deactivated'}`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">User Management</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Link to="/admin">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>All Users ({users.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Volunteer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => {
                  const isVolunteer = volunteers.some((v) => v.userId === user.id);
                  return (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>
                        {isVolunteer ? (
                          <Badge className="bg-secondary">Yes</Badge>
                        ) : (
                          <Badge variant="outline">No</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.isActive ? 'default' : 'destructive'}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant={user.isActive ? 'destructive' : 'default'}
                          onClick={() => toggleUserStatus(user.id, user.isActive)}
                        >
                          {user.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Volunteers ({volunteers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Skills</TableHead>
                  <TableHead>Availability</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {volunteers.map((volunteer) => {
                  const user = users.find((u) => u.id === volunteer.userId);
                  return (
                    <TableRow key={volunteer.id}>
                      <TableCell className="font-medium">{user?.name}</TableCell>
                      <TableCell>{volunteer.skills}</TableCell>
                      <TableCell>{volunteer.availability}</TableCell>
                      <TableCell>{volunteer.contactInfo}</TableCell>
                      <TableCell>
                        <Badge
                          variant={volunteer.status === 'active' ? 'default' : 'secondary'}
                        >
                          {volunteer.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminUsers;
