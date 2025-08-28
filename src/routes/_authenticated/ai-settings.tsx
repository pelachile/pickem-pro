import { createFileRoute } from '@tanstack/react-router';
import AIAnalysisPanel from '../../components/ai/AIAnalysisPanel';
import { Card } from '../../components/ui/Card';
import { Brain, Zap, Database, TrendingUp } from 'lucide-react';

export const Route = createFileRoute('/_authenticated/ai-settings')({
  component: AISettings,
});

function AISettings() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center space-y-4 mb-8">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 bg-purple-500/20 rounded-xl">
            <Brain className="h-8 w-8 text-purple-400" />
          </div>
          <h1 className="text-3xl font-bold text-white">AI Analysis Settings</h1>
        </div>
        <p className="text-white/70 text-lg max-w-2xl mx-auto">
          Manage AI-powered analysis for teams, players, and league insights. 
          Our AI uses AWS Bedrock with Claude to provide intelligent football analysis.
        </p>
      </div>

      {/* AI Analysis Panel */}
      <AIAnalysisPanel />

      {/* Feature Overview */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6" glass={true}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Team Analysis</h3>
          </div>
          <ul className="space-y-2 text-white/70 text-sm">
            <li>• Season outlook and projections</li>
            <li>• Strengths and weaknesses identification</li>
            <li>• Injury impact analysis</li>
            <li>• Weekly game previews</li>
            <li>• Playoff odds assessment</li>
          </ul>
        </Card>

        <Card className="p-6" glass={true}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Zap className="h-6 w-6 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Player Analysis</h3>
          </div>
          <ul className="space-y-2 text-white/70 text-sm">
            <li>• Enhanced fantasy projections</li>
            <li>• Matchup analysis and recommendations</li>
            <li>• Start/sit guidance</li>
            <li>• News and trend analysis</li>
            <li>• Injury impact evaluation</li>
          </ul>
        </Card>

        <Card className="p-6" glass={true}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Database className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">League Insights</h3>
          </div>
          <ul className="space-y-2 text-white/70 text-sm">
            <li>• Weekly storylines and trends</li>
            <li>• Key matchups to watch</li>
            <li>• Fantasy waiver wire picks</li>
            <li>• Playoff picture analysis</li>
            <li>• Injury watch lists</li>
          </ul>
        </Card>
      </div>

      {/* Technical Details */}
      <Card className="p-6" glass={true}>
        <h3 className="text-lg font-semibold text-white mb-4">Technical Details</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-white/80 font-medium mb-3">AI Model</h4>
            <ul className="space-y-1 text-white/70 text-sm">
              <li>• Claude 3.5 Sonnet via AWS Bedrock</li>
              <li>• Temperature: 0.7 for balanced creativity</li>
              <li>• Max tokens: 4000 per request</li>
              <li>• 15-minute timeout for thorough analysis</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white/80 font-medium mb-3">Performance</h4>
            <ul className="space-y-1 text-white/70 text-sm">
              <li>• 7-day cache for cost optimization</li>
              <li>• 2-second rate limiting between calls</li>
              <li>• Automatic retry with exponential backoff</li>
              <li>• Smart content freshness detection</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Usage Tips */}
      <Card className="p-6" glass={true}>
        <h3 className="text-lg font-semibold text-white mb-4">Usage Tips</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-white/80 font-medium mb-2">Best Practices</h4>
            <ul className="space-y-1 text-white/70 text-sm">
              <li>• Run full analysis weekly for comprehensive updates</li>
              <li>• Use targeted analysis for specific needs</li>
              <li>• Check content freshness before making decisions</li>
              <li>• Allow 2-5 minutes for analysis completion</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white/80 font-medium mb-2">Cost Optimization</h4>
            <ul className="space-y-1 text-white/70 text-sm">
              <li>• Cached results reduce API calls by ~85%</li>
              <li>• Avoid frequent refresh unless data is stale</li>
              <li>• Use specific analysis types when possible</li>
              <li>• Monitor cache hit rates for efficiency</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}