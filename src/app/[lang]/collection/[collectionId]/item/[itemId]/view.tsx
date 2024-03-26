'use client';
import MinScreen from '@/components/layout/min-screen';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { api } from '@/trpc/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Heart } from 'lucide-react';
import { useParams } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { type Session } from 'next-auth';

const commentSchema = z.object({
  text: z.string()
    .trim()
    .min(1, { message: 'Please at least a character.' })
    .max(1000, { message: 'Currently, we only support 1000 charcters long comments.' })
});
type CommentType = z.infer<typeof commentSchema>;

const Item = () => {
  const { itemId } = useParams<{ itemId: string; }>();
  const commentForm = useForm<CommentType>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      text: ''
    },
  });

  const { data: user } = api.user.getCurrent.useQuery();
  const { data: item, refetch: itemRefetch } = api.item.getById.useQuery({ itemId });
  const { data: comments, refetch: commentsRefatch } = api.comment.getAllByItemId.useQuery({ itemId });


  const createComment = api.comment.create.useMutation({
    async onSuccess() {
      await commentsRefatch();
      await itemRefetch();
      commentForm.reset();
    }
  });
  const onCreateComment = (values: CommentType) => {
    if (!user?.id) {
      toast({
        title: "Not Signed in",
        description: "Please sign in to comment"
      });
      return;
    }
    createComment.mutate({
      text: values.text,
      itemId: itemId,
      createdById: user.id,
    });
    toast({
      description: "testing " + JSON.stringify(values.text)
    });
  };
  const { data: liked } = api.like.get.useQuery({ itemId: +itemId });
  const toggleLike = api.like.toggle.useMutation({
    async onSuccess() {
      await itemRefetch();
    },
    onError(error) {
      error.data?.code;
    }
  });
  const onLiked = () => {
    if (!user?.id) {
      toast({
        title: "Not Signed in",
        description: "Please sign in to comment"
      });
      return;
    }
    toggleLike.mutate({
      itemId
    });
  };
  const curuser = api.user.getCurrent.useQuery();

  return (
    <MinScreen>
      <div className='text-3xl'>{item?.name}</div>
      {JSON.stringify(curuser.data)}
      <div>
        {item?.likesCount} {item?.likesCount === 1 ? 'like' : 'likes'}
        <Button onClick={onLiked} variant={'ghost'}>{liked ? <Heart className='fill-destructive stroke-destructive' /> : <Heart />}</Button>
      </div>

      <hr className="h-px my-2 bg-primary border-0 w-full" />

      <div className='w-2/3 py-2'>{item?.commentsCount} comments</div>
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