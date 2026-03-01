import {
  BaseBlockquotePlugin,
  BaseH2Plugin,
  BaseH3Plugin,
  BaseHorizontalRulePlugin,
} from '@platejs/basic-nodes';
import { BaseParagraphPlugin } from 'platejs';

import { BlockquoteElementStatic } from '@/components/ui/blockquote-node-static';
import {
  H2ElementStatic,
  H3ElementStatic,
} from '@/components/ui/heading-node-static';
import { HrElementStatic } from '@/components/ui/hr-node-static';
import { ParagraphElementStatic } from '@/components/ui/paragraph-node-static';

export const BaseBasicBlocksKit = [
  BaseParagraphPlugin.withComponent(ParagraphElementStatic),
  BaseH2Plugin.withComponent(H2ElementStatic),
  BaseH3Plugin.withComponent(H3ElementStatic),
  BaseBlockquotePlugin.withComponent(BlockquoteElementStatic),
  BaseHorizontalRulePlugin.withComponent(HrElementStatic),
];
