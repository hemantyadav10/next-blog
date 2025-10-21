import { model, models, Schema, Types } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

export interface IFollow {
  followerId: Types.ObjectId;
  followingId: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const followSchema = new Schema<IFollow>(
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

// Prevent duplicate follows
followSchema.index({ followerId: 1, followingId: 1 }, { unique: true });

followSchema.plugin(aggregatePaginate);

const Follow = models.Follow || model<IFollow>('Follow', followSchema);

export default Follow;
