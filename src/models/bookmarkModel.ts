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
      ref: 'User',
      required: true,
    },
    blogId: {
      type: Schema.Types.ObjectId,
      ref: 'Blog',
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

const Bookmark = (models.Bookmark ||
  model<BookMarkDocument, AggregatePaginateModel<BookMarkDocument>>(
    'Bookmark',
    bookmarkSchema,
  )) as AggregatePaginateModel<BookMarkDocument>;

export default Bookmark;
