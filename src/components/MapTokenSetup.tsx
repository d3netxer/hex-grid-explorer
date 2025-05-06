
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface MapTokenSetupProps {
  onTokenSubmit: (token: string) => void;
}

const MapTokenSetup: React.FC<MapTokenSetupProps> = ({ onTokenSubmit }) => {
  const [token, setToken] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) {
      toast.error('Please enter a valid Mapbox token');
      return;
    }
    onTokenSubmit(token);
    toast.success('Mapbox token saved successfully');
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader>
          <CardTitle>Welcome to Hex Grid Explorer</CardTitle>
          <CardDescription>
            To get started, please enter your Mapbox public token
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mapbox-token">Mapbox Public Token</Label>
              <Input
                id="mapbox-token"
                placeholder="pk.eyJ1IjoieW91..."
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                You can find your token in the{' '}
                <a 
                  href="https://account.mapbox.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Mapbox account dashboard
                </a>
              </p>
            </div>
            <Button type="submit" className="w-full">
              Save Token & Load Map
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default MapTokenSetup;
