import { useState, useEffect } from 'react';
import type { PlayerPosition, MarkdownFile, LoadingState, PlayerDataError } from './types';

/**
 * Custom hook for loading markdown files from player data directories
 */
export const usePlayerData = (position: PlayerPosition) => {
  const [files, setFiles] = useState<MarkdownFile[]>([]);
  const [loading, setLoading] = useState<LoadingState>({ isLoading: true, error: null });

  useEffect(() => {
    const loadPlayerData = async () => {
      setLoading({ isLoading: true, error: null });
      
      try {
        // For now, we'll load files individually since we can't list directory contents in the browser
        // This approach assumes a conventional naming pattern for the markdown files
        const commonFilenames = [
          `${position}.md`,
          'analysis.md',
          'rankings.md',
          'projections.md',
          'sleepers.md',
          'busts.md',
          'strategy.md'
        ];

        const loadedFiles: MarkdownFile[] = [];
        const errors: PlayerDataError[] = [];

        // Attempt to load each possible file
        for (const filename of commonFilenames) {
          try {
            const response = await fetch(`/data/playerData/${position}/${filename}?t=${Date.now()}`);
            
            if (response.ok) {
              const content = await response.text();
              
              // Debug logging to check what we're actually receiving
              if (filename === 'quarterbacks.md') {
                console.log('Quarterbacks.md response:', {
                  url: response.url,
                  contentType: response.headers.get('content-type'),
                  contentLength: content.length,
                  firstChars: content.substring(0, 200),
                  containsHTML: content.includes('<html') || content.includes('<!doctype')
                });
              }
              
              // Skip files that contain HTML content (likely error pages or wrong content)
              if (content.includes('<!doctype') || content.includes('<html')) {
                console.warn(`Skipping ${filename} - contains HTML instead of markdown`);
                continue;
              }
              
              loadedFiles.push({
                filename,
                content,
                lastModified: response.headers.get('last-modified') 
                  ? new Date(response.headers.get('last-modified')!) 
                  : undefined
              });
            }
          } catch (error) {
            // File doesn't exist or can't be loaded - this is expected for many files
            errors.push({
              filename,
              message: error instanceof Error ? error.message : 'Unknown error',
              type: 'load-error'
            });
          }
        }

        if (loadedFiles.length === 0) {
          setLoading({
            isLoading: false,
            error: `No markdown files found for ${position}. Check that files exist in /data/playerData/${position}/`
          });
          return;
        }

        // Sort files with the main position file first, then alphabetically
        loadedFiles.sort((a, b) => {
          if (a.filename === `${position}.md`) return -1;
          if (b.filename === `${position}.md`) return 1;
          return a.filename.localeCompare(b.filename);
        });

        setFiles(loadedFiles);
        setLoading({ isLoading: false, error: null });

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load player data';
        setLoading({ isLoading: false, error: errorMessage });
      }
    };

    loadPlayerData();
  }, [position]);

  return {
    files,
    isLoading: loading.isLoading,
    error: loading.error,
    refetch: () => {
      setLoading({ isLoading: true, error: null });
      // Re-trigger the effect
      setFiles([]);
    }
  };
};