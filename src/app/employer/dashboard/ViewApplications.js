"use client";

import { CustomSelect } from "@/components/CustomSelect";
import { PopupDialog } from "@/components/PopupDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SelectItem, SelectTrigger } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { jobStatus } from "@/lib/job-types";
import { SelectValue } from "@radix-ui/react-select";
import React, { useState } from "react";
import { changeApplicationStatus } from "./actions";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";

function ViewApplications({ applications }) {
  const [open, setOpen] = useState(false);

  return (
    <PopupDialog
      buttonName="View"
      dialogTitle={"Job Applications"}
      dialogDescription={"All the applicants are listed below"}
      open={open}
      setOpen={setOpen}
      customOpenButton={
        <span className="underline cursor-pointer ml-2">(View)</span>
      }
      className={"md:max-w-[700px]"}
    >
      {applications.length === 0 && (
        <p className="text-muted-foreground">No applications found</p>
      )}
      <div>
        {applications?.map((application) => {
          return (
            <>
              <IndividualApplication application={application} />
              <Separator className="my-2" />
            </>
          );
        })}
      </div>
    </PopupDialog>
  );
}

export default ViewApplications;

const IndividualApplication = ({ application }) => {
  const { userName, email, resume, image } = application?.user ?? {};
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusChange = async (value) => {
    setIsLoading(true);
    const payload = {
      jobId: application?.jobId,
      status: value,
      applicationUserId: application?.user?.id,
    };
    const result = await changeApplicationStatus(payload);
    if (result?.count > 0) {
      setIsLoading(false);
      toast.success("Application status updated successfully!");
    }
    if (result?.error) {
      setIsLoading(false);
      toast.error(result?.error);
    }
  };

  return (
    <div key={application?.id} className="flex justify-between">
      <div className="flex items-center space-x-4">
        <Avatar className="w-12 h-12 hidden md:block">
          <AvatarImage src={image} alt={userName} />
          <AvatarFallback>{userName?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-base font-bold">{userName}</h1>
          <p className="text-muted-foreground text-sm">{email}</p>
          <p className="text-muted-foreground text-sm underline">
            <a href={resume} target="__blank" rel="noopener noreferrer">
              Resume
            </a>
          </p>
        </div>
      </div>
      <CustomSelect
        renderItem={(item) => {
          return <SelectItem value={item}>{item}</SelectItem>;
        }}
        items={jobStatus}
        onValueChange={handleStatusChange}
        disable={isLoading}
      >
        <SelectTrigger className="w-[120px]  md:w-[170px]">
          {isLoading ? (
            <div className="flex items-center justify-center gap-1">
              {isLoading && <Loader className="animate-spin" size={16} />}
              <p>{application?.status}</p>
            </div>
          ) : (
            <SelectValue placeholder={application?.status} />
          )}
        </SelectTrigger>
      </CustomSelect>
    </div>
  );
};
