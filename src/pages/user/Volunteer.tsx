import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';

const Volunteer = () => {
  const [disasterId, setDisasterId] = useState('');
  const [skills, setSkills] = useState('');
  const [availability, setAvailability] = useState('');
  const [location, setLocation] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const { currentUser, addVolunteer, volunteers, disasters } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const existingVolunteer = volunteers.find((v) => v.userId === currentUser?.id);
  const activeDisasters = disasters.filter(d => d.status === 'active');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (existingVolunteer) {
      toast({
        title: 'Already registered',
        description: 'You are already registered as a volunteer',
        variant: 'destructive',
      });
      return;
    }

    addVolunteer({
      userId: currentUser!.id,
      disasterId,
      skills,
      availability,
      location,
      contactInfo,
      status: 'active',
    });

    toast({
      title: 'Registration successful',
      description: 'Thank you for volunteering!',
    });

    navigate('/dashboard');
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-2xl">
        <Link to="/dashboard">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Volunteer Registration</CardTitle>
            <CardDescription>
              {existingVolunteer
                ? 'You are already registered as a volunteer'
                : 'Register to help in relief efforts'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {existingVolunteer ? (
              <div className="space-y-4">
                <div>
                  <Label>Disaster</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {disasters.find(d => d.id === existingVolunteer.disasterId)?.name || 'N/A'}
                  </p>
                </div>
                <div>
                  <Label>Skills</Label>
                  <p className="text-sm text-muted-foreground mt-1">{existingVolunteer.skills}</p>
                </div>
                <div>
                  <Label>Availability</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {existingVolunteer.availability}
                  </p>
                </div>
                <div>
                  <Label>Location</Label>
                  <p className="text-sm text-muted-foreground mt-1">{existingVolunteer.location}</p>
                </div>
                <div>
                  <Label>Contact Info</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {existingVolunteer.contactInfo}
                  </p>
                </div>
                <div>
                  <Label>Status</Label>
                  <p className="text-sm text-muted-foreground mt-1">{existingVolunteer.status}</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="disaster">Select Disaster</Label>
                  <Select value={disasterId} onValueChange={setDisasterId} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a disaster to volunteer for..." />
                    </SelectTrigger>
                    <SelectContent>
                      {activeDisasters.map((disaster) => (
                        <SelectItem key={disaster.id} value={disaster.id}>
                          {disaster.name} - {disaster.location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skills">Skills</Label>
                  <Textarea
                    id="skills"
                    placeholder="e.g., Medical training, Construction, Logistics"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="availability">Availability</Label>
                  <Input
                    id="availability"
                    placeholder="e.g., Weekends, Full-time, Evenings"
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Your Location</Label>
                  <Input
                    id="location"
                    placeholder="City or area"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactInfo">Contact Information</Label>
                  <Input
                    id="contactInfo"
                    placeholder="Phone number"
                    type="tel"
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Register as Volunteer
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Volunteer;
