
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { api } from '@/trpc/react';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { useEffect, useRef, useState } from 'react';
import { useLocale } from '@/components/provider/locale-provider';

const REFRESH_TIME_MS = 5000;  // milliseconds

const commentSchema = z.object({
  text: z.string()
    .trim()
    .min(1, { message: 'Please at least a character.' })
    .max(1000, { message: 'Currently, we only support 1000 charcters long comments.' })
});
type CommentType = z.infer<typeof commentSchema>;

export const Comments = (
  { userId, itemId, commentsCount, itemRefetch }:
    { userId: string, itemId: string, commentsCount: number; itemRefetch: () => Promise<unknown>; }
) => {
  const { data: comments, refetch: commentsRefatch, isError } = api.comment.getAllByItemId.useQuery({ itemId });
  const locale = useLocale(state => state.item.comment);
  const commentForm = useForm<CommentType>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      text: ''
    },
  });
  const createComment = api.comment.create.useMutation({
    async onSuccess() {
      await commentsRefatch();
      await itemRefetch();
      commentForm.reset();
    }
  });
  const onCreateComment = (values: CommentType) => {
    if (!userId) {
      toast({
        title: "Not Signed in",
        description: "Please sign in to comment"
      });
      return;
    }
    createComment.mutate({
      text: values.text,
      itemId: itemId,
      createdById: userId,
    });
    toast({
      description: "Comment added: " + JSON.stringify(values.text)
    });
  };

  const timerIdRef = useRef<ReturnType<typeof setInterval> | undefined>();
  const [isPollingEnabled, setIsPollingEnabled] = useState(true);

  // short polling, very simple interactivity 
  useEffect(() => {
    const pollingCallback = async () => {
      await commentsRefatch();
      if (isError) {
        setIsPollingEnabled(false);
        console.log('Polling failed. Stopped polling.');
      }
    };

    const startPolling = async () => {
      timerIdRef.current = setInterval(
        () => {
          pollingCallback().catch(e => console.log(e));
        }, REFRESH_TIME_MS);
    };

    const stopPolling = () => {
      clearInterval(timerIdRef.current);
    };

    if (isPollingEnabled) {
      startPolling().catch(e => console.log(e));
    } else {
      stopPolling();
    }

    return () => {
      stopPolling();
    };
  }, [isError, commentsRefatch, isPollingEnabled]);

  return <>
    <div className='w-2/3 py-2'>{commentsCount} {commentsCount == 1 ? locale.comment : locale.comments}</div>
    <Form {...commentForm}>
      <form onSubmit={commentForm.handleSubmit(onCreateComment)} className="w-2/3 space-y-6 py-2">
        <FormField
          control={commentForm.control}
          name="text"
          render={({ field }) => (
            <FormItem>
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
    <div className='flex flex-col gap-2 w-2/3'>
      {comments?.map(comment =>
        <div key={comment.id}
          className='flex items-center justify-start w-full gap-2 border rounded p-2' >
          <span className='border rounded-full p-1 self-start'>{comment.createdByName ?? 'anonymous'}</span>
          <p className='boarder-b rounded '>
            {comment.text.split('\n').map((t, i) => <span key={i}>{t} <br /></span>)}
          </p>
        </div>)}
    </div>
  </>;
};