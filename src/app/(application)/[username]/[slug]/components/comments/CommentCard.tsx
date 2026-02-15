'use client';

import { postComment, updateComment } from '@/app/actions/commentActions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useMediaQuery } from '@/hooks/use-media-query';
import { cn, tiptapSanitizeConfig } from '@/lib/utils';
import type { CommentItem, CommentResponse } from '@/types/comment.types';
import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import {
  ArrowRight,
  ChevronDownIcon,
  ChevronsDownUp,
  ChevronsUpDown,
  ChevronUpIcon,
  CopyIcon,
  EllipsisIcon,
  ExternalLinkIcon,
  FlagIcon,
  HeartIcon,
  MessageCircleIcon,
  PencilIcon,
  PlusCircleIcon,
  TrashIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Activity, useRef, useState, useTransition } from 'react';
import sanitizeHtml from 'sanitize-html';
import { toast } from 'sonner';
import RichTextCommentEditor, {
  type RichTextCommentEditorRef,
} from '../editor/RichTextCommentEditor';
import LoginPromptDialog from '../LoginPromptDialog';
import type { User } from './CommentEditor';
import CommentList from './CommentList';
import DeleteCommentDialog from './DeleteCommentDialog';

interface CommentItemProps {
  depth?: number;
  isAuthenticated: boolean;
  user: User | undefined;
  comment: CommentItem;
  blogId: string;
  isCommentsEnabled: boolean;
  slug: string;
  authorUsername: string;
  viewReplies?: boolean;
}

const CommentItem = ({
  comment,
  depth = 0,
  isAuthenticated,
  user,
  blogId,
  isCommentsEnabled,
  slug,
  authorUsername,
  viewReplies = false,
}: CommentItemProps) => {
  const [showReplyBox, setShowReplyBox] = useState<boolean>(false);
  const editorRef = useRef<RichTextCommentEditorRef>(null);
  const [showReplies, setShowReplies] = useState<boolean>(viewReplies);
  const [showThread, setShowThread] = useState<boolean>(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const commentPath = `/${authorUsername}/${slug}/comments/${comment._id}`;
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const MAX_NESTING_DEPTH = isDesktop ? 7 : 3;
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const isOwner = isAuthenticated && comment.userId?._id === user?._id;
  const {
    firstName,
    username = '[deleted]',
    profilePicture,
  } = comment.userId ?? {};
  const isCommentDeleted = comment.isDeleted && !comment.userId;
  const commentCreatedAt = formatDistanceToNow(new Date(comment.createdAt), {
    addSuffix: true,
    includeSeconds: true,
  });
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();

  // TODO: Implement read more commment content functionality
  // With the current approach read more only shows for replies, not for top level comments

  // const [isExpanded, setIsExpanded] = useState<boolean>(false);
  // const [isTruncated, setIsTruncated] = useState<boolean>(false);

  // useLayoutEffect(() => {
  //     const element = contentRef.current;
  //     if (element) {
  //       setIsTruncated(element.scrollHeight > element.clientHeight);
  //     }
  // }, [comment.content]);

  const handleReplyClick = () => {
    if (depth === MAX_NESTING_DEPTH) {
      router.push(commentPath);
    } else {
      setShowReplyBox(true);
      requestAnimationFrame(() => {
        editorRef.current?.focus();
      });
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    requestAnimationFrame(() => {
      editorRef.current?.focus();
    });
  };

  const handleCancel = () => {
    setShowReplyBox(false);
  };

  const handleToggleReply = () => {
    if (depth === MAX_NESTING_DEPTH) {
      router.push(commentPath);
    } else {
      setShowReplies((prev) => !prev);
    }
  };

  const handleToggleThread = () => {
    setShowThread((prev) => !prev);
  };

  const directReplyCount = comment.replyCount || 0;
  const descendantCount = comment.visibleDescendantCount || 0;

  const hasReplies = descendantCount > 0;
  const showViewRepliesInstead = directReplyCount === 0 && descendantCount > 0;

  const cleanCommentContent = sanitizeHtml(
    comment.content,
    tiptapSanitizeConfig,
  );

  const handleCopyLink = async () => {
    const fullUrl = `${window.location.origin}${commentPath}`;
    try {
      await navigator.clipboard.writeText(fullUrl);
      toast.success('Link copied');
    } catch (error) {
      console.error('Copy failed:', error);
      toast.error('Could not copy link. Please try again.');
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handlePostReply = () => {
    const content = editorRef.current?.getContent() ?? '';

    startTransition(async () => {
      const response = await postComment({
        content: content,
        blogId,
        ...(comment._id && { parentId: comment._id }),
      });

      if (response.success) {
        toast.success('Comment posted');
        setShowReplyBox(false);
        setShowReplies(true); // Expand replies section

        if (comment.parentId) {
          // This is a reply to a reply (nested)

          // Update the immediate parent (current comment) counts in its parent's replies cache
          queryClient.setQueryData<InfiniteData<CommentResponse>>(
            ['replies', blogId, comment.parentId],
            (oldData) => {
              if (!oldData) return oldData;

              return {
                ...oldData,
                pages: oldData.pages.map((page) => {
                  const hasComment = page.comments.some(
                    (c) => c._id === comment._id,
                  );

                  if (!hasComment) return page;

                  return {
                    ...page,
                    comments: page.comments.map((c) => {
                      return c._id === comment._id
                        ? {
                            ...c,
                            replyCount: c.replyCount + 1,
                            visibleDescendantCount:
                              c.visibleDescendantCount + 1,
                          }
                        : c;
                    }),
                  };
                }),
              };
            },
          );

          // Update the root comment's visibleDescendantCount in main cache
          queryClient.setQueryData<InfiniteData<CommentResponse>>(
            ['comments', blogId],
            (oldData) => {
              if (!oldData) return oldData;

              return {
                ...oldData,
                pages: oldData.pages.map((page) => {
                  const hasRootComment = page.comments.some(
                    (c) => c._id === comment.rootCommentId,
                  );

                  if (!hasRootComment) return page;

                  return {
                    ...page,
                    comments: page.comments.map((c) => {
                      return c._id === comment.rootCommentId
                        ? {
                            ...c,
                            visibleDescendantCount:
                              c.visibleDescendantCount + 1,
                          }
                        : c;
                    }),
                  };
                }),
              };
            },
          );
        } else {
          // This is a reply to a top-level comment

          // Update parent comment's reply counts in the main comments cache
          queryClient.setQueryData<InfiniteData<CommentResponse>>(
            ['comments', blogId],
            (oldData) => {
              if (!oldData) return oldData;

              return {
                ...oldData,
                pages: oldData.pages.map((page) => {
                  const hasComment = page.comments.some(
                    (c) => c._id === comment._id,
                  );

                  if (!hasComment) return page;

                  return {
                    ...page,
                    comments: page.comments.map((c) => {
                      return c._id === comment._id
                        ? {
                            ...c,
                            replyCount: c.replyCount + 1,
                            visibleDescendantCount:
                              c.visibleDescendantCount + 1,
                          }
                        : c;
                    }),
                  };
                }),
              };
            },
          );
        }

        // Check if replies cache exists for this comment
        const repliesCache = queryClient.getQueryData<
          InfiniteData<CommentResponse>
        >(['replies', blogId, comment._id]);

        if (repliesCache) {
          // Update existing replies cache by prepending new reply to first page
          queryClient.setQueryData<InfiniteData<CommentResponse>>(
            ['replies', blogId, comment._id],
            (oldData) => {
              if (!oldData) return oldData;

              return {
                ...oldData,
                pages: oldData.pages.map((page, idx) => {
                  if (idx === 0) {
                    return {
                      ...page,
                      comments: [
                        { ...response.data, userId: user ?? null },
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
        } else {
          // If replies haven't been loaded yet, invalidate to trigger fetch
          queryClient.invalidateQueries({
            queryKey: ['replies', blogId, comment._id],
          });
        }
      } else if (response.error) {
        console.error({ error: response.error, details: response.errors });
        toast.error(response.error);
      }
    });
  };

  const handleEditComment = () => {
    const content = editorRef.current?.getContent() ?? comment.content;

    startTransition(async () => {
      const response = await updateComment({
        content,
        commentId: comment._id,
      });

      if (response.success) {
        toast.success('Comment updated');
        setIsEditing(false);

        // Check if this is a reply or top-level comment
        if (comment.parentId) {
          // This is a reply - update the replies cache
          queryClient.setQueryData<InfiniteData<CommentResponse>>(
            ['replies', blogId, comment.parentId],
            (oldData) => {
              if (!oldData) return oldData;

              return {
                ...oldData,
                pages: oldData.pages.map((page) => {
                  const hasComment = page.comments.some(
                    (c) => c._id === comment._id,
                  );

                  if (!hasComment) return page;

                  return {
                    ...page,
                    comments: page.comments.map((c) => {
                      return c._id === comment._id
                        ? {
                            ...c,
                            content,
                            updatedAt: new Date().toISOString(),
                            editedAt: new Date().toISOString(),
                            isEdited: true,
                          }
                        : c;
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
                    (c) => c._id === comment._id,
                  );

                  if (!hasComment) return page;

                  return {
                    ...page,
                    comments: page.comments.map((c) => {
                      return c._id === comment._id
                        ? {
                            ...c,
                            content,
                            updatedAt: new Date().toISOString(),
                            editedAt: new Date().toISOString(),
                            isEdited: true,
                          }
                        : c;
                    }),
                  };
                }),
              };
            },
          );
        }
      } else if (response.error) {
        console.error({ error: response.error, details: response.errors });
        toast.error(response.error);
      }
    });
  };

  return (
    <div>
      <Activity mode={showThread ? 'visible' : 'hidden'}>
        <div className={cn('flex items-start')}>
          <div className="flex shrink-0 flex-col self-stretch">
            <div className="relative flex flex-1 shrink-0 flex-col self-stretch">
              {comment.userId ? (
                <Link href={`/author/${username}`} className="rounded-full">
                  <Avatar className="bg-background z-[1] size-6 md:size-8">
                    <AvatarImage src={profilePicture ?? ''} />
                    <AvatarFallback className="bg-brand/20">
                      {firstName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Link>
              ) : (
                <Avatar className="bg-muted z-[1] size-6 opacity-60 md:size-8">
                  <AvatarFallback>D</AvatarFallback>
                </Avatar>
              )}
              {comment.parentId && (
                <div
                  aria-hidden="true"
                  className="absolute right-1/2 z-0 flex w-[calc(100%+0.5px)] flex-1 cursor-pointer items-start justify-end"
                  onClick={handleToggleReply}
                >
                  <div className="border-border group-hover:border-foreground h-4 w-[calc(100%+0.5px)] rounded-es-[20px] border-0 border-b border-l" />
                </div>
              )}
              {hasReplies && (
                <div
                  aria-hidden="true"
                  className="group relative z-[1] mt-1 mb-4 flex flex-1 cursor-pointer items-start justify-end bg-transparent"
                  onClick={handleToggleReply}
                >
                  <div className="border-border group-hover:border-primary h-full w-[calc(50%+0.5px)] rounded-es-[20px] border-0 border-b border-l" />
                </div>
              )}
            </div>
          </div>
          <div className="flex-1 space-y-2">
            {isEditing && isOwner ? (
              <div className="ml-2 flex-1">
                <RichTextCommentEditor
                  ref={editorRef}
                  showMenu
                  showLoader={false}
                  onCancel={() => setIsEditing(false)}
                  placeholder="Edit your comment here..."
                  blogId={blogId}
                  parentCommentId={comment._id}
                  content={comment.content}
                  onSubmit={handleEditComment}
                  isLoading={isPending}
                  submitLabel="Save Changes"
                />
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between pl-2">
                  <p className="flex flex-wrap items-center gap-[1ch] text-xs font-medium">
                    {comment.userId ? (
                      <Link
                        href={`/author/${username}`}
                        className="hover:underline"
                      >
                        {username}
                      </Link>
                    ) : (
                      <span className="text-muted-foreground">{`[deleted]`}</span>
                    )}
                    <span className="text-muted-foreground">•</span>
                    {isCommentDeleted ? (
                      <span className="text-muted-foreground font-normal">
                        {commentCreatedAt}
                      </span>
                    ) : (
                      <Link
                        href={commentPath}
                        className="text-muted-foreground hover:text-foreground font-normal"
                      >
                        {commentCreatedAt}
                      </Link>
                    )}
                    {comment.isEdited && (
                      <span className="text-muted-foreground font-normal">
                        (Edited)
                      </span>
                    )}
                  </p>
                  <Button
                    variant={'ghost'}
                    size={'icon-sm'}
                    onClick={handleToggleThread}
                    aria-label="Collapse thread"
                    title="Collapse thread"
                    className="h-6 md:h-8"
                  >
                    {showThread ? <ChevronsDownUp /> : <ChevronsUpDown />}
                  </Button>
                </div>
                <div>
                  {isCommentDeleted ? (
                    <p className="text-muted-foreground px-2 text-sm italic">
                      {comment.content}
                    </p>
                  ) : (
                    <div
                      ref={contentRef}
                      className={cn(
                        'prose prose-sm dark:prose-invert tiptap w-full max-w-none px-2 text-sm break-words [&_a]:break-all',
                        // !isExpanded && 'line-clamp-4',
                      )}
                      dangerouslySetInnerHTML={{ __html: cleanCommentContent }}
                    />
                  )}
                  {/* {isTruncated && !isExpanded && (
                <button
                  onClick={() => setIsExpanded(true)}
                  className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors hover:underline"
                >
                  Read more
                </button>
              )}
              {isTruncated && isExpanded && (
                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors hover:underline"
                >
                  Show less
                </button>
              )} */}
                </div>
                <div className="flex flex-wrap items-center gap-1 text-xs">
                  <div className="flex items-center">
                    <Button
                      size={'icon-sm'}
                      variant={'ghost'}
                      aria-label="Like"
                      title="Like"
                      disabled={isCommentDeleted}
                    >
                      <HeartIcon />
                    </Button>
                    {comment.likesCount > 0 && (
                      <span>{comment.likesCount}</span>
                    )}
                  </div>
                  {/* Reply button */}
                  {isCommentsEnabled &&
                    (isAuthenticated ? (
                      <ReplyButton
                        onClick={handleReplyClick}
                        isCommentDeleted={isCommentDeleted}
                      />
                    ) : (
                      <LoginPromptDialog
                        trigger={
                          <ReplyButton isCommentDeleted={isCommentDeleted} />
                        }
                        hash="#comments"
                      />
                    ))}

                  {/* More options dropdown */}
                  {isAuthenticated && !isCommentDeleted && (
                    <DropdownMenu>
                      <DropdownMenuTrigger disabled={isCommentDeleted} asChild>
                        <Button
                          aria-label="more options"
                          title="More options"
                          variant="ghost"
                          size={'icon'}
                        >
                          <EllipsisIcon />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="min-w-52">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/${authorUsername}/${slug}/comments/${comment._id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLinkIcon />
                            Open in new tab
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleCopyLink}>
                          <CopyIcon />
                          Copy link
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled>
                          <FlagIcon />
                          Report Abuse
                        </DropdownMenuItem>
                        {isOwner && (
                          <>
                            <DropdownMenuItem onClick={handleEditClick}>
                              <PencilIcon />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={handleDeleteClick}
                            >
                              <TrashIcon />
                              Delete
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}

                  {/* Delete comment dialog */}
                  {isOwner && (
                    <DeleteCommentDialog
                      open={showDeleteDialog}
                      setOpen={setShowDeleteDialog}
                      commentId={comment._id}
                      blogId={blogId}
                      parentId={comment.parentId}
                    />
                  )}
                </div>
                {/* Reply box */}
                {showReplyBox && isAuthenticated && (
                  <RichTextCommentEditor
                    ref={editorRef}
                    showMenu
                    showLoader={false}
                    onCancel={handleCancel}
                    placeholder={`Replying to @${username}`}
                    blogId={blogId}
                    parentCommentId={comment._id}
                    onSubmit={handlePostReply}
                    isLoading={isPending}
                    submitLabel="Reply"
                  />
                )}
              </>
            )}

            {showReplies && hasReplies && depth < MAX_NESTING_DEPTH && (
              <CommentList
                blogId={blogId}
                isAuthenticated={isAuthenticated}
                isCommentsEnabled={isCommentsEnabled}
                depth={depth + 1}
                authorUsername={authorUsername}
                slug={slug}
                commentId={comment._id}
                user={user}
              />
            )}

            {hasReplies && (
              <Button
                size="sm"
                className="text-primary dark:hover:text-primary text-xs [&_svg]:text-inherit"
                variant="ghost"
                onClick={handleToggleReply}
              >
                {depth >= MAX_NESTING_DEPTH ? (
                  // Max depth reached - link to thread view
                  <>
                    View full thread <ArrowRight />
                  </>
                ) : showReplies ? (
                  // Replies are currently visible - show hide button
                  <>
                    Hide replies <ChevronUpIcon />
                  </>
                ) : directReplyCount > 0 ? (
                  // Has direct replies - show exact count
                  <>
                    {directReplyCount}{' '}
                    {directReplyCount > 1 ? 'replies' : 'reply'}{' '}
                    <ChevronDownIcon />
                  </>
                ) : (
                  // No direct replies but has descendants - show generic text
                  <>
                    View replies <ChevronDownIcon />
                  </>
                )}
              </Button>
            )}

            {/* {isLoading && <Loader center />} */}
          </div>
        </div>
      </Activity>
      <Activity mode={showThread ? 'hidden' : 'visible'}>
        <div className="relative">
          <Button
            className="w-full justify-between text-xs"
            onClick={handleToggleThread}
            variant={'secondary'}
            aria-label="Expand thread"
            title="Expand thread"
            size={'sm'}
          >
            <span className="flex gap-[1ch]">
              <PlusCircleIcon />
              {username}{' '}
              <span className="text-muted-foreground italic">
                {comment.replyCount > 0 &&
                  `+ ${comment.replyCount} ${comment.replyCount > 1 ? ' replies' : ' reply'}`}
              </span>
            </span>
            {showThread ? <ChevronsDownUp /> : <ChevronsUpDown />}
          </Button>
        </div>
      </Activity>
    </div>
  );
};

export default CommentItem;

const ReplyButton = ({
  onClick,
  isCommentDeleted,
}: {
  onClick?: () => void;
  isCommentDeleted: boolean;
}) => {
  return (
    <Button
      disabled={isCommentDeleted}
      size={'sm'}
      variant={'ghost'}
      className="text-xs"
      onClick={onClick}
    >
      <MessageCircleIcon /> Reply
    </Button>
  );
};
