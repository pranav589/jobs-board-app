"use client";

import { PopupDialog } from "@/components/PopupDialog";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { applyForJob } from "./actions";
import toast from "react-hot-toast";
import FormSubmitButton from "@/components/FormSubmitButton";

function JobApplicationPopup({ job, profileData, isAlreadyApplied, disabled }) {
  const [open, setOpen] = useState(false);
  const applyAction = applyForJob.bind(null, job?.id);
  const onSubmit = async () => {
    try {
      applyAction().then((res) => {
        if (res?.error) {
          toast.error(res?.error);
        }
        if (res?.status === "APPLIED") {
          toast.success("Successfully applied!");
        }
        setOpen(false);
      });
    } catch (error) {
      alert("Something went wrong. Please try again.");
    }
  };

  const JOB_APPLICATION_DETAILS = [
    {
      name: "Name",
      value: profileData?.userName,
      type: "text",
    },
    {
      name: "Email",
      value: profileData?.email,
      type: "text",
    },
    {
      name: "Address",
      value: profileData?.address,
      type: "text",
    },
    {
      name: "Resume",
      value: profileData?.resume,
      type: "link",
    },
    {
      name: "Experience",
      value: profileData?.experience,
      type: "text",
    },
  ];

  const requiredFields =
    !profileData?.userName ||
    !profileData?.email ||
    !profileData?.address ||
    !profileData?.resume ||
    !profileData?.experience;

  return (
    <PopupDialog
      buttonName={isAlreadyApplied?.status ?? "Apply"}
      dialogTitle={"Job Application"}
      dialogDescription={
        "Please check your details. And complete your profile if not done to apply for this job"
      }
      open={open}
      setOpen={setOpen}
      disabledMainButton={disabled}
    >
      <form action={onSubmit}>
        {JOB_APPLICATION_DETAILS.map((detail) => {
          return (
            <div className="flex items-center my-2" key={detail?.name}>
              <Label className="text-lg">{detail.name}: </Label>
              {detail.type === "link" ? (
                detail?.value && (
                  <a
                    href={detail.value}
                    className="text-base text-muted-foreground ml-3 mt-1 underline"
                  >
                    Check
                  </a>
                )
              ) : (
                <p className="text-base text-muted-foreground ml-3 mt-0.5 text-wrap">
                  {detail?.value}
                </p>
              )}
            </div>
          );
        })}
        <FormSubmitButton
          type="submit"
          className="w-full mt-2"
          disabled={isAlreadyApplied?.id || requiredFields}
        >
          {isAlreadyApplied?.id ? `${isAlreadyApplied?.status}` : "Apply"}
        </FormSubmitButton>
      </form>
    </PopupDialog>
  );
}

export default JobApplicationPopup;
