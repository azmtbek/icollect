'use client';
import MinScreen from '@/components/layout/min-screen';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MultiSelectTags } from '@/components/custom/multi-select-tags';
import { api } from '@/trpc/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, X } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { useLocale } from '@/components/provider/locale-provider';
import { type Locale } from '@/i18n-config';
import Link from 'next/link';

const customFields = [
  "customString",
  "customInteger",
  "customText",
  "customDate",
] as const;

const customString = ['customString1', 'customString2', 'customString3'] as const;
const customInteger = ['customInteger1', 'customInteger2', 'customInteger3'] as const;
const customDate = ['customDate1', 'customDate2', 'customDate3'] as const;
const customText = ['customText1', 'customText2', 'customText3'] as const;

const customFieldMapper = {
  "customString": customString,
  "customDate": customDate,
  "customInteger": customInteger,
  "customText": customText,
};

const defaultCustomFields = {
  customString1: false,
  customString2: false,
  customString3: false,

  customInteger1: false,
  customInteger2: false,
  customInteger3: false,

  customText1: false,
  customText2: false,
  customText3: false,

  customDate1: false,
  customDate2: false,
  customDate3: false,
};

const itemSchema = z.object({
  name: z.string().min(2),
  tags: z.array(z.string().trim()),
  newTags: z.array(z.string().trim().max(100, { message: "Currently, we only support max 100 character length tags" })),

  customString1: z.string().max(256, { message: 'String is supported only 256 characters, use text instead.' }).optional(),
  customString2: z.string().max(256, { message: 'String is supported only 256 characters, use text instead.' }).optional(),
  customString3: z.string().max(256, { message: 'String is supported only 256 characters, use text instead.' }).optional(),
  customInteger1: z.coerce.number().optional(),
  customInteger2: z.coerce.number().optional(),
  customInteger3: z.coerce.number().optional(),
  customText1: z.string().optional(),
  customText2: z.string().optional(),
  customText3: z.string().optional(),
  customDate1: z.date().optional(),
  customDate2: z.date().optional(),
  customDate3: z.date().optional(),
});

type ItemType = z.infer<typeof itemSchema>;

const CreateItem = () => {
  const { collectionId, lang } = useParams<{ collectionId: string; lang: Locale; }>();
  const router = useRouter();
  const {
    data: collection,
  } = api.collection.getById.useQuery({ id: +collectionId });

  const form = useForm<ItemType>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: "",
      tags: [],
      newTags: [],
      customString1: undefined,
      customString2: undefined,
      customString3: undefined,
      customInteger1: undefined,
      customInteger2: undefined,
      customInteger3: undefined,
      customText1: undefined,
      customText2: undefined,
      customText3: undefined,
      customDate1: undefined,
      customDate2: undefined,
      customDate3: undefined,
    }
  });
  const { data: tags } = api.tag.getAll.useQuery();

  const createItem = api.item.create.useMutation({
    onSuccess(data) {
      const id = data[0]?.id ?? '';
      toast({
        description: "Item created.",
      });

      router.push(`/${lang}/collection/${collectionId}/item/${id}`);
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
      collectionId: +collectionId,
      tags: values.tags,
      newTags: values.newTags,
    });
  };
  // const activeCustomFields = useMemo(() => {

  //   return customFieldNames.filter(c => x?.includes(c));
  // }, [collection]);

  const [customForms, setCustomForms] = useState(defaultCustomFields);
  useEffect(() => {
    if (!collection) return;
    const x = collection && Object.keys(collection)
      .filter((c) =>
        c.startsWith('custom') &&
        c.endsWith('State') &&
        collection[c as keyof typeof collection])
      .map((c) => c.replace('State', ''));
    setCustomForms((state) => {
      for (const s in state) {
        if (x.includes(s)) {
          state[s as keyof typeof state] = true;
        }
      }
      return state;
    });
    console.log(collection);
  }, [collection]);

  const [tagInput, setTagInput] = useState('');
  const locale = useLocale((state) => state.item.create);
  const localeCollection = useLocale((state) => state.collection.view);


  return (
    <MinScreen>
      <Card className='w-80 md:w-96'>
        <CardHeader>
          <CardTitle>{locale.title}</CardTitle>
          <CardDescription>
            {localeCollection.title} :{' '}
            <Link href={`/${lang}/collection/${collectionId}`}>
              {collection?.name}
            </Link>
          </CardDescription>
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
                      {locale.name}
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
                    <FormLabel>{locale.tags}</FormLabel>
                    <MultiSelectTags
                      options={tags?.map(tag => ({ value: tag.name, label: tag.name })) ?? []}
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
                      {locale.newTags}
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
                      <Input placeholder={locale.newTagsPlaceholder}
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
              {customFields.map(customField => {
                if (customField == 'customString')
                  return customFieldMapper[customField].map(customFieldNum => {
                    return <div
                      key={customFieldNum}
                      className={`flex w-full justify-center items-end gap-2 ${customForms[customFieldNum] ? '' : 'hidden'}`}
                    >
                      <FormField
                        control={form.control}
                        name={customFieldNum}
                        render={({ field }) => (
                          <FormItem className='w-full'>
                            <FormLabel>
                              {collection?.[`${customFieldNum}Name`]}
                            </FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>;
                  });
                else if (customField == 'customInteger')
                  return customFieldMapper[customField].map(customFieldNum => {
                    return <div
                      key={customFieldNum}
                      className={`flex w-full justify-center items-end gap-2 ${customForms[customFieldNum] ? '' : 'hidden'}`}>
                      <FormField
                        control={form.control}
                        name={customFieldNum}
                        render={({ field }) => (
                          <FormItem className='w-full'>
                            <FormLabel>
                              {collection?.[`${customFieldNum}Name`]}
                            </FormLabel>
                            <FormControl>
                              <Input  {...field} type='number' />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>;
                  });
                else if (customField == 'customText')
                  return customFieldMapper[customField].map(customFieldNum => {
                    return <div
                      key={customFieldNum}
                      className={`flex w-full justify-center items-end gap-2 ${customForms[customFieldNum] ? '' : 'hidden'}`}>
                      <FormField
                        control={form.control}
                        name={customFieldNum}
                        render={({ field }) => (
                          <FormItem className='w-full'>
                            <FormLabel>
                              {collection?.[`${customFieldNum}Name`]}
                            </FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>;
                  });
                else if (customField == 'customDate')
                  return customFieldMapper[customField].map(customFieldNum => {
                    return <div
                      key={customFieldNum}
                      className={`flex w-full justify-center items-end gap-2 ${customForms[customFieldNum] ? '' : 'hidden'}`}>
                      <FormField
                        control={form.control}
                        name={customFieldNum}
                        render={({ field }) => (
                          <FormItem className='w-full'>
                            <FormLabel>
                              {collection?.[`${customFieldNum}Name`]}
                            </FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-[240px] pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date > new Date() || date < new Date("1900-01-01")
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>;
                  });

              })}

              <div className='flex justify-between' >
                <Button type="submit">Create</Button>
                <Button variant='outline' onClick={() => router.back()}>Go back</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </MinScreen >
  );
};

export default CreateItem;;