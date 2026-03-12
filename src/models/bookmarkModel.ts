import { MODEL_NAMES } from '@/lib/constants';
import {
  AggregatePaginateModel,
  InferSchemaType,
  model,
  models,
  Schema,
  Types,
} from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const bookmarkSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: MODEL_NAMES.USER,
      required: true,
    },
    blogId: {
      type: Schema.Types.ObjectId,
      ref: MODEL_NAMES.BLOG,
      required: true,
    },
  },
  { timestamps: true },
);

// TODO: Add indexes, virtuals, hooks and methods
bookmarkSchema.index({ userId: 1, blogId: 1 }, { unique: true });
bookmarkSchema.plugin(aggregatePaginate);

export type BookMarkDocument = InferSchemaType<typeof bookmarkSchema> & {
  _id: Types.ObjectId;
};

const Bookmark =
  (models.Bookmark as AggregatePaginateModel<BookMarkDocument>) ||
  model<BookMarkDocument, AggregatePaginateModel<BookMarkDocument>>(
    MODEL_NAMES.BOOKMARK,
    bookmarkSchema,
  );

export default Bookmark;
