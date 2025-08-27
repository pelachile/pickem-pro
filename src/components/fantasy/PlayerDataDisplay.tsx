import React from 'react';
import { PlayerDataCard } from './PlayerDataCard';
import { PlayerDataErrorBoundary } from './PlayerDataErrorBoundary';
import { usePlayerData } from './usePlayerData';
import { cn } from '../utils';
import type { PlayerDataDisplayProps } from './types';

/**
 * Main component for displaying player data markdown files
 * Features responsive grid layout, loading states, and error handling
 */
export const PlayerDataDisplay: React.FC<PlayerDataDisplayProps> = ({
  position,
  className,
  maxFiles = 10
}) => {
  const { files, isLoading, error, refetch } = usePlayerData(position);

  // Format position name for display
  const formatPositionName = (pos: string): string => {
    return pos
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const positionDisplayName = formatPositionName(position);
  const displayFiles = files.slice(0, maxFiles);

  // Loading state
  if (isLoading) {
    return (
      <div className={cn('space-y-6', className)}>
        {/* Header skeleton */}
        <div className="text-center">
          <div className="h-8 bg-gradient-to-r from-navy-700/60 to-navy-600/60 rounded-lg animate-pulse mb-2 max-w-md mx-auto" />
          <div className="h-4 bg-navy-700/40 rounded animate-pulse max-w-sm mx-auto" />
        </div>

        {/* Cards skeleton - full width */}
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="bg-navy-900/60 border border-white/15 rounded-xl p-6 animate-pulse w-full"
            >
              <div className="h-6 bg-navy-700/60 rounded mb-4 w-3/4" />
              <div className="space-y-3">
                <div className="h-4 bg-navy-700/40 rounded w-full" />
                <div className="h-4 bg-navy-700/40 rounded w-5/6" />
                <div className="h-4 bg-navy-700/40 rounded w-4/5" />
                <div className="h-4 bg-navy-700/40 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={cn('text-center py-12', className)}>
        <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-8 max-w-2xl mx-auto">
          <svg 
            className="w-16 h-16 text-red-400 mx-auto mb-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1} 
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          <h3 className="text-xl font-semibold text-red-400 mb-2">
            Failed to Load {positionDisplayName} Data
          </h3>
          <p className="text-gray-200 mb-6 text-sm leading-relaxed">
            {error}
          </p>
          <button
            onClick={refetch}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 rounded-lg text-red-300 hover:text-red-200 transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (files.length === 0) {
    return (
      <div className={cn('text-center py-12', className)}>
        <div className="bg-navy-900/60 border border-white/15 rounded-xl p-8 max-w-2xl mx-auto">
          <svg 
            className="w-16 h-16 text-gray-300 mx-auto mb-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1} 
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-100 mb-2">
            No {positionDisplayName} Data Found
          </h3>
          <p className="text-gray-200 text-sm leading-relaxed">
            No markdown files were found for this position. Check that files exist in{' '}
            <code className="bg-navy-800/60 text-cyan-300 px-1.5 py-0.5 rounded text-xs">
              /data/playerData/{position}/
            </code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <PlayerDataErrorBoundary position={position}>
      <div className={cn('space-y-8', className)}>
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-3 bg-gradient-to-r from-sky-blue to-cyan-300 bg-clip-text text-transparent">
          {positionDisplayName} Analysis
        </h2>
        <p className="text-gray-200 text-sm md:text-base max-w-2xl mx-auto">
          Comprehensive fantasy football analysis, rankings, and insights for {positionDisplayName.toLowerCase()}.
          {files.length > 1 && ` ${files.length} documents available.`}
        </p>
      </div>

      {/* Cards stack - full width */}
      <div className="space-y-6">
        {displayFiles.map((file, index) => (
          <PlayerDataCard
            key={`${file.filename}-${index}`}
            file={file}
            className="w-full"
          />
        ))}
      </div>

      {/* Load more indicator */}
      {files.length > maxFiles && (
        <div className="text-center pt-4">
          <p className="text-sm text-gray-300">
            Showing {maxFiles} of {files.length} files
          </p>
        </div>
      )}

      {/* Refresh button */}
      <div className="text-center pt-4 border-t border-white/15">
        <button
          onClick={refetch}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-xs text-sky-blue hover:text-white transition-colors duration-200 rounded-lg hover:bg-navy-800/60"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Data
        </button>
      </div>
      </div>
    </PlayerDataErrorBoundary>
  );
};