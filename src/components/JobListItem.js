import Image from "next/image";
import React from "react";
import companyLogoPlaceholder from "@/assets/company-logo-placeholder.png";
import { Banknote, Briefcase, Clock, Globe2, MapPin } from "lucide-react";
import { formatMoney, relativeDate } from "@/lib/utils";
import Badge from "./Badge";

function JobListItem({ job, isAppliedJobItem }) {
  const {
    title,
    companyName,
    type,
    locationType,
    location,
    salary,
    companyLogoUrl,
    createdAt,
    activeStatus,
  } = job ?? {};
  return (
    <article
      className={`flex gap-3 border rounded-lg p-5 hover:bg-muted/60 ${!activeStatus && "bg-gray-200/60 hover:bg-gray-200/60"}`}
    >
      <Image
        src={companyLogoUrl || companyLogoPlaceholder}
        alt={companyName}
        width={100}
        height={100}
        className="rounded-lg self-center"
      />
      <div className="flex-grow space-y-3">
        <div>
          <h2 className="text-xl font-medium">{title}</h2>
          <p className="text-muted-foreground">{companyName}</p>
        </div>
        <div className="text-muted-foreground">
          <p className="flex items-center gap-1.5 sm:hidden">
            <Briefcase size={16} className="shrink-0" />
            {type}
          </p>
          <p className="flex items-center gap-1.5">
            <MapPin size={16} className="shrink-0" />
            {locationType}
          </p>
          <p className="flex items-center gap-1.5">
            <Globe2 size={16} className="shrink-0" />
            {location || "Worldwide"}
          </p>
          <p className="flex items-center gap-1.5 ">
            <Banknote size={16} className="shrink-0" />
            {formatMoney(salary)}
          </p>
          <p className="flex items-center gap-1.5 sm:hidden">
            <Clock size={16} className="shrink-0" />
            {relativeDate(createdAt)}
          </p>
        </div>
      </div>
      <div className="hidden sm:flex flex-col shrink-0 items-end justify-between">
        <div className="flex flex-col">
          <Badge className="mb-2">
            {isAppliedJobItem?.status?.length > 0
              ? isAppliedJobItem?.status
              : type}
          </Badge>
          {!activeStatus && <Badge>INACTIVE</Badge>}
        </div>

        <span className="flex items-center gap-1.5 text-muted-foreground">
          <Clock size={16} />
          {relativeDate(
            isAppliedJobItem?.createdAt
              ? isAppliedJobItem?.createdAt
              : createdAt,
          )}
        </span>
      </div>
    </article>
  );
}

export default JobListItem;
