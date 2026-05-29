import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import 'katex/dist/katex.min.css';

const markdownPlugins = [remarkGfm, remarkMath];
const htmlPlugins = [rehypeKatex];

const inlineComponents = {
  p({ children }) {
    return <>{children}</>;
  },
};

function safeUrlTransform(url) {
  if (!url) {
    return '';
  }

  if (url.startsWith('#') || url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) {
    return url;
  }

  try {
    const parsed = new URL(url);
    if (['http:', 'https:', 'mailto:', 'tel:'].includes(parsed.protocol)) {
      return url;
    }
  } catch {
    return '';
  }

  return '';
}

export default function RichText({ source, fallback = '', inline = false, className = '' }) {
  const value = String(source || fallback || '').trim();
  const Wrapper = inline ? 'span' : 'div';
  const classes = ['rich-text', inline ? 'rich-text-inline' : '', className].filter(Boolean).join(' ');

  if (!value) {
    return null;
  }

  return (
    <Wrapper className={classes}>
      <ReactMarkdown
        remarkPlugins={markdownPlugins}
        rehypePlugins={htmlPlugins}
        skipHtml
        urlTransform={safeUrlTransform}
        components={inline ? inlineComponents : undefined}
      >
        {value}
      </ReactMarkdown>
    </Wrapper>
  );
}
