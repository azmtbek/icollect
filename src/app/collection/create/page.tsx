'use client';
import MinScreen from '@/components/layout/min-screen';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { api } from '@/trpc/react';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const collectionSchema = z.object({
  name: z.string().min(2),
  topicId: z.string().min(1, { message: "Please select a topic." }),
  description: z.string(),
});
type CollectionType = z.infer<typeof collectionSchema>;

const CreateCollection = () => {
  const form = useForm<CollectionType>({
    resolver: zodResolver(collectionSchema),
    defaultValues: {
      name: "",
      topicId: "",
      description: "",
    }
  });
  const { toast } = useToast();
  const createCollection = api.collection.create.useMutation({
    onSuccess() {
      toast({
        description: "Collection created.",
      });
    },
    onError(error) {
      toast({
        variant: "destructive",
        title: "Something went wrong!",
        description: error.message,
      });
    }
  });


  const { data: topics } = api.admin.getTopics.useQuery();

  const onSubmit = (values: CollectionType) => {
    // const topicId = topics?.reduce((acc, val) => val.name == values.topic ? val.id : acc, -1);

    console.log(values);
    createCollection.mutate({
      name: values.name,
      description: values.description,
      topicId: +values.topicId
    });
  };
  return (
    <MinScreen>
      <Card>
        <CardHeader>
          <CardTitle>Create A Collection</CardTitle>
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
                      <Input placeholder='My books' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea placeholder='Describe your collection' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="topicId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Topic
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Topics" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {topics?.map(topic =>
                          <SelectItem value={"" + topic.id} key={topic.id}>{topic.name}</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='flex justify-between'>
                <Button type="submit">Create</Button>
                <Link href={'/collection'}> <Button variant='outline'>Go back</Button></Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </MinScreen>
  );
};

export default CreateCollection;;