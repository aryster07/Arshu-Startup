import { marked } from 'marked';
import { useEffect, useState } from 'react';

interface FormattedMessageProps {
  text: string;
}

export function FormattedMessage({ text }: FormattedMessageProps) {
  const [html, setHtml] = useState('');

  useEffect(() => {
    // Remove citation numbers like [1], [2], [3], etc.
    const cleanedText = text.replace(/\[\d+\]/g, '');
    
    // Configure marked options
    marked.setOptions({
      breaks: true, // Convert line breaks to <br>
      gfm: true, // GitHub Flavored Markdown
    });

    // Parse markdown to HTML
    const parsedHtml = marked.parse(cleanedText) as string;
    setHtml(parsedHtml);
  }, [text]);

  return (
    <div 
      className="formatted-message-response"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
