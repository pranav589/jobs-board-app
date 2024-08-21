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
import { registerSchema } from "@/lib/authValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";
import { login, registerUser } from "../actions";
import toast from "react-hot-toast";
import Select from "@/components/ui/select";
import { userRoleTypes } from "@/lib/job-types";

function RegisterForm() {
  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
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
    const result = await registerUser(formData);
    if (result?.error) {
      toast.error(result.error);
    }
    if (result?.id) {
      toast.success("Registration Success!");
      await login(formData);
    }
  };

  return (
    <Form {...form}>
      <div className="w-[400px] m-auto border rounded p-5">
        <H1 className="font-medium text-2xl text-center mb-3 lg:text-2xl">
          Register
        </H1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2 mb-3">
            <FormField
              control={control}
              name="userName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>I am a</FormLabel>
                  <FormControl>
                    <Select {...field}>
                      <option value="" hidden>
                        Select an option
                      </option>
                      {userRoleTypes.map((roleType) => (
                        <option key={roleType} value={roleType}>
                          {roleType.charAt(0).toUpperCase() +
                            roleType.slice(1).toLowerCase()}
                        </option>
                      ))}
                    </Select>
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
            <FormField
              control={control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Confirm your password"
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
            Register
          </LoadingButton>
        </form>
        <div className="font-normal mt-3">
          <span>Already have an account?</span>{" "}
          <Link href="/login" className="underline">
            Login
          </Link>
        </div>
      </div>
    </Form>
  );
}

export default RegisterForm;
