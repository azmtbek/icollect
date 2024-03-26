'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/trpc/react';
import { type UseQueryResult } from '@tanstack/react-query';
import React, { useState } from 'react';
import { z } from 'zod';

const Tag = () => {
  const { data: tags, refetch: refetchTags } = api.tag.getAll.useQuery();
  const { data: itemTags, refetch: refetchItemTags } = api.tag.getItemTags.useQuery();
  const deleteItemTag = api.tag.deleteItemTag.useMutation({
    async onSuccess() {
      await refetchItemTags();
    }
  });
  return (
    <div className='flex flex-col justify-center items-center min-h-scrn'>
      <div className='text-2xl'>Tags</div>
      <CreateTag refatch={refetchTags} />
      <div className='py-10 text-xl'>{tags?.map((tag) =>
        <div key={tag.id} className='flex gap-2 justify-between'>
          <span>{tag.name}</span>
          <span>rename</span>
          <span>delete</span>
        </div>
      )}</div>
      <div className='text-2xl'>Item Tag Connection</div>
      <div className='py-10 text-xl'>{itemTags?.map((tag) =>
        <div key={tag.itemId + " " + tag.tagId} className='flex gap-2 justify-between'>
          <span>{tag.itemId + ' ' + tag.tagId}</span>
          <span>rename</span>
          <Button variant={'destructive'}
            onClick={() => deleteItemTag.mutate({ tagId: tag.tagId, itemId: tag.itemId })}
          >delete</Button>
        </div>
      )}</div>
    </div>
  );
};

export default Tag;

const tagSchema = z.string().min(2).max(20);
const CreateTag = ({ refatch }: { refatch: () => Promise<UseQueryResult>; }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const createTag = api.admin.createTag.useMutation({
    async onSuccess() {
      await refatch();
      setError('');
      setName('');
    },
    onError(error) {
      setError(error.message);
    },
  });
  const createTopic = () => {
    const parseName = tagSchema.safeParse(name);
    if (parseName.success)
      createTag.mutate({ name: parseName.data });
  };
  return <div className='flex w-64 gap-3 py-3'>
    <p>{error}</p>
    <Input type='text' placeholder='Tag Name' value={name} onChange={(e) => setName(e.target.value)} className='w-32' />
    <Button onClick={createTopic} disabled={createTag.isLoading}>Add A Tag</Button>
  </div>;
};