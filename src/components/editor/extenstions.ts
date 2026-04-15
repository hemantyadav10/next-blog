import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import { UniqueID } from '@tiptap/extension-unique-id';
import { Placeholder } from '@tiptap/extensions';
import type { Extensions } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import css from 'highlight.js/lib/languages/css';
import js from 'highlight.js/lib/languages/javascript';
import ts from 'highlight.js/lib/languages/typescript';
import html from 'highlight.js/lib/languages/xml';
import { all, createLowlight } from 'lowlight';

export const lowlight = createLowlight(all);
lowlight.register('css', css);
lowlight.register('javascript', js);
lowlight.register('typescript', ts);
lowlight.register('html', html);

export const editorExtensions: Extensions = [
  StarterKit.configure({
    heading: { levels: [2, 3, 4] },
    codeBlock: false,
  }),
  Highlight,
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
  Placeholder.configure({
    placeholder: ({ node }) => {
      if (node.type.name === 'codeBlock') {
        return '';
      }

      return `Write, type '/' for commands...`;
    },
  }),
  UniqueID.configure({
    types: ['heading'],
  }),
];

export const serverEditorExtensions = [
  ...editorExtensions,
  CodeBlockLowlight.configure({ lowlight }),
];
