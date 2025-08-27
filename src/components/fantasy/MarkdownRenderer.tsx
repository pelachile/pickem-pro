import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="prose prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Enhanced strong (bold) text with player name detection
          strong: ({ children, ...props }) => {
            const text = children?.toString() || '';
            
            // Check if this strong element contains an italic child (triple asterisks ***)
            const hasItalicChild = React.Children.toArray(children).some(
              child => React.isValidElement(child) && (child.type === 'em' || child.props?.className?.includes('italic'))
            );
            
            // Check if the text looks like a player name or contains special indicators
            const looksLikePlayerName = text && (
              /^[A-Z][a-z]+ [A-Z][a-z]+/.test(text.trim()) || // "First Last" pattern
              text.includes('D/ST') || 
              text.includes('Defense')
            );
            
            // Apply green styling to player names (both **bold** and ***bold-italic***)
            if (hasItalicChild || looksLikePlayerName) {
              return (
                <strong {...props} className="text-green-400 font-bold text-shadow-sm">
                  {children}
                </strong>
              );
            }
            
            return (
              <strong {...props} className="text-white font-bold">
                {children}
              </strong>
            );
          },
          
          // Style headings with custom colors
          h1: ({ children, ...props }) => (
            <h1 {...props} className="text-3xl font-bold text-sky-400 mb-6 text-shadow-sm">
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2 {...props} className="text-2xl font-bold text-sunrise-500 mb-4 text-shadow-sm">
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3 {...props} className="text-xl font-bold text-sunset-500 mb-3 text-shadow-sm">
              {children}
            </h3>
          ),
          
          // Style paragraphs
          p: ({ children, ...props }) => (
            <p {...props} className="text-white/90 mb-4 leading-relaxed">
              {children}
            </p>
          ),
          
          // Style lists
          ul: ({ children, ...props }) => (
            <ul {...props} className="text-white/90 mb-4 list-disc list-inside space-y-1">
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol {...props} className="text-white/90 mb-4 list-decimal list-inside space-y-1">
              {children}
            </ol>
          ),
          
          // Style links
          a: ({ children, ...props }) => (
            <a {...props} className="text-sky-400 hover:text-sky-300 underline transition-colors duration-200">
              {children}
            </a>
          ),
          
          // Style code
          code: ({ children, ...props }) => (
            <code {...props} className="bg-white/10 text-sunrise-400 px-1 py-0.5 rounded text-sm">
              {children}
            </code>
          ),
          
          // Style blockquotes
          blockquote: ({ children, ...props }) => (
            <blockquote {...props} className="border-l-4 border-sky-400 pl-4 italic text-white/80 mb-4">
              {children}
            </blockquote>
          ),
          
          // Style tables
          table: ({ children, ...props }) => (
            <div className="overflow-x-auto mb-4">
              <table {...props} className="min-w-full border-collapse border border-white/20">
                {children}
              </table>
            </div>
          ),
          th: ({ children, ...props }) => (
            <th {...props} className="border border-white/20 bg-white/10 px-3 py-2 text-left font-semibold text-sky-400">
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td {...props} className="border border-white/20 px-3 py-2 text-white/90">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};