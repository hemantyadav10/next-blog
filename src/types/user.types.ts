import { UserType } from '@/models/userModel';

export type UserPreview = {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  bio: string | null | undefined;
  profilePicture: string | null | undefined;
};

export type UsersResponse = {
  docs: UserPreview[];
  hasNextPage: boolean;
  nextPage: number | null;
};

export type UserProfileData = Pick<
  UserType,
  | 'email'
  | 'username'
  | '_id'
  | 'bio'
  | 'createdAt'
  | 'firstName'
  | 'language'
  | 'lastName'
  | 'phoneNumber'
  | 'updatedAt'
  | 'role'
  | 'timezone'
  | 'socialLinks'
  | 'profilePicture'
>;
