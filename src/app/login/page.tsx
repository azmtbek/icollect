"use client";
import Link from 'next/link';
import React from 'react';
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
import { getServerAuthSession } from '@/server/auth';

const registerSchema = z.object({
  // username: z.string().min(2, { message: "Username must be at least 2 characters." }).max(255),
  email: z.string().email({ message: "Please enter valid email." }),
  password: z.string().min(2, { message: "Password must be at least 2 characters." }).max(255),
});
type RegisterType = z.infer<typeof registerSchema>;

const Login = () => {

  const form = useForm<RegisterType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      // username: "",
      email: "",
      password: "",
    },
  });

  function onSubmit(values: RegisterType) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    console.log(values);
  }
  return (
    <div className='flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center'>
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Welcome back!</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
            Don't have an account?
            <Link href={'/register'} className='font-semibold text-gray-400'> Register</Link>
            .
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;