import { marked } from 'marked';
import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FormattedMessageProps {
  text: string;
}

export function FormattedMessage({ text }: FormattedMessageProps) {
  const [html, setHtml] = useState('');
  const [summary, setSummary] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Remove citation numbers like [1], [2], [3], etc.
    const cleanedText = text.replace(/\[\d+\]/g, '');
    
    // Configure marked options
    marked.setOptions({
      breaks: true,
      gfm: true,
    });

    // Parse full markdown to HTML
    const parsedHtml = marked.parse(cleanedText) as string;
    setHtml(parsedHtml);

    // Generate compact summary (first 3-4 key points)
    const summaryText = generateSummary(cleanedText);
    const summaryHtml = marked.parse(summaryText) as string;
    setSummary(summaryHtml);
  }, [text]);

  // Extract key points for summary
  const generateSummary = (text: string): string => {
    const lines = text.split('\n').filter(line => line.trim());
    const keyPoints: string[] = [];
    let foundHeading = false;
    
    for (const line of lines) {
      // Skip empty lines
      if (!line.trim()) continue;
      
      // Capture important headers and first few bullet points
      if (line.startsWith('#') || line.startsWith('**') || line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
        if (keyPoints.length < 5) {
          keyPoints.push(line);
          foundHeading = true;
        }
      } else if (!foundHeading && keyPoints.length < 2) {
        // Get first couple of sentences if no structured content
        keyPoints.push(line);
      }
    }

    // If we got nothing meaningful, take first 300 chars
    if (keyPoints.length === 0) {
      return text.substring(0, 300) + (text.length > 300 ? '...' : '');
    }

    return keyPoints.join('\n\n');
  };

  const hasMoreContent = html.length > summary.length + 50;

  return (
    <div className="formatted-message-container">
      {/* Compact Summary View */}
      <div 
        className="formatted-message-response compact-view"
        dangerouslySetInnerHTML={{ __html: isExpanded ? html : summary }}
        style={{
          fontSize: '14px',
          lineHeight: '1.6',
        }}
      />
      
      {/* See More / See Less Button */}
      {hasMoreContent && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 mt-3 px-4 py-2 text-sm font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all"
          style={{
            border: '1px solid #3b82f6',
            background: 'transparent',
          }}
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              See Full Analysis
            </>
          )}
        </button>
      )}
    </div>
  );
}
