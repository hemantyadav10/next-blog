'use client';

import { postComment } from '@/app/actions/commentActions';
import { CommentResponse } from '@/types/comment.types';
import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import { useRef, useTransition } from 'react';
import { toast } from 'sonner';
import RichTextCommentEditor, {
  RichTextCommentEditorRef,
} from '../editor/RichTextCommentEditor';

export type User = {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
};

type CommentEditorProps = {
  user: User;
  blogId: string;
};

function CommentEditor({ user, blogId }: CommentEditorProps) {
  const [isPending, startTransition] = useTransition();
  const editorRef = useRef<RichTextCommentEditorRef>(null);
  const queryClient = useQueryClient();

  const handlePostComment = () => {
    const content = editorRef.current?.getContent() ?? '';

    startTransition(async () => {
      const response = await postComment({
        content: content,
        blogId,
      });

      if (response.success) {
        toast.success('Comment posted');

        // Clear comment and
        editorRef.current?.clearContent();

        // Update cache
        queryClient.setQueryData<InfiniteData<CommentResponse>>(
          ['comments', blogId],
          (oldData) => {
            if (!oldData) return;

            return {
              ...oldData,
              pages: oldData.pages.map((page, idx) => {
                if (idx === 0) {
                  return {
                    comments: [
                      { userId: user, ...response.data },
                      ...page.comments,
                    ],
                    pageInfo: {
                      ...page.pageInfo,
                      totalCount: page.pageInfo.totalCount + 1,
                    },
                  };
                }
                return page;
              }),
            };
          },
        );
      } else if (response.error) {
        console.error({ error: response.error, details: response.errors });
        toast.error(response.error);
      }
    });
  };

  return (
    <RichTextCommentEditor
      firstName={user.firstName}
      profilePicture={user.profilePicture}
      blogId={blogId}
      onSubmit={handlePostComment}
      isLoading={isPending}
      ref={editorRef}
    />
  );
}

export default CommentEditor;
