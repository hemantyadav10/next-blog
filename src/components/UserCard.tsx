import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import { AtSign } from 'lucide-react';
import Link from 'next/link';

type UserProps = {
  name: string;
  username: string;
  bio?: string | null | undefined;
  profilePicture: string | null | undefined;
};

function UserCard({ profilePicture, name, username, bio }: UserProps) {
  return (
    <Item variant="outline" asChild>
      <Link href={`/author/${username}`}>
        <ItemMedia>
          <Avatar className="size-12">
            <AvatarImage src={profilePicture || undefined} alt={name} />
            <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{name}</ItemTitle>
          <ItemDescription className="flex items-center gap-0.5">
            <AtSign className="size-4" /> {username}
          </ItemDescription>
          {bio && <p className="text-muted-foreground line-clamp-3">{bio}</p>}
        </ItemContent>
        <ItemActions>
          {/* TODO: Implement follow/unfollow logic and button state */}
          <Button variant="outline">Follow</Button>
        </ItemActions>
      </Link>
    </Item>
  );
}

export default UserCard;
