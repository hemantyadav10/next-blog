import {
  AggregatePaginateModel,
  InferSchemaType,
  model,
  models,
  Schema,
  Types,
} from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const followSchema = new Schema(
  {
    followerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    followingId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

// TODO: Add indexes, virtuals, hooks and methods

// INDEXES
followSchema.index({ followerId: 1, followingId: 1 }, { unique: true }); // Prevent duplicate follows
followSchema.index({ followingId: 1, createdAt: -1 });
followSchema.index({ followerId: 1, createdAt: -1 });

// PLUGINS
followSchema.plugin(aggregatePaginate);

export type FollowDocument = InferSchemaType<typeof followSchema> & {
  _id: Types.ObjectId;
};

const Follow = (models.Follow ||
  model<FollowDocument, AggregatePaginateModel<FollowDocument>>(
    'Follow',
    followSchema,
  )) as AggregatePaginateModel<FollowDocument>;

export default Follow;
