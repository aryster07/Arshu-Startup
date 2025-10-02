/**
 * Law Bandhu Design System - Typography Component
 */

import React from 'react';

interface TypographyProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'body-sm' | 'caption' | 'overline';
  as?: keyof JSX.IntrinsicElements;
  children: React.ReactNode;
  className?: string;
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  as,
  children,
  className = '',
}) => {
  const baseClasses = 'font-inter';
  
  const variantClasses = {
    h1: 'text-4xl font-bold text-slate-900 leading-tight',
    h2: 'text-3xl font-bold text-slate-900 leading-tight',
    h3: 'text-2xl font-semibold text-slate-900 leading-snug',
    h4: 'text-xl font-semibold text-slate-900 leading-snug',
    h5: 'text-lg font-medium text-slate-900 leading-snug',
    h6: 'text-base font-medium text-slate-900 leading-snug',
    body: 'text-base text-slate-700 leading-relaxed',
    'body-sm': 'text-sm text-slate-600 leading-relaxed',
    caption: 'text-xs text-slate-500 leading-relaxed',
    overline: 'text-xs font-medium text-slate-500 uppercase tracking-wide leading-relaxed',
  };

  const elementMap = {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    h5: 'h5',
    h6: 'h6',
    body: 'p',
    'body-sm': 'p',
    caption: 'span',
    overline: 'span',
  };

  const Element = as || elementMap[variant];
  const combinedClassName = `${baseClasses} ${variantClasses[variant]} ${className}`;

  if (Element === 'h1') {
    return <h1 className={combinedClassName}>{children}</h1>;
  }
  if (Element === 'h2') {
    return <h2 className={combinedClassName}>{children}</h2>;
  }
  if (Element === 'h3') {
    return <h3 className={combinedClassName}>{children}</h3>;
  }
  if (Element === 'h4') {
    return <h4 className={combinedClassName}>{children}</h4>;
  }
  if (Element === 'h5') {
    return <h5 className={combinedClassName}>{children}</h5>;
  }
  if (Element === 'h6') {
    return <h6 className={combinedClassName}>{children}</h6>;
  }
  if (Element === 'p') {
    return <p className={combinedClassName}>{children}</p>;
  }
  if (Element === 'span') {
    return <span className={combinedClassName}>{children}</span>;
  }
  
  // Default fallback
  return <p className={combinedClassName}>{children}</p>;
};