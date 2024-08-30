"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/LoadingButton";
import { candidateProfileSchema } from "@/lib/validations/profileValidation";
import { Textarea } from "@/components/ui/textarea";
import { updateProfileAction } from "./profileActions";
import toast from "react-hot-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function CandidateForm({ profileDetails }) {
  const { userName, email, image, address, experience, resume } =
    profileDetails ?? {};

  const onSubmit = async (values) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value);
      }
    });
    try {
      const res = await updateProfileAction(formData);
      if (res?.id) {
        toast.success("Updated Sucessfully!");
      }
      if (res.error) {
        toast.error(res.error);
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <main className="max-w-3xl m-auto my-10 space-y-10">
      <div className="space-y-6 border rounded-lg p-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="font-semibold">Profile Details</h2>
            <p className="text-muted-foreground">
              Provide profile related details
            </p>
          </div>
          <div>
            <Avatar className="h-16 w-16">
              <AvatarImage src={image} />
              <AvatarFallback>
                {userName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
        <CandidateProfile
          profileDetails={profileDetails}
          onSubmit={onSubmit}
          buttonText={"Update"}
        />
      </div>
    </main>
  );
}

export default CandidateForm;

export const CandidateProfile = ({
  profileDetails,
  onSubmit,
  buttonText,
  readOnlyList = [],
}) => {
  const { userName, email, image, address, experience, resume } =
    profileDetails ?? {};
  const form = useForm({
    resolver: zodResolver(candidateProfileSchema),
    values: {
      userName: userName || "",
      email: email || "",
      image: image || "",
      address: address || "",
      experience: experience || "",
      resume: resume || "",
    },
  });
  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = form;

  return (
    <Form {...form}>
      <form className="space-y-4" noValidate onSubmit={handleSubmit(onSubmit)}>
        <FormField
          control={control}
          name="userName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. XYZ Pvt"
                  {...field}
                  readOnly={readOnlyList.find((name) => field?.name === name)}
                />
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
                  placeholder="e.g. xyz@email.com"
                  {...field}
                  readOnly={readOnlyList.find((name) => field?.name === name)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="image"
          render={({ field: { value, ...fieldValues } }) => (
            <FormItem>
              <FormLabel>Profile Image</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  {...fieldValues}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    fieldValues.onChange(file);
                  }}
                  readOnly={readOnlyList.find(
                    (name) => fieldValues?.name === name,
                  )}
                />
              </FormControl>
              {image?.length > 0 &&
                !value?.name &&
                image.startsWith("https") && (
                  <p className="text-[12px]">{image}</p>
                )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Candidate Address</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  readOnly={readOnlyList.find((name) => field?.name === name)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="resume"
          render={({ field: { value, ...fieldValues } }) => (
            <FormItem>
              <FormLabel>Upload Resume</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  {...fieldValues}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    fieldValues.onChange(file);
                  }}
                  readOnly={readOnlyList.find(
                    (name) => fieldValues?.name === name,
                  )}
                />
              </FormControl>
              {resume?.length > 0 &&
                !value?.name &&
                resume.startsWith("https") && (
                  <p className="text-[12px]">{resume}</p>
                )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="experience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Experience</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  readOnly={readOnlyList.find((name) => field?.name === name)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <LoadingButton type="submit" loading={isSubmitting}>
          {buttonText}
        </LoadingButton>
      </form>
    </Form>
  );
};
