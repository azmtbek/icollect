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


const customFieldNames = [
  "customString1",
  "customString2",
  "customString3",

  "customInteger1",
  "customInteger2",
  "customInteger3",

  "customText1",
  "customText2",
  "customText3",

  "customDate1",
  "customDate2",
  "customDate3",
] as const;
const customFieldMapper = {
  "customString1": 'string',
  "customString2": 'string',
  "customString3": 'string',

  "customInteger1": 'integer',
  "customInteger2": 'integer',
  "customInteger3": 'integer',

  "customText1": 'text',
  "customText2": 'text',
  "customText3": 'text',

  "customDate1": 'date',
  "customDate2": 'date',
  "customDate3": 'date',
} as const;

const itemSchema = z.object({
  name: z.string().min(2),
  tags: z.array(z.string().trim()),
  newTags: z.array(z.string().trim().max(100, { message: "Currently, we only support max 100 character length tags" })),

  customString1: z.string().max(256, { message: 'String is supported only 256 characters, use text instead.' }).optional(),
  customString2: z.string().max(256, { message: 'String is supported only 256 characters, use text instead.' }).optional(),
  customString3: z.string().max(256, { message: 'String is supported only 256 characters, use text instead.' }).optional(),
  customInteger1: z.number().optional(),
  customInteger2: z.number().optional(),
  customInteger3: z.number().optional(),
  customText1: z.string().optional(),
  customText2: z.string().optional(),
  customText3: z.string().optional(),
  customDate1: z.date().optional(),
  customDate2: z.date().optional(),
  customDate3: z.date().optional(),
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
    const x = collection && Object.keys(collection)
      .filter((c) =>
        c.startsWith('custom') &&
        c.endsWith('state') &&
        collection[c as keyof typeof collection]
      ).map((c) => c.replace('_state', ''));
    return customFieldNames.filter(c => x?.includes(c));
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
              {/* {activeCustomFields?.map(cField => {
                const cType = cField as keyof typeof collection;
                let Cinput: React.ReactNode; */}
              {
                // return customFieldMapper[cField].map(c => <FormField
                //   control={form.control}
                //   name={c}
                //   render={({ field }) => (
                //     <FormItem>
                //       <FormLabel>
                //         Name
                //       </FormLabel>
                //       <FormControl>
                //         <Input placeholder='Integer Field' {...field} />
                //       </FormControl>
                //       <FormMessage />
                //     </FormItem>
                //   )}
                // />);
                // })}
              }
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