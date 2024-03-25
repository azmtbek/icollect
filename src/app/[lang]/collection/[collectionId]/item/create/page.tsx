'use client';
import MinScreen from '@/components/layout/min-screen';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MultiSelectTags } from '@/components/custom/multi-select-tags';
import { api } from '@/trpc/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';


const itemSchema = z.object({
  name: z.string().min(2),
  tags: z.array(z.string().trim()),
  newTags: z.array(z.string().trim().max(100, { message: "Currently, we only support max 100 character length tags" })),
});

type ItemType = z.infer<typeof itemSchema>;

const CreateItem = () => {
  const { collectionId } = useParams<{ collectionId: string; }>();
  const router = useRouter();
  const {
    data: collection,
    isLoading: collectionIsLoading
  } = api.collection.getById.useQuery({ id: +collectionId });

  const form = useForm<ItemType>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: "",
      tags: [],
      newTags: []
    }
  });
  const { data: tags } = api.tag.getAll.useQuery();

  const createItem = api.item.create.useMutation({
    onSuccess() {
      form.reset();
      setTagInput('');
    },
    onError(error) {
      toast({
        description: error.message
      });
    }
  });

  const onSubmit = (values: ItemType) => {
    createItem.mutate({
      name: values.name,
      collectionId: +collectionId!,
      tags: values.tags,
      newTags: values.newTags,
    });
  };
  const activeCustomFields = useMemo(() => {
    return collection && Object.keys(collection)
      .filter((c) =>
        c.startsWith('custom') &&
        c.endsWith('state') &&
        collection[c as keyof typeof collection]
      );
  }, [collection]);
  const [tagInput, setTagInput] = useState('');

  return (
    <MinScreen>
      <Card className='w-80 md:w-96'>
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
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Tags</FormLabel>
                    <MultiSelectTags
                      options={tags?.map(tag => ({ value: tag.name, label: tag.name })) || []}
                      selected={field.value}
                      onChange={field.onChange}
                      className="w-[30rem]"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newTags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Add new Tags
                    </FormLabel>
                    <FormDescription className='flex gap-1 flex-wrap'>
                      {field.value?.map(tag =>
                        <Badge
                          key={tag}
                          variant="secondary"
                          className='px-2.5 text-xs py-0 ring-1 ring-gray-400'
                          onClick={() => {

                            const selected = field.value;
                            field.onChange(
                              selected?.includes(tag)
                                ? selected.filter((item) => item !== tag)
                                : [...selected, tag]
                            );
                          }}>
                          {tag}
                          <X className='className="h-1 w-3 text-muted-foreground hover:text-foreground' />
                        </Badge>
                      )}
                    </FormDescription>
                    <FormControl>
                      <Input placeholder='Press Enter to create a tag.'
                        // {...field}
                        value={tagInput}
                        onChange={(e) => { setTagInput(e.target.value); }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && tagInput) {
                            if (tags?.find(t => t.name === tagInput)) {
                              e.preventDefault();
                              toast({ description: "This tag already exists. Please select it from above fieled." });
                              return;
                            }
                            console.log(tagInput);
                            const selected = field.value;
                            field.onChange(
                              selected?.includes(tagInput)
                                ? selected.filter((item) => item !== tagInput)
                                : [...selected, tagInput]
                            );
                            setTagInput('');
                            e.preventDefault();
                          }
                        }} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* {collection && Object.keys(collection)
                .filter((c) => c.startsWith('custom_string') && c.endsWith('state') && collection[c])
                .map(c => <div>{c}</div>)} */}
              {activeCustomFields?.map(c => <div>{c}</div>)}
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