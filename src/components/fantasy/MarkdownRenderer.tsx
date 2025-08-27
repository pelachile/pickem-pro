import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '../utils';
import type { MarkdownRendererProps } from './types';

/**
 * Styled markdown renderer component with dark theme
 * Optimized for fantasy football content display
 */
export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  filename,
  className
}) => {
  return (
    <div className={cn('prose prose-invert prose-lg max-w-none prose-headings:text-white prose-p:text-gray-100 prose-strong:text-white', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Heading styles with gradient accents
          h1: ({ children, ...props }) => (
            <h1 
              className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-sky-blue to-cyan-300 bg-clip-text text-transparent leading-tight"
              {...props}
            >
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2 
              className="text-xl md:text-2xl font-semibold mt-6 md:mt-8 mb-3 md:mb-4 text-sky-blue border-b border-sky-blue/30 pb-2"
              {...props}
            >
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3 
              className="text-lg md:text-xl font-semibold mt-4 md:mt-6 mb-2 md:mb-3 text-cyan-300"
              {...props}
            >
              {children}
            </h3>
          ),
          h4: ({ children, ...props }) => (
            <h4 
              className="text-base md:text-lg font-semibold mt-4 mb-2 text-cyan-200"
              {...props}
            >
              {children}
            </h4>
          ),
          
          // Paragraph and text styles - WCAG AA compliant
          p: ({ children, ...props }) => (
            <p 
              className="text-white leading-relaxed mb-4 text-sm md:text-base"
              {...props}
            >
              {children}
            </p>
          ),
          
          // List styles - High contrast for readability
          ul: ({ children, ...props }) => (
            <ul 
              className="space-y-2 mb-4 text-white text-sm md:text-base ml-4"
              {...props}
            >
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol 
              className="space-y-2 mb-4 text-white text-sm md:text-base ml-4"
              {...props}
            >
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => (
            <li 
              className="text-white marker:text-cyan-400"
              {...props}
            >
              {children}
            </li>
          ),
          
          // Link styles
          a: ({ href, children, ...props }) => (
            <a 
              href={href}
              className="text-sky-blue hover:text-cyan-300 underline decoration-sky-blue/50 hover:decoration-cyan-300 transition-colors duration-200"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            >
              {children}
            </a>
          ),
          
          // Code styles
          code: ({ children, className, ...props }) => {
            const isInline = !className?.includes('language-');
            return isInline ? (
              <code 
                className="bg-navy-700/60 text-cyan-200 px-2 py-1 rounded text-sm font-mono border border-sky-blue/30"
                {...props}
              >
                {children}
              </code>
            ) : (
              <code 
                className="block bg-navy-700/40 text-gray-100 p-4 rounded-lg font-mono text-sm border border-sky-blue/20 overflow-x-auto whitespace-pre-wrap"
                {...props}
              >
                {children}
              </code>
            );
          },
          
          // Code block wrapper
          pre: ({ children, ...props }) => (
            <pre 
              className="bg-navy-700/40 rounded-lg border border-sky-blue/20 overflow-x-auto mb-4"
              {...props}
            >
              {children}
            </pre>
          ),
          
          // Block quote styles
          blockquote: ({ children, ...props }) => (
            <blockquote 
              className="border-l-4 border-cyan-400 pl-4 my-4 text-white italic bg-navy-800/40 py-3 rounded-r"
              {...props}
            >
              {children}
            </blockquote>
          ),
          
          // Table styles
          table: ({ children, ...props }) => (
            <div className="overflow-x-auto mb-4">
              <table 
                className="min-w-full border-collapse border border-sky-blue/30 rounded-lg overflow-hidden"
                {...props}
              >
                {children}
              </table>
            </div>
          ),
          thead: ({ children, ...props }) => (
            <thead 
              className="bg-sky-blue/10"
              {...props}
            >
              {children}
            </thead>
          ),
          th: ({ children, ...props }) => (
            <th 
              className="border border-sky-blue/30 px-3 py-2 text-left font-semibold text-sky-blue text-sm"
              {...props}
            >
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td 
              className="border border-sky-blue/20 px-3 py-2 text-white text-sm"
              {...props}
            >
              {children}
            </td>
          ),
          
          // Horizontal rule
          hr: ({ ...props }) => (
            <hr 
              className="my-6 border-sky-blue/30"
              {...props}
            />
          ),
          
          // Strong and emphasis - Enhanced styling for different types of bold content
          strong: ({ children, ...props }) => {
            const text = children?.toString() || '';
            
            // Check if this is a triple asterisk player name (***Name***) 
            // These come as <strong><em>Name</em></strong> in the DOM
            const hasItalicChild = React.Children.toArray(children).some(
              child => React.isValidElement(child) && (child.type === 'em' || child.props?.className?.includes('italic'))
            );
            
            // Also check if the text looks like a player/team name even without nested em
            const looksLikePlayerName = text && (
              /^[A-Z][a-z]+ [A-Z][a-z]+/.test(text.trim()) || // First Last pattern
              text.includes('D/ST') || // Defense/Special Teams
              text.includes('Defense') ||
              (text.length > 3 && text.length < 50 && /^[A-Z]/.test(text) && !text.includes('%') && !text.includes('yards'))
            );
            
            // Player names (with team in parentheses) get green styling
            const isPlayerName = text.includes('(') && text.includes(')') && 
              (text.includes('Ravens') || text.includes('Bills') || text.includes('Bengals') || 
               text.includes('Commanders') || text.includes('Cardinals') || text.includes('Texans') ||
               text.includes('Cowboys') || text.includes('Bears') || text.includes('Eagles') ||
               text.includes('Lions') || text.includes('Colts') || text.includes('Packers') ||
               text.includes('Rams') || text.includes('Panthers') || text.includes('Falcons') ||
               text.includes('Jets') || text.includes('Dolphins') || text.includes('Vikings') ||
               text.includes('Titans') || text.includes('Saints') || text.includes('Chiefs') ||
               text.includes('Chargers') || text.includes('Raiders') || text.includes('Broncos') ||
               text.includes('Steelers') || text.includes('Browns') || text.includes('49ers') ||
               text.includes('Seahawks') || text.includes('Giants') || text.includes('Patriots') ||
               text.includes('Jaguars') || text.includes('Buccaneers') || text.includes('Redskins'));
            
            // Key metrics and percentages get cyan styling
            const isMetric = text.includes('%') || text.includes('Likelihood') || 
              text.includes('yards') || text.includes('touchdowns') || text.includes('carries') ||
              text.includes('attempts') || text.includes('games') || /^\d+[\d,]*$/.test(text.trim());
            
            // Determine styling based on content type
            let className;
            if (hasItalicChild || isPlayerName || looksLikePlayerName) {
              // Triple asterisk player names, team-based player names, or names that look like players get green
              className = "font-bold text-green-400 text-shadow-sm";
            } else if (isMetric) {
              className = "font-bold text-cyan-300";
            } else {
              className = "font-bold text-white";
            }
            
            return (
              <strong 
                className={className}
                {...props}
              >
                {children}
              </strong>
            );
          },
          em: ({ children, ...props }) => {
            // For triple asterisks (***text***), the em is nested inside strong
            // and should be rendered as non-italic green text for player names
            return (
              <span 
                className="not-italic"
                {...props}
              >
                {children}
              </span>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};