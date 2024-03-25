"use client";
import Link from 'next/link';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/trpc/react';
import { useParams, useRouter } from 'next/navigation';
import { Locale } from '@/i18n-config';

const registerSchema = z.object({
  username: z.string().min(2, { message: "Username must be at least 2 characters." }).max(255),
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(2, { message: "Password must be at least 2 characters." }).max(255),
});
type RegisterType = z.infer<typeof registerSchema>;

const Register = () => {
  const router = useRouter();
  const [pageError, setPageError] = useState('');
  const { lang } = useParams<{ lang: Locale; }>();

  const form = useForm<RegisterType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });


  const createUser = api.user.create.useMutation({
    onSuccess: () => {
      router.push('/login');
      form.reset();
    },
    onError: (error) => {
      setPageError(error.message);
    }
  });

  function onSubmit(values: RegisterType) {
    createUser.mutate({
      name: values.username,
      email: values.email,
      password: values.password,
    });
    console.log(values);
  }
  return (
    <div className='flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center'>
      <Card>
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>
            <span>
              If you don't have an account, please register.
            </span>
            <span className='text-destructive-foreground'>{pageError}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="johndoe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john@mail.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="password" {...field} type='password' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <p className="text-center text-sm text-gray-600">
            Already have an account?
            <Link href={`/${lang}/login`} className='font-semibold text-gray-400'> Login</Link>
            .
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;