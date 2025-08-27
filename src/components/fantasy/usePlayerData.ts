import { useState, useEffect } from 'react';

export interface PlayerDataFile {
  filename: string;
  content: string;
  lastModified: string;
}

export interface PlayerDataResult {
  files: PlayerDataFile[];
  isLoading: boolean;
  error: string | null;
}

export const usePlayerData = (position: string): PlayerDataResult => {
  const [files, setFiles] = useState<PlayerDataFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPlayerData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const markdownFiles = [`${position}.md`];
        const loadedFiles: PlayerDataFile[] = [];

        for (const filename of markdownFiles) {
          try {
            const response = await fetch(`/data/playerData/${position}/${filename}?t=${Date.now()}`);
            if (!response.ok) {
              if (response.status === 404) {
                console.warn(`File not found: ${filename}`);
                continue;
              }
              throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const content = await response.text();
            
            if (content.includes('<!doctype') || content.includes('<html')) {
              console.warn(`Skipping ${filename} - contains HTML instead of markdown`);
              continue;
            }
            
            loadedFiles.push({
              filename,
              content,
              lastModified: new Date().toISOString()
            });
          } catch (fileError) {
            console.warn(`Failed to load ${filename}:`, fileError);
          }
        }

        if (loadedFiles.length === 0) {
          throw new Error(`No valid markdown files found for ${position}`);
        }

        setFiles(loadedFiles);
      } catch (err) {
        console.error('Error loading player data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load player data');
      } finally {
        setIsLoading(false);
      }
    };

    if (position) {
      loadPlayerData();
    }
  }, [position]);

  return { files, isLoading, error };
};