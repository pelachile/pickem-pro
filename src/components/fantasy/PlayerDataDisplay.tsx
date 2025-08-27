import React from 'react';
import { usePlayerData } from './usePlayerData';
import { MarkdownRenderer } from './MarkdownRenderer';
import { Card } from '../ui/Card';
import { Loader2, AlertCircle, FileText } from 'lucide-react';

interface PlayerDataDisplayProps {
  position: string;
  title: string;
}

interface PlayerDataCardProps {
  file: {
    filename: string;
    content: string;
    lastModified: string;
  };
  className?: string;
}

const PlayerDataCard: React.FC<PlayerDataCardProps> = ({ file, className }) => {
  return (
    <Card className={`p-6 ${className || ''}`} glass={true} hover={true}>
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2 bg-sky-400/20 rounded-lg">
          <FileText className="h-5 w-5 text-sky-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white mb-1">
            {file.filename.replace('.md', '').split('-').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ')} Analysis
          </h3>
          <p className="text-white/60 text-sm">
            Last updated: {new Date(file.lastModified).toLocaleDateString()}
          </p>
        </div>
      </div>
      
      <div className="prose-container">
        <MarkdownRenderer content={file.content} />
      </div>
    </Card>
  );
};

export const PlayerDataDisplay: React.FC<PlayerDataDisplayProps> = ({ position, title }) => {
  const { files, isLoading, error } = usePlayerData(position);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 text-sky-400 animate-spin mb-4" />
        <p className="text-white/70 text-lg">Loading {title} analysis...</p>
        <p className="text-white/50 text-sm mt-1">Fetching latest player data</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-8 text-center" glass={true}>
        <div className="flex flex-col items-center gap-4">
          <div className="p-3 bg-red-500/20 rounded-full">
            <AlertCircle className="h-8 w-8 text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Failed to Load {title} Data
            </h3>
            <p className="text-red-300 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-300 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </Card>
    );
  }

  if (files.length === 0) {
    return (
      <Card className="p-8 text-center" glass={true}>
        <div className="flex flex-col items-center gap-4">
          <div className="p-3 bg-white/10 rounded-full">
            <FileText className="h-8 w-8 text-white/60" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">
              No {title} Data Available
            </h3>
            <p className="text-white/60">
              Player analysis files are not currently available for this position.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  // Display files in a full-width stacked layout
  const displayFiles = files.slice(0, 10); // Limit to prevent performance issues

  return (
    <div className="space-y-6">
      {displayFiles.map((file, index) => (
        <PlayerDataCard 
          key={`${file.filename}-${index}`}
          file={file}
          className="w-full"
        />
      ))}
    </div>
  );
};