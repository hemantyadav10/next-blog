import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import Link from 'next/link';

interface AuthorInfoProps {
  username: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  bio?: string;
}

function AuthorInfo({
  username,
  firstName,
  lastName,
  profilePicture,
  bio,
}: AuthorInfoProps) {
  return (
    <section className="space-y-4 sm:flex xl:flex-col">
      <div className="flex items-start gap-4 sm:flex-1">
        <Link href={`/author/${username}`} className="rounded-full">
          <Avatar className="size-14">
            <AvatarImage src={profilePicture} alt={firstName} />
            <AvatarFallback className="uppercase">
              {firstName.charAt(0)} {lastName.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div className="space-y-2 text-sm">
          <Link href={`/author/${username}`} className="hover:underline">
            <p className="text-lg font-medium">
              {firstName} {lastName}
            </p>
          </Link>
          <p className="text-muted-foreground">
            3.4K followers and 2.1K following
          </p>
          {bio && <p className="line-clamp-3">{bio}</p>}
        </div>
      </div>
      <Button className="w-full sm:w-auto" variant={'raised'}>
        <UserPlus /> Follow
      </Button>
    </section>
  );
}

export default AuthorInfo;
