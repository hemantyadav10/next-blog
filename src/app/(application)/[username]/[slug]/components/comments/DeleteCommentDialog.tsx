'use client';

import { deleteComment } from '@/app/actions/commentActions';
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
import { Spinner } from '@/components/ui/spinner';
import { CommentResponse } from '@/types/comment.types';
import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import { useTransition } from 'react';
import { toast } from 'sonner';

interface DeleteCommentDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  commentId: string;
  blogId: string;
  parentId: string | null;
}

function DeleteCommentDialog({
  open = false,
  setOpen,
  commentId,
  blogId,
  parentId,
}: DeleteCommentDialogProps) {
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();

  const handleDeleteComment = () => {
    const formData = new FormData();
    formData.set('id', commentId);

    startTransition(async () => {
      const response = await deleteComment(formData);
      if (response.success) {
        toast.success('Comment deleted successfully');
        setOpen(false);

        // Check if this is a reply or top-level comment
        if (parentId) {
          // This is a reply - update the replies cache
          queryClient.setQueryData<InfiniteData<CommentResponse>>(
            ['replies', blogId, parentId],
            (oldData) => {
              if (!oldData) return oldData;

              return {
                ...oldData,
                pages: oldData.pages.map((page) => {
                  const hasComment = page.comments.some(
                    (comment) => comment._id === commentId,
                  );

                  if (!hasComment) return page;

                  return {
                    ...page,
                    comments: page.comments.map((comment) => {
                      return comment._id === commentId
                        ? {
                            ...comment,
                            userId: null,
                            content: 'Comment deleted',
                            isDeleted: true,
                          }
                        : comment;
                    }),
                  };
                }),
              };
            },
          );
        } else {
          // This is a top-level comment - update main comments cache
          queryClient.setQueryData<InfiniteData<CommentResponse>>(
            ['comments', blogId],
            (oldData) => {
              if (!oldData) return oldData;

              return {
                ...oldData,
                pages: oldData.pages.map((page) => {
                  const hasComment = page.comments.some(
                    (comment) => comment._id === commentId,
                  );

                  if (!hasComment) return page;

                  return {
                    ...page,
                    comments: page.comments.map((comment) => {
                      return comment._id === commentId
                        ? {
                            ...comment,
                            userId: null,
                            content: 'Comment deleted',
                            isDeleted: true,
                          }
                        : comment;
                    }),
                  };
                }),
              };
            },
          );
        }
      } else if (!response.success) {
        toast.error(response.error);
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="sm:max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this comment?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            comment.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <Button
            disabled={isPending}
            variant={'destructive'}
            onClick={handleDeleteComment}
          >
            {isPending && <Spinner />} {isPending ? 'Deleting' : 'Delete'}{' '}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteCommentDialog;
