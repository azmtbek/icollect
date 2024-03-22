'use client';
import MinScreen from '@/components/layout/min-screen';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { api } from '@/trpc/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Heart, HeartCrack, HeartOff } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const commentSchema = z.object({
  text: z.string()
    .trim()
    .min(1, { message: 'Please at least a character.' })
    .max(1000, { message: 'Currently, we only support 1000 charcters long comments.' })
});
type CommentType = z.infer<typeof commentSchema>;

// TODO: update static userId
const userId = 'cWE7Eo83NKqcr';

const Item = () => {
  const { collectionId, itemId } = useParams();
  if (typeof itemId !== 'string') return;
  const { data: item, refetch: itemRefetch } = api.item.getById.useQuery({ itemId });
  const { data: comments, refetch: commentsRefatch } = api.comment.getAllByItemId.useQuery({ itemId });

  const commentForm = useForm<CommentType>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      text: ''
    },
  });
  const createComment = api.comment.create.useMutation({
    onSuccess() {
      commentsRefatch();
      itemRefetch();
      commentForm.reset();
    }
  });
  const onCreateComment = (values: CommentType) => {
    createComment.mutate({
      text: values.text,
      itemId: itemId,
      createdById: userId,
    });
    toast({
      description: "testing " + JSON.stringify(values.text)
    });
  };
  const [liked, setLiked] = useState(false);
  const mutateLike = api.like.toggle.useMutation({
    onSuccess() {
      itemRefetch();
    }
  });
  const onLiked = () => {
    setLiked(p => !p);
    mutateLike.mutate({
      itemId,
      userId,
    });
    toast({
      description: 'liked' + liked
    });
  };
  return (
    <MinScreen>
      <div className='text-3xl'>{item?.name}</div>
      <div>
        {item?.likesCount} {item?.likesCount === 1 ? 'like' : 'likes'}
        <Button onClick={onLiked} variant={'ghost'}>{liked ? <Heart /> : <Heart className='fill-destructive stroke-destructive' />}</Button>
      </div>
      <div>
        <div>{item?.commentsCount} comments</div>
      </div>
      <Form {...commentForm}>
        <form onSubmit={commentForm.handleSubmit(onCreateComment)} className="w-2/3 space-y-6">
          <FormField
            control={commentForm.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                {/* <FormLabel>Add a Comment</FormLabel> */}
                <FormControl>
                  <Textarea placeholder="Add a comment" {...field}
                    className="min-h-fit resize-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit"
            disabled={!commentForm.formState.isValid}
            className={commentForm.formState.isValid ? '' : 'invisible'}
          >Create</Button>
        </form>
      </Form>
      <div>
        {comments?.map(comment => <div key={comment.id}>
          <span>{comment.createdById}</span>
          <div>{comment.text.split('\n').map((t, i) => <span key={i}>{t} <br /></span>)}</div>
        </div>)}
      </div>
    </MinScreen>
  );
};

export default Item;;