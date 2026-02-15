import { Blog } from '@/models';
import {
  AggregatePaginateModel,
  InferSchemaType,
  model,
  models,
  Schema,
  Types,
} from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const commentSchema = new Schema(
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
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
    path: {
      type: String,
      required: true,
    },
    rootCommentId: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
      required: true,
    },
    replyCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    depth: {
      type: Number,
      default: 0,
      min: 0,
      required: true,
    },
    visibleDescendantCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true },
);

// TODO: Add indexes, virtuals, hooks and methods
commentSchema.plugin(aggregatePaginate);

// Pre-validate: Set path, depth, and rootCommentId for new comments
commentSchema.pre('validate', async function (next) {
  try {
    if (this.isNew) {
      this.$locals.wasNew = this.isNew;
      if (this.parentId) {
        // Reply to another comment
        const parent = (await this.model('Comment')
          .findById(this.parentId)
          .select('depth path rootCommentId')
          .lean()) as unknown as Pick<
          CommentDocument,
          '_id' | 'depth' | 'path' | 'rootCommentId'
        >;

        if (!parent) return next(new Error('Parent comment not found'));

        this.depth = parent.depth + 1;
        this.path = `${parent.path}/${this._id}`;
        this.rootCommentId = parent.rootCommentId || parent._id;
      } else {
        // Top-level comment
        this.depth = 0;
        this.path = `${this._id}`;
        this.rootCommentId = this._id;
      }
    }
    next();
  } catch (error) {
    next(error instanceof Error ? error : new Error(String(error)));
  }
});

// Post-save: Increment parent's replyCount and blog's comment count
commentSchema.post('save', async function (doc) {
  try {
    if (this.$locals?.wasNew) {
      if (doc.parentId) {
        const ancestorIds = doc.path.split('/').slice(0, -1);
        await Promise.all([
          await this.model('Comment').findByIdAndUpdate(doc.parentId, {
            $inc: { replyCount: 1 },
          }),
          await Comment.updateMany(
            { _id: { $in: ancestorIds } },
            { $inc: { visibleDescendantCount: 1 } },
          ),
        ]);
      }

      await Blog.findByIdAndUpdate(doc.blogId, {
        $inc: { commentsCount: 1 },
      });
    }
  } catch (error) {
    console.error('Post-save hook failed:', {
      commentId: doc._id,
      error,
    });
  }
});

export type CommentDocument = Omit<
  InferSchemaType<typeof commentSchema>,
  'parentId'
> & {
  _id: Types.ObjectId;
  parentId: Types.ObjectId | null;
};

const Comment = (models.Comment ||
  model<CommentDocument, AggregatePaginateModel<CommentDocument>>(
    'Comment',
    commentSchema,
  )) as AggregatePaginateModel<CommentDocument>;

export default Comment;
