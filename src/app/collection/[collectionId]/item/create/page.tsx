'use client';
import MinScreen from '@/components/layout/min-screen';
import { api } from '@/trpc/react';
import React from 'react';
import { z } from 'zod';


const itemSchema = z.object({
  name: z.string().min(2),
  collectionId: z.string().min(1, { message: "Please select a topic." }),
});

const CreateItem = () => {
  return (
    <MinScreen>add item</MinScreen>
  );
};

export default CreateItem;