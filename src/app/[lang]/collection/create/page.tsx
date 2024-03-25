'use client';
import MinScreen from '@/components/layout/min-screen';
import { useLocale } from '@/components/provider/locale-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { api } from '@/trpc/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2 } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const collectionSchema = z.object({
  name: z.string().min(2),
  topicId: z.string().min(1, { message: "Please select a topic." }),
  description: z.string().optional(),
  customString1: z.object({ state: z.boolean(), name: z.string() }).optional(),
  customString2: z.object({ state: z.boolean(), name: z.string() }).optional(),
  customString3: z.object({ state: z.boolean(), name: z.string() }).optional(),
  customInteger1: z.object({ state: z.boolean(), name: z.string() }).optional(),
  customInteger2: z.object({ state: z.boolean(), name: z.string() }).optional(),
  customInteger3: z.object({ state: z.boolean(), name: z.string() }).optional(),
  customText1: z.object({ state: z.boolean(), name: z.string() }).optional(),
  customText2: z.object({ state: z.boolean(), name: z.string() }).optional(),
  customText3: z.object({ state: z.boolean(), name: z.string() }).optional(),
  customDate1: z.object({ state: z.boolean(), name: z.string() }).optional(),
  customDate2: z.object({ state: z.boolean(), name: z.string() }).optional(),
  customDate3: z.object({ state: z.boolean(), name: z.string() }).optional(),
});
type CollectionType = z.infer<typeof collectionSchema>;


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

const defaultSelectState = customFields.map(name => ({ [name]: [] as string[] }));

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

const defaultCustomFields = {
  customString1: false,
  // customString1Name: '',
  customString2: false,
  // customString2Name: '',
  customString3: false,
  // customString3Name: '',

  customInteger1: false,
  // customInteger1Name: '',
  customInteger2: false,
  // customInteger2Name: '',
  customInteger3: false,
  // customInteger3Name: '',

  customText1: false,
  // customText1Name: '',
  customText2: false,
  // customText2Name: '',
  customText3: false,
  // customText3Name: '',

  customDate1: false,
  // customDate1Name: '',
  customDate2: false,
  // customDate2Name: '',
  customDate3: false,
  // customDate3Name: '',
};
type CustomFieldsType = typeof defaultCustomFields;


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
      form.reset();
    },
    onError(error) {
      toast({
        variant: "destructive",
        title: "Something went wrong!",
        description: error.message,
      });
    }
  });

  const locale = useLocale((state) => state.collection.create);
  const { data: topics } = api.admin.getTopics.useQuery();

  const onSubmit = (values: CollectionType) => {

    console.log(values);
    createCollection.mutate({
      name: values.name,
      description: values.description,
      topicId: +values.topicId
    });
  };


  const [customForms, setCustomForms] = useState(defaultCustomFields);
  const selectCustomFields = () => {
    setCustomForms((state) => {
      return ({ ...state, [currField]: !state[currField as keyof typeof defaultCustomFields] });
    });
  };
  const [currField, setCurrField] = useState('');
  const removeCustomField = (field: keyof typeof defaultCustomFields) => {
    setCustomForms((state) => {
      return ({ ...state, [field]: false });
    });
    form.resetField(field, { keepDirty: false, keepTouched: false });
    form.resetField(`${field}.name`, { defaultValue: '' });
    // form.resetField(`${field}.state`);
  };
  return (
    <MinScreen>
      <Card className='w-full'>
        <CardHeader>
          <CardTitle>{locale.title}</CardTitle>
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
                      <Input placeholder={locale.namePlaceholder} {...field} />
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
                      <Textarea placeholder={locale.descriptionPlaceholder} {...field} />
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                return customFieldMapper[customField].map(customFieldNum =>
                  <div className={`flex w-full justify-center items-end gap-2 ${customForms[customFieldNum] ? '' : 'hidden'}`}>
                    <FormField
                      control={form.control}
                      name={(`${customFieldNum}.name`)}
                      render={({ field }) => (
                        <FormItem className='w-full'>
                          <FormLabel>
                            {locale[customField]}
                          </FormLabel>

                          <FormControl>
                            <Input placeholder={locale.namePlaceholder} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type='button' onClick={() => removeCustomField(customFieldNum)}><Trash2 /></Button>
                  </div>);
              })}
              <div className='flex gap-2'>
                <Select onValueChange={(value) => setCurrField(value)}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={locale.customFieldPlaceholder} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.keys(customForms)?.map((field, i) =>
                      <SelectItem value={field} key={i}>{field}</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <Button type='button' onClick={selectCustomFields} disabled={currField === ''}>Add Field</Button>
              </div>
              {/* <div className='flex gap-2'>
                <CustomFieldSeletor fields={customForms} onChange={ } />
                <Button type='button' onClick={() => { console.log('clikked'); }}>Add Field</Button>
              </div> */}
              <div className='flex justify-between'>
                <Button type="submit">{locale.create}</Button>
                <Link href={'/collection'}> <Button variant='outline'>{locale.goBack}</Button></Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </MinScreen >
  );
};

export default CreateCollection;

// populate all forms first
// then show only needed ones

const CustomFieldSeletor = ({ fields }: { fields: CustomFieldsType; }) => {

  return <Select onValueChange={() => { }} defaultValue={''}>
    <SelectTrigger className=" capitalize">
      <SelectValue aria-label={'lable'}>Select Custom Field</SelectValue>
    </SelectTrigger>
    <SelectContent className="">
      {Object.keys(fields).filter(key => fields[key as keyof typeof fields] == false).map((key) =>
        <SelectItem
          key={key}
          value={key}
        // defaultChecked={locale === lang}
        >{key}</SelectItem>
      )}
    </SelectContent>
  </Select>;
};

// const CustomFieldSelectore = <T extends unknown, L extends unknown>({ form, locale }: { form: T, locale: L; }) => {

//   return <FormField
//     control={form.control}
//     name="topicId"
//     render={({ field }) => (
//       <FormItem>
//         <FormLabel>
//           {locale.topic}
//         </FormLabel>
//         <Select onValueChange={field.onChange} defaultValue={field.value}>
//           <FormControl>
//             <SelectTrigger>
//               <SelectValue placeholder={locale.topic} />
//             </SelectTrigger>
//           </FormControl>
//           <SelectContent>
//             {topics?.map(topic =>
//               <SelectItem value={"" + topic.id} key={topic.id}>{topic.name}</SelectItem>
//             )}
//           </SelectContent>
//         </Select>
//         <FormMessage />
//       </FormItem>
//     )}
//   />;
// };