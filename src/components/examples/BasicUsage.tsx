import React, { useState } from 'react';
import { 
  Button, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardFooter,
  StatusBadge, 
  UserAvatar 
} from '../ui';

/**
 * Basic Usage Examples
 * 
 * Demonstrates the fundamental usage of each component
 */
export const BasicUsage: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleAction = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
  };

  const sampleUser = {
    name: "John Doe",
    avatar_icon: "users",
    avatar_color: "ocean-blue" as const
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-blue/20 to-sunset-orange/20 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-midnight-navy dark:text-white mb-2">
            Ocean-to-Sunset Components
          </h1>
          <p className="text-midnight-navy/70 dark:text-white/70">
            Beautiful React components with glass morphism effects
          </p>
        </div>

        {/* Button Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Button Variants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="primary" loading={loading} onClick={handleAction}>
                {loading ? 'Loading...' : 'Test Loading'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Status Badge Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Status Badges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <StatusBadge status="live" animate showIndicator />
              <StatusBadge status="scheduled" />
              <StatusBadge status="final" />
              <StatusBadge status="red_zone" animate showIndicator indicatorType="double-pulse" />
              <StatusBadge status="pending" size="lg" />
              <StatusBadge status="active" text="Custom Text" />
            </div>
          </CardContent>
        </Card>

        {/* User Avatar Examples */}
        <Card>
          <CardHeader>
            <CardTitle>User Avatars</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-6">
              <div className="text-center">
                <UserAvatar user={sampleUser} size="sm" />
                <p className="text-xs mt-2">Small</p>
              </div>
              <div className="text-center">
                <UserAvatar user={sampleUser} size="md" />
                <p className="text-xs mt-2">Medium</p>
              </div>
              <div className="text-center">
                <UserAvatar user={sampleUser} size="lg" />
                <p className="text-xs mt-2">Large</p>
              </div>
              <div className="text-center">
                <UserAvatar user={sampleUser} size="xl" />
                <p className="text-xs mt-2">Extra Large</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card Variations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card glass hover>
            <CardHeader>
              <CardTitle>Glass Card with Hover</CardTitle>
            </CardHeader>
            <CardContent>
              <p>This card has glass morphism effects and hover animations.</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Learn More</Button>
            </CardFooter>
          </Card>

          <Card glass={false} hover={false} padding="lg">
            <CardHeader>
              <CardTitle>Solid Card</CardTitle>
            </CardHeader>
            <CardContent>
              <p>This card has no glass effects or hover animations, with large padding.</p>
            </CardContent>
            <CardFooter>
              <Button variant="primary">Get Started</Button>
            </CardFooter>
          </Card>
        </div>

        {/* Interactive Example */}
        <Card className="border-2 border-ocean-blue/20">
          <CardHeader>
            <CardTitle>Interactive Example</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <UserAvatar user={sampleUser} />
                <div>
                  <h3 className="font-semibold">John Doe</h3>
                  <StatusBadge status="online" showIndicator />
                </div>
              </div>
              <p className="text-sm text-midnight-navy/70 dark:text-white/70">
                This example combines multiple components to show how they work together.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost">Cancel</Button>
            <Button variant="primary">Save Profile</Button>
          </CardFooter>
        </Card>

      </div>
    </div>
  );
};

export default BasicUsage;