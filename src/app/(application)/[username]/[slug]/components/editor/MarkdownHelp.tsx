import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { InfoIcon } from 'lucide-react';

function MarkdownHelp() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={'icon'} variant="ghost" title="Markdown Help">
          <InfoIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editor Guide</DialogTitle>
          <DialogDescription>
            Use these Markdown shortcuts or the toolbar to format your comment.
          </DialogDescription>
        </DialogHeader>
        <div className="-mx-6 max-h-[50vh] overflow-y-auto px-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Shortcut</TableHead>
                <TableHead>Style / Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <ShortcutRow symbol="# + Space" label="Heading" />
              <ShortcutRow symbol="**Bold**" label="Bold" />
              <ShortcutRow symbol="*Italic*" label="Italic" />
              <ShortcutRow symbol="Ctrl+U" label="Underline" />
              <ShortcutRow symbol="~~Strike~~" label="Strikethrough" />
              <ShortcutRow symbol="[Link](url)" label="Link" />
              <ShortcutRow symbol="> + Space" label="Quote" />
              <ShortcutRow symbol="* + Space" label="Bullet List" />
              <ShortcutRow symbol="---" label="Divider" />
              <ShortcutRow symbol="`code`" label="Inline Code" />
              <ShortcutRow symbol="``` + Enter" label="Code Block" />
            </TableBody>
          </Table>
        </div>
        <DialogFooter>
          <div className="bg-muted/50 rounded-md border p-3">
            <p className="text-muted-foreground text-xs italic">
              <span className="text-foreground font-semibold not-italic">
                Pro-tip:
              </span>{' '}
              Type the symbols followed by Space or Enter to trigger formatting
              instantly.
            </p>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default MarkdownHelp;

function ShortcutRow({ symbol, label }: { symbol: string; label: string }) {
  return (
    <TableRow>
      <TableCell className="text-primary font-mono text-xs font-medium">
        <span className="bg-primary/5 border-primary/10 rounded border px-1.5 py-0.5">
          {symbol}
        </span>
      </TableCell>
      <TableCell className="text-muted-foreground text-sm">{label}</TableCell>
    </TableRow>
  );
}
