import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminResources = () => {
  const { resources, addResource, updateResource } = useApp();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addResource({
      name,
      quantity: parseInt(quantity),
      unit,
      category,
    });

    toast({
      title: 'Resource added',
      description: 'New resource has been added to inventory',
    });

    setName('');
    setQuantity('');
    setUnit('');
    setCategory('');
    setIsOpen(false);
  };

  const updateQuantity = (resourceId: string, newQuantity: number) => {
    updateResource(resourceId, { quantity: newQuantity });
    toast({
      title: 'Resource updated',
      description: 'Resource quantity has been updated',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Resource Management</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-4">
          <Link to="/admin">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Resource
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Resource</DialogTitle>
                <DialogDescription>Add a resource to the inventory</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Resource Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="0"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Input
                    id="unit"
                    placeholder="e.g., boxes, bottles, kg"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    placeholder="e.g., Food, Water, Medical"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Add Resource
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Resource Inventory ({resources.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {resources.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No resources in inventory</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resources.map((resource) => (
                    <TableRow key={resource.id}>
                      <TableCell className="font-medium">{resource.name}</TableCell>
                      <TableCell>{resource.category}</TableCell>
                      <TableCell>
                        <span className={resource.quantity < 10 ? 'text-destructive font-bold' : ''}>
                          {resource.quantity}
                        </span>
                      </TableCell>
                      <TableCell>{resource.unit}</TableCell>
                      <TableCell>
                        {new Date(resource.updatedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(resource.id, resource.quantity + 10)}
                          >
                            +10
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(resource.id, Math.max(0, resource.quantity - 10))}
                          >
                            -10
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminResources;
