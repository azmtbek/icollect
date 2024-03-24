'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/trpc/react';
import React, { useState } from 'react';
import { z } from 'zod';

const Topic = () => {
  const { data: topics, refetch } = api.admin.getTopics.useQuery();
  return (
    <div className='flex flex-col justify-center items-center min-h-scrn'>
      <div className='text-2xl'>Topics</div>
      <CreateTopic refatch={refetch} />
      <div className='py-10 text-xl'>{topics?.map((topic) =>
        <div key={topic.id} className='flex gap-2 justify-between'>
          <span>{topic.name}</span>
          <span>rename</span>
          <span>delete</span>
        </div>
      )}</div>
    </div>
  );
};

export default Topic;

const topicSchema = z.string().min(2).max(20);
const CreateTopic = ({ refatch }: { refatch: any; }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const createTopic = api.admin.createTopic.useMutation(
    {
      onSuccess(data, variables, context) {
        refatch();
        setError('');
        setName('');
      },
      onError(error, variables, context) {
        setError(error.message);
      },
    }
  );
  const onCreateTopic = () => {
    const parseName = topicSchema.safeParse(name);
    if (parseName.success)
      createTopic.mutate({ name: parseName.data });
  };
  return <div className='flex w-64 gap-3 py-3'>
    <p>{error}</p>
    <Input type='text' placeholder='Topic Name' value={name} onChange={(e) => setName(e.target.value)} className='w-32' />
    <Button onClick={onCreateTopic} disabled={createTopic.isLoading}>Add Topic</Button>
  </div>;
};