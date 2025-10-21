import { model, models, Schema, Types } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

interface IBookMark {
  userId: Types.ObjectId;
  blogId: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const bookmarkSchema = new Schema<IBookMark>(
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

bookmarkSchema.plugin(aggregatePaginate);

const Bookmark =
  models.Bookmark || model<IBookMark>('Bookmark', bookmarkSchema);
export default Bookmark;
