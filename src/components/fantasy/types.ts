/**
 * Types for Fantasy Football Player Data Display Components
 */

export type PlayerPosition = 
  | 'quarterbacks'
  | 'wide-receivers' 
  | 'running-backs'
  | 'tightends'
  | 'defense-kickers';

export interface MarkdownFile {
  filename: string;
  content: string;
  lastModified?: Date;
}

export interface PlayerDataDisplayProps {
  position: PlayerPosition;
  className?: string;
  maxFiles?: number;
}

export interface MarkdownRendererProps {
  content: string;
  filename?: string;
  className?: string;
}

export interface PlayerDataCardProps {
  file: MarkdownFile;
  className?: string;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface PlayerDataError {
  filename?: string;
  message: string;
  type: 'load-error' | 'parse-error' | 'not-found';
}