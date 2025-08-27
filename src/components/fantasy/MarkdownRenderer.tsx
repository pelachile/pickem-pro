import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

// Simple built-in markdown renderer (no external dependencies)
export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const renderMarkdown = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactElement[] = [];
    let currentParagraph: string[] = [];
    let listItems: string[] = [];
    let isInList = false;

    const flushParagraph = () => {
      if (currentParagraph.length > 0) {
        const paragraphText = currentParagraph.join(' ').trim();
        if (paragraphText) {
          elements.push(
            <p key={elements.length} className="text-white/90 mb-4 leading-relaxed">
              {parseInlineElements(paragraphText)}
            </p>
          );
        }
        currentParagraph = [];
      }
    };

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={elements.length} className="text-white/90 mb-4 list-disc list-inside space-y-1">
            {listItems.map((item, idx) => (
              <li key={idx}>{parseInlineElements(item)}</li>
            ))}
          </ul>
        );
        listItems = [];
        isInList = false;
      }
    };

    const parseInlineElements = (text: string): (string | React.ReactElement)[] => {
      const parts: (string | React.ReactElement)[] = [];
      let remaining = text;
      let keyCounter = 0;

      while (remaining) {
        // Handle triple asterisks (***text***)
        const tripleMatch = remaining.match(/^(.*?)\*\*\*(.*?)\*\*\*(.*)/);
        if (tripleMatch) {
          if (tripleMatch[1]) parts.push(tripleMatch[1]);
          
          const boldItalicText = tripleMatch[2];
          const isPlayerName = /^[A-Z][a-z]+ [A-Z][a-z]+/.test(boldItalicText.trim()) || 
                              boldItalicText.includes('D/ST') || 
                              boldItalicText.includes('Defense');
          
          parts.push(
            <strong key={keyCounter++} className={isPlayerName ? "text-green-400 font-bold text-shadow-sm italic" : "text-white font-bold italic"}>
              {boldItalicText}
            </strong>
          );
          remaining = tripleMatch[3];
          continue;
        }

        // Handle double asterisks (**text**)
        const doubleMatch = remaining.match(/^(.*?)\*\*(.*?)\*\*(.*)/);
        if (doubleMatch) {
          if (doubleMatch[1]) parts.push(doubleMatch[1]);
          
          const boldText = doubleMatch[2];
          const isPlayerName = /^[A-Z][a-z]+ [A-Z][a-z]+/.test(boldText.trim()) || 
                              boldText.includes('D/ST') || 
                              boldText.includes('Defense');
          
          parts.push(
            <strong key={keyCounter++} className={isPlayerName ? "text-green-400 font-bold text-shadow-sm" : "text-white font-bold"}>
              {boldText}
            </strong>
          );
          remaining = doubleMatch[3];
          continue;
        }

        // Handle single asterisks (*text*)
        const singleMatch = remaining.match(/^(.*?)\*(.*?)\*(.*)/);
        if (singleMatch) {
          if (singleMatch[1]) parts.push(singleMatch[1]);
          parts.push(
            <em key={keyCounter++} className="italic text-white/90">
              {singleMatch[2]}
            </em>
          );
          remaining = singleMatch[3];
          continue;
        }

        // Handle inline code (`code`)
        const codeMatch = remaining.match(/^(.*?)`(.*?)`(.*)/);
        if (codeMatch) {
          if (codeMatch[1]) parts.push(codeMatch[1]);
          parts.push(
            <code key={keyCounter++} className="bg-white/10 text-sunrise-400 px-1 py-0.5 rounded text-sm">
              {codeMatch[2]}
            </code>
          );
          remaining = codeMatch[3];
          continue;
        }

        // No more matches, add remaining text
        parts.push(remaining);
        break;
      }

      return parts;
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      // Empty line
      if (!trimmed) {
        if (isInList) {
          flushList();
        } else {
          flushParagraph();
        }
        return;
      }

      // Headers
      if (trimmed.startsWith('### ')) {
        flushParagraph();
        flushList();
        elements.push(
          <h3 key={elements.length} className="text-xl font-bold text-sunset-500 mb-3 text-shadow-sm">
            {parseInlineElements(trimmed.slice(4))}
          </h3>
        );
        return;
      }

      if (trimmed.startsWith('## ')) {
        flushParagraph();
        flushList();
        elements.push(
          <h2 key={elements.length} className="text-2xl font-bold text-sunrise-500 mb-4 text-shadow-sm">
            {parseInlineElements(trimmed.slice(3))}
          </h2>
        );
        return;
      }

      if (trimmed.startsWith('# ')) {
        flushParagraph();
        flushList();
        elements.push(
          <h1 key={elements.length} className="text-3xl font-bold text-sky-400 mb-6 text-shadow-sm">
            {parseInlineElements(trimmed.slice(2))}
          </h1>
        );
        return;
      }

      // List items
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        flushParagraph();
        isInList = true;
        listItems.push(trimmed.slice(2));
        return;
      }

      // Blockquotes
      if (trimmed.startsWith('> ')) {
        flushParagraph();
        flushList();
        elements.push(
          <blockquote key={elements.length} className="border-l-4 border-sky-400 pl-4 italic text-white/80 mb-4">
            {parseInlineElements(trimmed.slice(2))}
          </blockquote>
        );
        return;
      }

      // Regular paragraph text
      if (isInList) {
        flushList();
      }
      currentParagraph.push(trimmed);
    });

    // Flush any remaining content
    flushParagraph();
    flushList();

    return elements;
  };

  return (
    <div className="prose prose-invert max-w-none">
      {renderMarkdown(content)}
    </div>
  );
};