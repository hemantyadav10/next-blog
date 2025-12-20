import { FollowDocument } from '@/models/followModel';
import { UserType } from '@/models/userModel';
import { PaginatedResponse } from './api.types';

type Follower = Pick<
  UserType,
  | 'username'
  | 'firstName'
  | 'lastName'
  | 'profilePicture'
  | '_id'
  | 'bio'
  | 'email'
>;

type FollowersListItem = Omit<FollowDocument, 'followerId'> & {
  followerId: Follower;
};

type FollowingsListItem = Omit<FollowDocument, 'followingId'> & {
  followingId: Follower;
};

type AuthorFollowerResponse = PaginatedResponse<FollowersListItem[]>;

type AuthorFollowingResponse = PaginatedResponse<FollowingsListItem[]>;

export type { AuthorFollowerResponse, AuthorFollowingResponse };
