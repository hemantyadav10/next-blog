import { Comment } from '@/models';
import { BlogDocument } from '@/models/blogModel';
import { CommentDocument } from '@/models/commentModel';
import { UserType } from '@/models/userModel';
import { isValidObjectId } from 'mongoose';
import connectDb from './connectDb';

export async function fetchCommentData(commentId: string, slug: string) {
  if (!isValidObjectId(commentId) || !slug) return null;

  await connectDb();

  const comment = await Comment.findById(commentId)
    .populate<{
      blogId: Pick<
        BlogDocument,
        'title' | 'slug' | '_id' | 'isCommentsEnabled'
      >;
    }>('blogId', 'title slug isCommentsEnabled')
    .populate<{
      userId: Pick<
        UserType,
        'username' | 'firstName' | 'lastName' | 'profilePicture'
      >;
    }>('userId', 'username firstName lastName profilePicture')
    .populate<{
      parentId: Pick<CommentDocument, '_id' | 'content' | 'isDeleted'> | null;
    }>('parentId', 'content _id isDeleted');

  // Validate the comment belongs to the correct blog post
  if (!comment || comment.blogId.slug !== slug) return null;

  return comment;
}
