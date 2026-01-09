import { getAllUsers } from '@/app/actions/userActions';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { SearchIcon } from 'lucide-react';
import UserList from './UserList';

async function UsersSection({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const query = (await searchParams).q as string;
  const sortBy = (await searchParams).sortBy as string;
  const sortOrder = (await searchParams).sortOrder as string;
  const result = await getAllUsers({ query, sortOrder, sortBy });

  if (!result.success) {
    throw new Error(result.error);
  }

  const { docs: users } = result.data;

  if (users.length === 0) {
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <SearchIcon />
          </EmptyMedia>
          <EmptyTitle>No Users Found</EmptyTitle>
          <EmptyDescription>
            {query
              ? `No results found for "${query}". Try adjusting your search terms.`
              : 'No users available at the moment. Check back later.'}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <UserList
      initialData={result}
      query={query}
      sortBy={sortBy}
      sortOrder={sortOrder}
    />
  );
}

export default UsersSection;
