import { getAllFollowers } from '@/app/actions/followerActions';
import { ErrorState } from '@/components/error-state';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { getUserDetails } from '@/lib/user';
import { Users2Icon } from 'lucide-react';
import { notFound } from 'next/navigation';
import AllFollowersList from '../components/AllFollowersList';
import SectionHeader from '../components/SectionHeader';

type FollowersProps = { params: Promise<{ username: string }> };

async function Followers({ params }: FollowersProps) {
  const username = (await params).username;
  const user = await getUserDetails(username);
  if (!user) return notFound();

  const result = await getAllFollowers({ authorId: user._id.toString() });
  if (!result.success) {
    return <ErrorState resource="followers" error={new Error(result.error)} />;
  }

  const { totalDocs, docs } = result.data;
  const followerCount = totalDocs ?? 0;

  if (docs.length === 0) {
    return (
      <div className="space-y-6">
        <SectionHeader username={username} currentPage="Followers" />
        <Empty className="from-muted/50 to-background h-full bg-gradient-to-b from-30%">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Users2Icon />
            </EmptyMedia>
            <EmptyTitle>No followers yet</EmptyTitle>
            <EmptyDescription>
              This author doesn&apos;t have any followers yet. Be the first to
              follow and stay updated with their content.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader username={username} currentPage="Followers" />
      <h1 className="text-xl font-semibold">
        {followerCount} {followerCount === 1 ? 'follower' : 'followers'}
      </h1>
      <AllFollowersList initialData={result} authorId={user._id.toString()} />
    </div>
  );
}

export default Followers;
