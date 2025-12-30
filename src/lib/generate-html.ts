import { BaseEditorKit } from '@/components/editor-base-kit';
import { EditorStatic } from '@/components/ui/editor-static';
import sanitizeHtml from 'sanitize-html';
import { createSlateEditor, Value } from 'platejs';
import { serializeHtml } from 'platejs/static';

export async function getMyHtml({ value }: { value: Value }) {
  // Create a server-side editor instance with components
  const editor = createSlateEditor({
    plugins: [...BaseEditorKit],
    value: value,
  });

  const html = await serializeHtml(editor, {
    editorComponent: EditorStatic,
    props: { variant: 'none' },
  });

  const cleanHtml = sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
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
    ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      '*': ['class', 'id', 'style'],
      img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
      a: ['href', 'name', 'target', 'rel'],
      iframe: ['src', 'width', 'height', 'frameborder', 'allowfullscreen'],
      video: ['src', 'controls', 'width', 'height'],
      audio: ['src', 'controls'],
      source: ['src', 'type'],
    },
    allowedStyles: {
      '*': {
        // Allow common CSS properties
        color: [/^#(0x)?[0-9a-f]+$/i, /^rgb\(/],
        'text-align': [/^left$/, /^right$/, /^center$/],
        'font-size': [/^\d+(?:px|em|%)$/],
        'background-color': [/^#(0x)?[0-9a-f]+$/i, /^rgb\(/],
        'font-weight': [/^\d+$/, /^bold$/, /^normal$/],
        'font-style': [/^italic$/, /^normal$/],
        'text-decoration': [/^underline$/, /^line-through$/, /^none$/],
      },
    },
  });

  return cleanHtml;
}
