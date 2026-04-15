import { serverEditorExtensions } from '@/components/editor/extenstions';
import { generateHTML } from '@tiptap/html';
import type { JSONContent } from '@tiptap/react';
import hljs from 'highlight.js';
import sanitizeHtml from 'sanitize-html';

export function getMyHtml({ value }: { value: JSONContent }) {
  // 1. Generate base HTML
  const rawHtml = generateHTML(value, serverEditorExtensions);

  // 2. Highlighting Pass (Essential since generateHTML isn't doing it)
  const html = rawHtml.replace(
    /<code class="language-(\w+)">([\s\S]*?)<\/code>/g,
    (_, lang, encoded) => {
      // Unescape entities so hljs can read the actual symbols
      const code = encoded
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");

      try {
        const highlighted = hljs.highlight(code, { language: lang }).value;
        return `<code class="hljs language-${lang}">${highlighted}</code>`;
      } catch {
        return `<code class="hljs language-${lang}">${encoded}</code>`;
      }
    },
  );

  // 3. Final Sanitation
  return sanitizeHtml(html, {
    allowedTags: [
      ...sanitizeHtml.defaults.allowedTags,
      'img',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'figure',
      'figcaption',
      'video',
      'audio',
      'source',
      'iframe',
      'span',
      'div',
      'section',
      'article',
      'pre',
      'code',
    ],
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      '*': ['class', 'id', 'style', 'data-*'],
      img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
      a: ['href', 'name', 'target', 'rel'],
      iframe: ['src', 'width', 'height', 'allowfullscreen', 'sandbox', 'allow'],
      // CRITICAL: Span needs class to hold the highlighter colors
      span: ['class'],
      code: ['class'],
    },
    // CRITICAL: Explicitly allow the hljs token classes
    allowedClasses: {
      span: ['hljs-*'],
      code: ['hljs', 'language-*'],
      pre: ['not-prose'],
    },
    allowedIframeHostnames: [
      'www.youtube.com',
      'player.vimeo.com',
      'youtube.com',
    ],
    allowedStyles: {
      '*': {
        color: [/^#(0x)?[0-9a-f]+$/i, /^rgb\(/, /^oklch\(/],
        'text-align': [/^left$/, /^right$/, /^center$/, /^justify$/],
        'background-color': [/^#(0x)?[0-9a-f]+$/i, /^rgb\(/, /^oklch\(/],
        'font-weight': [/^\d+$/, /^bold$/, /^normal$/],
        'font-style': [/^italic$/, /^normal$/],
        'text-decoration': [/^underline$/, /^line-through$/, /^none$/],
      },
    },
    transformTags: {
      pre: sanitizeHtml.simpleTransform('pre', { class: 'not-prose' }),
    },
  });
}
