import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Users, Package, AlertCircle } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">DisasterRelief</h1>
          <div className="flex gap-4">
            <Link to="/login">
              <Button variant="outline">User Login</Button>
            </Link>
            <Link to="/admin">
              <Button>Admin Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <section className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-foreground">
            Together We Can Make a Difference
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Join our disaster relief management system to help those in need, volunteer your time,
            or donate resources to support relief efforts.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/register">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline">
                Sign In
              </Button>
            </Link>
          </div>
        </section>

        <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardHeader>
              <AlertCircle className="w-12 h-12 text-destructive mb-2" />
              <CardTitle>Request Help</CardTitle>
              <CardDescription>
                Submit urgent requests for assistance during disasters
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="w-12 h-12 text-secondary mb-2" />
              <CardTitle>Volunteer</CardTitle>
              <CardDescription>
                Offer your skills and time to help relief efforts
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Heart className="w-12 h-12 text-accent mb-2" />
              <CardTitle>Donate</CardTitle>
              <CardDescription>
                Contribute funds or resources to active campaigns
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Package className="w-12 h-12 text-primary mb-2" />
              <CardTitle>Track Impact</CardTitle>
              <CardDescription>
                Monitor your contributions and see the difference you make
              </CardDescription>
            </CardHeader>
          </Card>
        </section>

        <section className="bg-muted rounded-lg p-8">
          <h3 className="text-2xl font-bold mb-4 text-center">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h4 className="font-semibold mb-2">Create Account</h4>
              <p className="text-muted-foreground">
                Register to access all features and start making an impact
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h4 className="font-semibold mb-2">Choose Your Action</h4>
              <p className="text-muted-foreground">
                Request help, volunteer, or donate based on your capability
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h4 className="font-semibold mb-2">Make a Difference</h4>
              <p className="text-muted-foreground">
                Track your impact and see how you're helping communities recover
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>&copy; 2025 DisasterRelief Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
