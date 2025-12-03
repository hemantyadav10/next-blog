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

function UserCard({ profilePicture, name, username }: UserProps) {
  return (
    <Item variant="outline" asChild>
      <Link href={`/@${username}`}>
        <ItemMedia>
          <Avatar className="size-12">
            <AvatarImage src={profilePicture || undefined} alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{name}</ItemTitle>
          <ItemDescription className="flex items-center gap-0.5">
            <AtSign className="size-4" /> {username}
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline">Follow</Button>
        </ItemActions>
      </Link>
    </Item>
  );
}

export default UserCard;
