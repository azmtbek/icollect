'use client';
import MinScreen from '@/components/layout/min-screen';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { api } from '@/trpc/react';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';


const itemSchema = z.object({
  name: z.string().min(2),
  //   collectionId: z.string().min(1, { message: "Please select a topic." }),
});
type ItemType = z.infer<typeof itemSchema>;

const CreateItem = () => {
  const { collectionId } = useParams();
  const router = useRouter();
  const form = useForm<ItemType>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: "",
      // collectionId: "",
    }
  });

  const createItem = api.item.create.useMutation({
    onSuccess() {
      form.reset();
    },
  });

  const onSubmit = (values: ItemType) => {
    console.log("vals", values, collectionId);
    createItem.mutate({
      name: values.name,
      collectionId: +collectionId!,
    });
  };
  return (
    <MinScreen>
      <Card>
        <CardHeader>
          <CardTitle>Create An Item</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input placeholder='The War of Art' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='flex justify-between'>
                <Button type="submit">Create</Button>
                <Button variant='outline' onClick={() => router.back()}>Go back</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </MinScreen>
  );
};

export default CreateItem;