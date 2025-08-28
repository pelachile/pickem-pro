/**
 * Demonstration component for the enhanced team image system
 * Shows gradient fallbacks for teams without images
 */

import React from 'react';
import { Card } from '../ui/Card';
import { TeamImage, TeamHeroImage, TeamThumbnail } from '../ui/TeamImage';
import { Button } from '../ui/Button';
import { RefreshCw, ImageIcon, Palette } from 'lucide-react';

// Sample team data for demonstration
const DEMO_TEAMS = [
  {
    abbreviation: 'KC',
    name: 'Chiefs',
    displayName: 'Kansas City Chiefs',
    primaryColor: '#e31837',
    secondaryColor: '#ffb612'
  },
  {
    abbreviation: 'BUF',
    name: 'Bills',
    displayName: 'Buffalo Bills',
    primaryColor: '#c60c30',
    secondaryColor: '#00338d'
  },
  {
    abbreviation: 'SF',
    name: '49ers',
    displayName: 'San Francisco 49ers',
    primaryColor: '#aa0000',
    secondaryColor: '#b3995d'
  },
  {
    abbreviation: 'DAL',
    name: 'Cowboys',
    displayName: 'Dallas Cowboys',
    primaryColor: '#041e42',
    secondaryColor: '#869397'
  },
  {
    abbreviation: 'PIT',
    name: 'Steelers',
    displayName: 'Pittsburgh Steelers',
    primaryColor: '#ffb612',
    secondaryColor: '#000000'
  },
  {
    abbreviation: 'GB',
    name: 'Packers',
    displayName: 'Green Bay Packers',
    primaryColor: '#203731',
    secondaryColor: '#ffb612'
  }
];

export const TeamImageDemo: React.FC = () => {
  const [forceGradients, setForceGradients] = React.useState(false);
  const [refreshKey, setRefreshKey] = React.useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <Card className="p-6" glass={true}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Palette className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Team Image System Demo</h2>
              <p className="text-white/70">Showcasing gradient fallbacks and team color integration</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button
              onClick={() => setForceGradients(!forceGradients)}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <ImageIcon className="h-4 w-4" />
              {forceGradients ? 'Show Images' : 'Force Gradients'}
            </Button>
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>
        
        <div className="grid gap-4 text-white/80">
          <p>
            This demo shows how our enhanced team image system handles missing images 
            by generating beautiful gradient backgrounds using team colors.
          </p>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="p-4 bg-white/5 rounded-lg">
              <h3 className="font-semibold text-green-400 mb-2">✨ Gradient Fallbacks</h3>
              <p>When images aren't available, beautiful gradients are generated using team primary and secondary colors.</p>
            </div>
            <div className="p-4 bg-white/5 rounded-lg">
              <h3 className="font-semibold text-blue-400 mb-2">🎨 Team Branding</h3>
              <p>Logo overlays and color-coordinated backgrounds maintain team identity even without photos.</p>
            </div>
            <div className="p-4 bg-white/5 rounded-lg">
              <h3 className="font-semibold text-purple-400 mb-2">📱 Responsive Design</h3>
              <p>All fallbacks are fully responsive and work across different screen sizes and components.</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Hero Image Examples */}
      <Card className="p-6" glass={true}>
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Hero Image Examples
        </h3>
        
        <div className="grid lg:grid-cols-2 gap-6">
          {DEMO_TEAMS.slice(0, 4).map((team) => (
            <div key={`${team.abbreviation}-${refreshKey}`} className="space-y-3">
              <TeamHeroImage
                src={forceGradients ? '' : `/images/stadiums/${team.abbreviation.toLowerCase()}-stadium.jpg`}
                alt={`${team.displayName} stadium`}
                teamColors={{
                  primary: team.primaryColor,
                  secondary: team.secondaryColor
                }}
                teamName={team.name}
                abbreviation={team.abbreviation}
                className="rounded-lg"
              >
                {/* Overlay content */}
                <div className="p-6">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-16 h-16 rounded-lg border-2 border-white/30 flex items-center justify-center font-bold text-white text-sm"
                      style={{ backgroundColor: `${team.primaryColor}88` }}
                    >
                      {team.abbreviation}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white">{team.displayName}</h4>
                      <p className="text-white/80 text-sm">{forceGradients ? 'Gradient Fallback' : 'Image or Gradient'}</p>
                    </div>
                  </div>
                </div>
              </TeamHeroImage>
            </div>
          ))}
        </div>
      </Card>

      {/* Thumbnail Examples */}
      <Card className="p-6" glass={true}>
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Thumbnail Examples
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {DEMO_TEAMS.map((team) => (
            <div key={`thumb-${team.abbreviation}-${refreshKey}`} className="space-y-2">
              <TeamThumbnail
                src={forceGradients ? '' : `/images/banners/${team.abbreviation.toLowerCase()}-banner.jpg`}
                alt={`${team.displayName} banner`}
                teamColors={{
                  primary: team.primaryColor,
                  secondary: team.secondaryColor
                }}
                teamName={team.name}
                abbreviation={team.abbreviation}
                className="rounded-lg"
              />
              <div className="text-center">
                <p className="text-white font-medium text-sm">{team.name}</p>
                <p className="text-white/60 text-xs">{team.abbreviation}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Color Palette Display */}
      <Card className="p-6" glass={true}>
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Team Color Palettes
        </h3>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DEMO_TEAMS.map((team) => (
            <div key={team.abbreviation} className="p-4 bg-white/5 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div 
                  className="w-8 h-8 rounded border-2 border-white/20"
                  style={{ backgroundColor: team.primaryColor }}
                />
                <div 
                  className="w-8 h-8 rounded border-2 border-white/20"
                  style={{ backgroundColor: team.secondaryColor }}
                />
                <div>
                  <p className="text-white font-medium text-sm">{team.name}</p>
                  <p className="text-white/60 text-xs">{team.abbreviation}</p>
                </div>
              </div>
              <div className="space-y-1 text-xs text-white/70">
                <p><span className="font-medium">Primary:</span> {team.primaryColor}</p>
                <p><span className="font-medium">Secondary:</span> {team.secondaryColor}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Usage Instructions */}
      <Card className="p-6" glass={true}>
        <h3 className="text-xl font-bold text-white mb-4">Implementation Guide</h3>
        <div className="space-y-4 text-white/80">
          <div className="p-4 bg-white/5 rounded-lg">
            <h4 className="font-semibold text-white mb-2">1. Import Components</h4>
            <code className="text-sm bg-black/20 px-2 py-1 rounded font-mono">
              import &#123; TeamImage, TeamHeroImage &#125; from '../ui/TeamImage';
            </code>
          </div>
          
          <div className="p-4 bg-white/5 rounded-lg">
            <h4 className="font-semibold text-white mb-2">2. Use with Team Colors</h4>
            <code className="text-sm bg-black/20 px-2 py-1 rounded font-mono block">
              &lt;TeamImage<br/>
              &nbsp;&nbsp;teamColors=&#123;&#123; primary: '#e31837', secondary: '#ffb612' &#125;&#125;<br/>
              &nbsp;&nbsp;teamName="Chiefs"<br/>
              &nbsp;&nbsp;abbreviation="KC"<br/>
              &nbsp;&nbsp;enableGradientFallback=&#123;true&#125;<br/>
              /&gt;
            </code>
          </div>
          
          <div className="p-4 bg-white/5 rounded-lg">
            <h4 className="font-semibold text-white mb-2">3. Automatic Fallbacks</h4>
            <p>The system automatically generates beautiful gradients when images are missing, maintaining your team's visual identity.</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TeamImageDemo;