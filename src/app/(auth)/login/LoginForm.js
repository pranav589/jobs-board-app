"use client";

import LoadingButton from "@/components/LoadingButton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import H1 from "@/components/ui/h1";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";
import { login } from "../actions";
import { loginSchema } from "@/lib/authValidation";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (values) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value);
      }
    });

    const result = await login(formData);

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Login Success!");
      router.push("/");
    }
  };

  return (
    <Form {...form}>
      <div className="w-[400px] m-auto border rounded p-5">
        <H1 className="font-medium text-2xl text-center mb-3 lg:text-2xl">
          Login
        </H1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2 mb-3">
            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="xyz@email.com"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your password"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <LoadingButton type={"submit"} loading={isSubmitting}>
            Login
          </LoadingButton>
        </form>
        <div className="font-normal mt-3">
          <span>Don&apos;t have an account?</span>{" "}
          <Link href="/register" className="underline">
            Register
          </Link>
        </div>
      </div>
    </Form>
  );
}

export default LoginForm;
