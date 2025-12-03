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
