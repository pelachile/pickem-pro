import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { MarkdownRenderer } from './MarkdownRenderer';
import { cn } from '../utils';
import type { PlayerDataCardProps } from './types';

/**
 * Individual card component for displaying a single markdown file
 * Features expandable content and error boundaries
 */
export const PlayerDataCard: React.FC<PlayerDataCardProps> = ({
  file,
  className
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Extract title from filename (remove .md extension and format)
  const getDisplayTitle = (filename: string): string => {
    return filename
      .replace(/\.md$/, '')
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Get preview content (first 300 characters)
  const getPreviewContent = (content: string): string => {
    if (content.length <= 300) return content;
    
    // Find the last space before 300 characters to avoid cutting words
    const truncated = content.slice(0, 300);
    const lastSpace = truncated.lastIndexOf(' ');
    return lastSpace > 250 ? truncated.slice(0, lastSpace) + '...' : truncated + '...';
  };

  const title = getDisplayTitle(file.filename);
  const showExpandButton = file.content.length > 300;
  const displayContent = isExpanded ? file.content : getPreviewContent(file.content);

  if (hasError) {
    return (
      <Card className={cn('border-red-500/30 bg-red-900/20', className)} padding="md">
        <div className="text-red-400">
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-sm">Failed to render content</p>
          <button
            onClick={() => setHasError(false)}
            className="mt-2 text-xs text-red-300 hover:text-red-200 underline"
          >
            Retry
          </button>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      className={cn('relative overflow-hidden', className)} 
      glass={true}
      hover={true}
      padding="lg"
    >
      {/* Header with title and metadata */}
      <div className="mb-4 border-b border-white/15 pb-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg md:text-xl font-semibold text-white">
            {title}
          </h3>
          {file.lastModified && (
            <span className="text-xs text-gray-300">
              {file.lastModified.toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      {/* Markdown content */}
      <div className="relative">
        <MarkdownRenderer 
          content={displayContent}
          filename={file.filename}
          className="text-sm md:text-base"
        />
        
        {/* Fade overlay when collapsed */}
        {showExpandButton && !isExpanded && (
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-navy-900/95 to-transparent pointer-events-none" />
        )}
      </div>

      {/* Expand/Collapse button */}
      {showExpandButton && (
        <div className="mt-4 pt-3 border-t border-white/15">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-2 text-sm text-sky-blue hover:text-white transition-colors duration-200 font-medium"
          >
            {isExpanded ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
                Show Less
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                Read More
              </>
            )}
          </button>
        </div>
      )}

      {/* File info tooltip */}
      <div className="absolute top-3 right-3 opacity-0 hover:opacity-100 transition-opacity duration-200">
        <div className="bg-navy-800/95 text-xs text-gray-200 px-2 py-1 rounded border border-white/25">
          {file.filename}
        </div>
      </div>
    </Card>
  );
};