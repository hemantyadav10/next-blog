import { MODEL_NAMES } from '@/lib/constants';
import {
  InferSchemaType,
  Schema,
  Types,
  model,
  models,
  type AggregatePaginateModel,
} from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const tagSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
      minlength: 2,
      lowercase: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    blogsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    createdBy: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: MODEL_NAMES.USER,
    },
  },
  { timestamps: true },
);

export type TagDocument = InferSchemaType<typeof tagSchema> & {
  _id: Types.ObjectId;
};

// TODO: Add indexes, virtuals, hooks and methods

tagSchema.plugin(aggregatePaginate);

const Tag =
  (models.Tag as AggregatePaginateModel<TagDocument>) ||
  model<TagDocument, AggregatePaginateModel<TagDocument>>(
    MODEL_NAMES.TAG,
    tagSchema,
  );

export default Tag;
