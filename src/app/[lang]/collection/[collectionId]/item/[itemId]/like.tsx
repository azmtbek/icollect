'use client';
import { useLocale } from '@/components/provider/locale-provider';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { api } from '@/trpc/react';
import { Heart } from 'lucide-react';


export const Like = ({
  userId, itemId, likesCount, itemRefetch
}: {
  userId: string, itemId: string, likesCount: number; itemRefetch: () => Promise<unknown>;
}
) => {
  const { data: liked, refetch } = api.like.get.useQuery({ itemId: +itemId });
  const locale = useLocale(state => state.item.like);
  const toggleLike = api.like.toggle.useMutation({
    async onSuccess() {
      await refetch();
      await itemRefetch();
    },
    onError(error) {
      error.data?.code;
    }
  });
  const onLiked = async () => {
    if (!userId) {
      toast({
        title: "Not Signed in",
        description: "Please sign in to comment"
      });
      return;
    }
    toggleLike.mutate({ itemId: +itemId });
    await refetch();
  };
  return <div className='flex items-center justify-end'>
    {likesCount} {likesCount === 1 ? locale.like : locale.likes}
    <Button onClick={onLiked} variant={'ghost'}>
      {liked ? <Heart className='fill-destructive stroke-destructive' /> : <Heart />}
    </Button>
  </div>;
};