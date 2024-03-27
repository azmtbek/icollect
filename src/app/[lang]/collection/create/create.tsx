'use client';
import MinScreen from '@/components/layout/min-screen';
import { useLocale } from '@/components/provider/locale-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { type Locale } from '@/i18n-config';
import { type Collection, collectionSchema } from '@/lib/types/collection';
import { api } from '@/trpc/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
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
// type CustomFieldsType = Omit<Collection, "id" | "name" | "topicId" | "description">;
type CreateCollection = Omit<Collection, "id">;

const CreateCollection = () => {
  const router = useRouter();
  const { lang } = useParams<{ lang: Locale; }>();
  const form = useForm<CreateCollection>({
    resolver: zodResolver(collectionSchema.omit({ id: true })),
    defaultValues: {
      // name: "",
      // topicId: undefined,
      // description: "",
      // customString1: undefined,
      // customString2: undefined,
      // customString3: undefined,
      // customInteger1: undefined,
      // customInteger2: undefined,
      // customInteger3: undefined,
      // customText1: undefined,
      // customText2: undefined,
      // customText3: undefined,
      // customDate1: undefined,
      // customDate2: undefined,
      // customDate3: undefined,
    }
  });
  const { toast } = useToast();
  const createCollection = api.collection.create.useMutation({
    onSuccess(data) {
      const id = data[0]?.id ?? '';
      toast({
        description: "Collection created.",
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
  const { data: topics } = api.admin.getTopics.useQuery();

  const onSubmit = (values: CreateCollection) => {

    createCollection.mutate(values
      // {
      // name: values.name,
      // description: values.description,
      // topicId: values.topicId,
      // customString1: values.customString1,
      // customString2: values.customString2,
      // customString3: values.customString3,
      // customInteger1: values.customInteger1,
      // customInteger2: values.customInteger2,
      // customInteger3: values.customInteger3,
      // customText1: values.customText1,
      // customText2: values.customText2,
      // customText3: values.customText3,
      // customDate1: values.customDate1,
      // customDate2: values.customDate2,
      // customDate3: values.customDate3,
      // }
    );
  };


  const [customForms, setCustomForms] = useState(defaultCustomFields);
  const [currField, setCurrField] = useState<keyof CustomFieldsType | ''>('');

  const selectCustomFields = () => {
    if (currField === '') return;
    setCustomForms((state) => {
      return ({ ...state, [currField]: !state[currField] });
    });
    setCurrField('');
    form.setValue(`${currField}State`, true);
  };
  const removeCustomField = (field: keyof CustomFieldsType) => {
    setCustomForms((state) => {
      return ({ ...state, [field]: false });
    });
    // form.resetField(`${field}Name`, { defaultValue: '' });
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
                      let crop = customFieldReverter[field as keyof CustomFieldsType];
                      return <SelectItem value={field} key={i}>{locale[crop]}</SelectItem>;
                    })}
                  </SelectContent>
                </Select>
                <Button type='button' onClick={selectCustomFields} disabled={currField === ''}>{locale.create.customFieldAdd}</Button>
              </div>
              <div className='flex justify-between'>
                <Button type="submit" disabled={createCollection.isLoading}>{
                  createCollection.isLoading ? locale.create.creating : locale.create.create
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

export default CreateCollection;