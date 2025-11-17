import { BaseEditorKit } from '@/components/editor-base-kit';
import { EditorStatic } from '@/components/ui/editor-static';
import DOMPurify from 'isomorphic-dompurify';
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

  const cleanHtml = DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });

  return cleanHtml;
}
