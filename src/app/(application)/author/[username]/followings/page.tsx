import { getAllFollowings } from '@/app/actions/followerActions';
import { ErrorState } from '@/components/error-state';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { getUserDetails } from '@/lib/user';
import { UserPlusIcon } from 'lucide-react';
import { notFound } from 'next/navigation';
import AllFollowingsList from '../components/AllFollowingsList';
import SectionHeader from '../components/SectionHeader';

type FollowingsProps = { params: Promise<{ username: string }> };

async function Followings({ params }: FollowingsProps) {
  const username = (await params).username;
  const user = await getUserDetails(username);
  if (!user) return notFound();

  const result = await getAllFollowings({ authorId: user._id.toString() });
  if (!result.success) {
    return <ErrorState resource="followings" error={new Error(result.error)} />;
  }

  const { totalDocs, docs } = result.data;
  const followingCount = totalDocs ?? 0;

  if (docs.length === 0) {
    return (
      <div className="space-y-6">
        <SectionHeader username={username} currentPage="Followings" />
        <Empty className="from-muted/50 to-background h-full bg-gradient-to-b from-30%">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <UserPlusIcon />
            </EmptyMedia>
            <EmptyTitle>Not following anyone yet</EmptyTitle>
            <EmptyDescription>
              This author hasn&apos;t followed anyone yet. Check back later to
              see who they&apos;re following.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader username={username} currentPage="Followings" />
      <h1 className="text-xl font-semibold">
        {followingCount} {followingCount === 1 ? 'following' : 'followings'}
      </h1>
      <AllFollowingsList initialData={result} authorId={user._id.toString()} />
    </div>
  );
}

export default Followings;
