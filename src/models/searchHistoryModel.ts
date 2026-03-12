import { MODEL_NAMES } from '@/lib/constants';
import { InferSchemaType, Model, Schema, Types, model, models } from 'mongoose';

const searchHistorySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: MODEL_NAMES.USER,
      required: true,
      unique: true,
    },
    queries: {
      type: [{ type: String, lowercase: true, trim: true }],
      default: [],
      validate: {
        validator: (arr: string[]): boolean => arr.length <= 5,
        message: 'queries cannot exceed 5 items',
      },
      lowercase: true,
    },
  },

  { timestamps: true },
);

export type SearchHistoryDocument = InferSchemaType<
  typeof searchHistorySchema
> & { _id: Types.ObjectId };

const SearchHistory =
  (models.SearchHistory as Model<SearchHistoryDocument>) ||
  model<SearchHistoryDocument, Model<SearchHistoryDocument>>(
    MODEL_NAMES.SEARCH_HISTORY,
    searchHistorySchema,
  );

export default SearchHistory;
