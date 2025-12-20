import { User } from '@/models';
import { UserProfileData } from '@/types/user.types';
import { cache } from 'react';
import connectDb from './connectDb';

export const getUserDetails = cache(async function getUserDetails(
  username: string,
): Promise<UserProfileData> {
  await connectDb();
  const user = await User.findOne({ username })
    .select(
      'email username _id bio createdAt firstName language lastName phoneNumber updatedAt role timezone socialLinks profilePicture',
    )
    .lean();
  return JSON.parse(JSON.stringify(user));
});
