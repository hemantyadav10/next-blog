import { Schema, model, models, Types } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

interface IComment {
  content: string;
  userId: Types.ObjectId;
  isPinned?: boolean;
  pinnedAt?: Date;
  isEdited?: boolean;
  editedAt?: Date;
  parentId?: Types.ObjectId | null;
  blogId: Types.ObjectId;
  mentions?: Types.ObjectId[];
  likesCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const commentSchema = new Schema<IComment>(
  {
    content: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    pinnedAt: Date,
    isEdited: {
      type: Boolean,
      default: false,
    },
    editedAt: Date,
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
    },
    blogId: {
      type: Schema.Types.ObjectId,
      ref: 'Blog',
      required: true,
    },
    mentions: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    likesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true },
);

// TODO: Add indexes, virtuals, hooks and methods

commentSchema.plugin(aggregatePaginate);

const Comment = models.Comment || model<IComment>('Comment', commentSchema);
export default Comment;
