import { BaseAlignKit } from './plugins/align-base-kit';
import { BaseBasicBlocksKit } from './plugins/basic-blocks-base-kit';
import { BaseBasicMarksKit } from './plugins/basic-marks-base-kit';
import { BaseCodeBlockKit } from './plugins/code-block-base-kit';
import { BaseFontKit } from './plugins/font-base-kit';
import { BaseLineHeightKit } from './plugins/line-height-base-kit';
import { BaseLinkKit } from './plugins/link-base-kit';
import { BaseListKit } from './plugins/list-base-kit';
import { BaseMathKit } from './plugins/math-base-kit';
import { BaseMediaKit } from './plugins/media-base-kit';

export const BaseEditorKit = [
  ...BaseBasicBlocksKit,
  ...BaseAlignKit,
  ...BaseBasicMarksKit,
  ...BaseFontKit,
  ...BaseMathKit,
  ...BaseLinkKit,
  ...BaseListKit,
  ...BaseLineHeightKit,
  ...BaseCodeBlockKit,
  ...BaseMediaKit,
  // ...BaseTocKit,
  // ...MarkdownKit,
  // ...BaseTableKit,
  // ...BaseToggleKit,
  // ...BaseCalloutKit,
  // ...BaseColumnKit,
  // ...BaseDateKit,
  // ...BaseMentionKit,
  // ...BaseCommentKit,
  // ...BaseSuggestionKit,
];
