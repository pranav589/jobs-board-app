"use client";

import CustomDropDown from "@/components/CustomDropDown";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell } from "@/components/ui/table";
import { MoreHorizontalIcon } from "lucide-react";
import React from "react";
import { changeJobActivationStatus } from "./actions";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

function RenderActionButtons({ job }) {
  const router = useRouter();

  const ITEMS = [
    {
      value: job?.activeStatus ? "Make inactive" : "Make active",
      id: "toggleStatus",
    },
    { value: "Edit", id: "editJob" },
  ];
  const handleToggleStatus = async () => {
    const activeStatusValue = !job?.activeStatus;
    const result = await changeJobActivationStatus(job, activeStatusValue);
    if (result.id) {
      toast.success("Job status updated");
    } else if (result.error) {
      toast.error(result.error);
    }
  };

  const clickHandler = async (item) => {
    const actions = {
      toggleStatus: handleToggleStatus,
      editJob: () => {
        router.push(`/jobs/${job?.slug}/edit`);
      },
    };

    const action = actions[item.id];
    if (action) {
      await action();
    }
  };

  return (
    <TableCell className="text-right">
      <CustomDropDown
        className={"w-fit"}
        items={ITEMS}
        renderLogoutButton={false}
        renderItem={(item, index) => {
          return (
            <>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => clickHandler(item)}
              >
                {item?.value}
              </DropdownMenuItem>
              {index !== ITEMS.length - 1 && <DropdownMenuSeparator />}
            </>
          );
        }}
      >
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Actions</span>
          </Button>
        </DropdownMenuTrigger>
      </CustomDropDown>
    </TableCell>
  );
}

export default RenderActionButtons;
