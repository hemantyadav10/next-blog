'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  BarChart3Icon,
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface PostActionProps {
  title: string;
  slug: string;
  authorUsername: string;
}

function PostActions({ title, authorUsername, slug }: PostActionProps) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label="more options"
            title="More options"
            variant="ghost"
            size={'icon'}
            className="ml-auto"
          >
            <EllipsisVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem asChild>
            <Link href={`/${authorUsername}/${slug}/edit`}>
              <PencilIcon />
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <BarChart3Icon />
            Stats
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            title={`Delete post`}
            aria-label={`Delete post`}
            variant="destructive"
            onClick={() => setOpen(true)}
          >
            <TrashIcon />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteDialog open={open} setOpen={(open) => setOpen(open)} />
    </div>
  );
}

export default PostActions;

function DeleteDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Post?</AlertDialogTitle>
          <Alert>
            <AlertTitle>Recommendation:</AlertTitle>
            <AlertDescription>
              Instead of deleting, consider unpublishing your post. This keeps
              your content and its history while removing it from public view.
              You can always republish it later.
            </AlertDescription>
          </Alert>
          <AlertDialogDescription>
            <strong>Warning:</strong> Deleting your post is permanent and cannot
            be undone. All comments, reactions, and statistics will be lost.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {/* TODO: implement delete functionality */}
          <Button variant={'destructive'}>Delete</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
