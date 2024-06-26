'use client';
import MinScreen from '@/components/layout/min-screen';
import { useLocale } from '@/components/provider/locale-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { type Locale } from '@/i18n-config';
import { collectionToItem } from '@/lib/collection-item-mapper';
import { collectionSchema, type UpdateCollection } from '@/lib/types/collection';
import { useUploadThing } from '@/lib/uploadthing';
import { api } from '@/trpc/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

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
const customFieldReverter = {
  customString1: "customString",
  customString2: "customString",
  customString3: "customString",
  customInteger1: "customInteger",
  customInteger2: "customInteger",
  customInteger3: "customInteger",
  customText1: "customText",
  customText2: "customText",
  customText3: "customText",
  customDate1: "customDate",
  customDate2: "customDate",
  customDate3: "customDate",
} as const;

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

// TODO: test results
type CustomFieldsType = typeof defaultCustomFields;

const UpdateCollection = () => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const { collectionId, lang } = useParams<{ collectionId: string; lang: Locale; }>();
  const { data: collection } = api.collection.getById.useQuery({ id: +collectionId });

  const form = useForm<UpdateCollection>({
    resolver: zodResolver(collectionSchema),
    defaultValues: collection
  });
  const { toast } = useToast();
  const updateCollection = api.collection.update.useMutation({
    onSuccess(data) {
      const id = data[0]?.id;
      toast({
        description: "Collection created.",
      });
      const lst = Array.from(inputRef?.current?.files ?? []);
      if (lst?.length > 0 && id)
        void startUpload(lst, {
          collectionId: id,
          lang
        });
      router.push(`/${lang}/collection/${id}`);
    },
    onError(error) {
      toast({
        variant: "destructive",
        title: "Something went wrong!",
        description: error.message,
      });
    }
  });

  const locale = useLocale((state) => state.collection);
  const { data: topics } = api.topic.getAll.useQuery();

  const onSubmit = (values: UpdateCollection) => {
    updateCollection.mutate(values);
  };

  const { startUpload, permittedFileInfo } = useUploadThing(
    "imageUploader",
    {
      onClientUploadComplete: () => {

        toast({ description: "image uploaded successfully!" });
      },
      onUploadError: () => {
        toast({ description: "error occurred while image uploading" });
      },
      onUploadBegin: () => {
        // alert("upload has begun");
      },
    },
  );


  const [customForms, setCustomForms] = useState(defaultCustomFields);
  const [currField, setCurrField] = useState<keyof CustomFieldsType | ''>('');
  useEffect(() => {
    setCustomForms((state) => {
      const fields = collectionToItem(collection);
      return ({ ...state, ...fields.reduce((ac, key) => ({ ...ac, [key]: true }), {}) });
    });
    form.reset(collection);
  }, [collection, form]);

  const selectCustomFields = () => {
    if (currField === '') return;

    setCustomForms((state) => {
      return ({ ...state, [currField]: !state[currField] });
    });
    setCurrField('');
    form.setValue(`${currField}State`, true);
    form.setFocus(`${currField}Name`);

  };
  const removeCustomField = (field: keyof CustomFieldsType) => {
    setCustomForms((state) => {
      return ({ ...state, [field]: false });
    });
    form.setValue(`${field}State`, false);
  };
  return (
    <MinScreen>
      <Card className='w-full'>
        <CardHeader>
          <CardTitle>{locale.create.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {locale.name}
                    </FormLabel>
                    <FormControl>
                      <Input placeholder={locale.create.namePlaceholder} {...field} />
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
                      {locale.description}
                    </FormLabel>
                    <FormControl>
                      <Textarea placeholder={locale.create.descriptionPlaceholder} {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>{collection?.image &&
                <Image
                  src={collection.image}
                  alt='Collection image'
                  width={600} height={300}
                  className='rounded-xl'
                />}
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                {false && <>
                  <Label htmlFor="image">Image (max file size: {permittedFileInfo?.config.image?.maxFileSize})</Label>
                  <Input id="image" type="file" ref={inputRef} />
                </>
                }
              </div>
              <FormField
                control={form.control}
                name="topicId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {locale.topic}
                    </FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={locale.topic} />
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
              {customFields.map(customField => {
                return customFieldMapper[customField].map(customFieldNum => {
                  return customForms[customFieldNum] &&
                    <div
                      key={customFieldNum}
                      className={`flex w-full justify-center items-end gap-2`}>
                      <FormField
                        control={form.control}
                        name={(`${customFieldNum}Name`)}
                        render={({ field }) => (
                          <FormItem className='w-full'>
                            <FormLabel>
                              {locale[customField]}
                            </FormLabel>
                            <FormControl>
                              <Input  {...field} value={field.value ?? ''} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={(`${customFieldNum}State`)}
                        render={({ field }) => (
                          <FormItem className='w-full hidden '>
                            <FormLabel>
                              {locale[customField]}
                            </FormLabel>
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type='button' onClick={() => removeCustomField(customFieldNum)}><Trash2 /></Button>
                    </div>;
                });
              })}
              <div className='flex gap-2'>
                <Select onValueChange={(value: keyof CustomFieldsType) => setCurrField(value)} value={currField}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={locale.create.customFieldPlaceholder} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.keys(customForms)?.map((field, i) => {
                      if (customForms[field as keyof CustomFieldsType]) return;
                      const crop = customFieldReverter[field as keyof CustomFieldsType];
                      return <SelectItem value={field} key={i}>{locale[crop]}</SelectItem>;
                    })}
                  </SelectContent>
                </Select>
                <Button type='button' onClick={selectCustomFields} disabled={currField === ''}>{locale.create.customFieldAdd}</Button>
              </div>
              <div className='flex justify-between'>
                <Button type="submit" disabled={updateCollection.isLoading}>{
                  updateCollection.isLoading ? locale.create.creating : locale.create.create
                }</Button>
                <Button variant='outline' onClick={() => router.back()}>{locale.create.goBack}</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </MinScreen >
  );
};

export default UpdateCollection;