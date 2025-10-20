import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Phone, ArrowLeft, Filter, MapPin, Clock, Briefcase, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function VolunteerCalling() {
  const navigate = useNavigate();
  const { volunteers, disasters, users, volunteerCalls, addVolunteerCall, updateVolunteerCall, currentUser } = useApp();
  const { toast } = useToast();
  
  const [selectedDisaster, setSelectedDisaster] = useState<string>('');
  const [locationFilter, setLocationFilter] = useState<string>('');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('');
  const [skillFilter, setSkillFilter] = useState<string>('');
  const [callDialogOpen, setCallDialogOpen] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState<string>('');
  const [responseStatus, setResponseStatus] = useState<'available' | 'busy' | 'not_reachable' | 'pending'>('pending');
  const [callNotes, setCallNotes] = useState('');

  const activeDisasters = disasters.filter(d => d.status === 'active');
  
  const filteredVolunteers = volunteers.filter(v => {
    if (!selectedDisaster) return false;
    if (v.disasterId !== selectedDisaster) return false;
    if (locationFilter && !v.location.toLowerCase().includes(locationFilter.toLowerCase())) return false;
    if (availabilityFilter && !v.availability.toLowerCase().includes(availabilityFilter.toLowerCase())) return false;
    if (skillFilter && !v.skills.toLowerCase().includes(skillFilter.toLowerCase())) return false;
    return true;
  });

  const getVolunteerUser = (userId: string) => users.find(u => u.id === userId);
  
  const getVolunteerCallStatus = (volunteerId: string) => {
    const calls = volunteerCalls.filter(c => c.volunteerId === volunteerId && c.disasterId === selectedDisaster);
    if (calls.length === 0) return null;
    return calls[calls.length - 1];
  };

  const handleCall = (volunteerId: string) => {
    setSelectedVolunteer(volunteerId);
    setResponseStatus('pending');
    setCallNotes('');
    setCallDialogOpen(true);
  };

  const handleLogCall = () => {
    if (!currentUser) return;
    
    addVolunteerCall({
      volunteerId: selectedVolunteer,
      disasterId: selectedDisaster,
      calledBy: currentUser.id,
      responseStatus,
      notes: callNotes || undefined,
    });

    toast({
      title: 'Call Logged',
      description: 'Volunteer call has been recorded successfully.',
    });

    setCallDialogOpen(false);
    setSelectedVolunteer('');
    setCallNotes('');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-success/10 text-success hover:bg-success/20"><CheckCircle className="w-3 h-3 mr-1" />Available</Badge>;
      case 'busy':
        return <Badge className="bg-warning/10 text-warning hover:bg-warning/20"><AlertCircle className="w-3 h-3 mr-1" />Busy</Badge>;
      case 'not_reachable':
        return <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/20"><XCircle className="w-3 h-3 mr-1" />Not Reachable</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/admin/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Volunteer Calling</h1>
            <p className="text-muted-foreground">Contact and coordinate volunteers for active disasters</p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Disaster</CardTitle>
          <CardDescription>Choose an active disaster to view and contact registered volunteers</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedDisaster} onValueChange={setSelectedDisaster}>
            <SelectTrigger>
              <SelectValue placeholder="Select a disaster..." />
            </SelectTrigger>
            <SelectContent>
              {activeDisasters.map((disaster) => (
                <SelectItem key={disaster.id} value={disaster.id}>
                  {disaster.name} - {disaster.location} ({disaster.severity})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedDisaster && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filter Volunteers
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Location</label>
                <Input
                  placeholder="Filter by location..."
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Availability</label>
                <Input
                  placeholder="Filter by availability..."
                  value={availabilityFilter}
                  onChange={(e) => setAvailabilityFilter(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Skills</label>
                <Input
                  placeholder="Filter by skills..."
                  value={skillFilter}
                  onChange={(e) => setSkillFilter(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Registered Volunteers ({filteredVolunteers.length})</CardTitle>
              <CardDescription>Contact volunteers and log their response status</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredVolunteers.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No volunteers found for the selected filters.</p>
              ) : (
                <div className="space-y-4">
                  {filteredVolunteers.map((volunteer) => {
                    const user = getVolunteerUser(volunteer.userId);
                    const callStatus = getVolunteerCallStatus(volunteer.id);
                    
                    return (
                      <div key={volunteer.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-3">
                              <h3 className="font-semibold text-lg">{user?.name}</h3>
                              {callStatus && getStatusBadge(callStatus.responseStatus)}
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-2 text-sm">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Phone className="w-4 h-4" />
                                <span>{volunteer.contactInfo}</span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <MapPin className="w-4 h-4" />
                                <span>{volunteer.location}</span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                <span>{volunteer.availability}</span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Briefcase className="w-4 h-4" />
                                <span>{volunteer.skills}</span>
                              </div>
                            </div>

                            {callStatus?.notes && (
                              <div className="mt-2 p-2 bg-muted rounded text-sm">
                                <strong>Last call notes:</strong> {callStatus.notes}
                              </div>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(`tel:${volunteer.contactInfo}`)}
                            >
                              <Phone className="w-4 h-4 mr-2" />
                              Call
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleCall(volunteer.id)}
                            >
                              Log Response
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      <Dialog open={callDialogOpen} onOpenChange={setCallDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log Volunteer Call</DialogTitle>
            <DialogDescription>Record the outcome of your call with the volunteer</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Response Status</label>
              <Select value={responseStatus} onValueChange={(value: any) => setResponseStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="busy">Busy</SelectItem>
                  <SelectItem value="not_reachable">Not Reachable</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Notes (Optional)</label>
              <Textarea
                placeholder="Add any additional notes about the call..."
                value={callNotes}
                onChange={(e) => setCallNotes(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCallDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleLogCall}>Save Call Log</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
