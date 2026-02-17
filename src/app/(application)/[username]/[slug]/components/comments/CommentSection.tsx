import { ErrorState } from '@/components/error-state';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { fetchComments } from '@/lib/api/comments.api';
import { verifyAuth } from '@/lib/auth';
import { AlertTriangleIcon } from 'lucide-react';
import LoginPromptDialog from '../LoginPromptDialog';
import CommentEditor from './CommentEditor';
import CommentList from './CommentList';

interface CommentSectionProps {
  isCommentsEnabled: boolean;
  blogId: string;
  slug: string;
  authorUsername: string;
  totalComments: number;
}

async function CommentSection({
  isCommentsEnabled,
  blogId,
  slug,
  authorUsername,
  totalComments = 0,
}: CommentSectionProps) {
  const { isAuthenticated, user } = await verifyAuth();

  let data;
  let fetchError = null;

  try {
    data = await fetchComments({ blogId });
  } catch (error) {
    fetchError =
      error instanceof Error ? error.message : 'Failed to load comments';
  }

  return (
    <div className="scroll-mt-20 space-y-8" id="comments">
      <p className="text-xl font-semibold">Comments {`(${totalComments})`}</p>

      {/* Show editor only if authenticated AND comments enabled */}
      {isAuthenticated && isCommentsEnabled && (
        <CommentEditor
          blogId={blogId}
          user={{
            _id: user.userId,
            username: user.username,
            lastName: user.lastName,
            firstName: user.firstName,
            profilePicture: user.profilePicture ?? '',
          }}
        />
      )}

      {/* Show login prompt only if NOT authenticated AND comments enabled */}
      {!isAuthenticated && isCommentsEnabled && (
        <LoginPromptDialog
          trigger={
            <Button
              variant={'outline'}
              className="text-muted-foreground dark:hover:border-ring hover:text-muted-foreground hover:border-ring min-h-16 w-full items-start justify-start px-3 py-4 text-sm font-normal hover:bg-transparent active:bg-transparent"
            >
              Leave a comment...
            </Button>
          }
          hash="#comments"
        />
      )}

      {/* Show disabled message regardless of auth status */}
      {!isCommentsEnabled && (
        <Alert variant={'warning'}>
          <AlertTriangleIcon />
          <AlertDescription className="text-foreground">
            Commenting is currently turned off for this post. You can still view
            existing comments, but new comments cannot be added.
          </AlertDescription>
        </Alert>
      )}

      {fetchError && <ErrorState resource="comments" />}

      {data && !fetchError && (
        <CommentList
          blogId={blogId}
          isAuthenticated={isAuthenticated}
          user={
            user
              ? {
                  _id: user.userId,
                  username: user.username,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  profilePicture: user.profilePicture ?? '',
                }
              : undefined
          }
          intialData={data}
          isCommentsEnabled={isCommentsEnabled}
          slug={slug}
          authorUsername={authorUsername}
        />
      )}
    </div>
  );
}

export default CommentSection;
