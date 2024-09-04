"use client";

import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CustomSelect({
  renderItem,
  items,
  onValueChange,
  disable,
  children,
}) {
  return (
    <Select onValueChange={onValueChange} disabled={disable}>
      {children}
      <SelectContent>
        <SelectGroup>{items?.map((item) => renderItem(item))}</SelectGroup>
      </SelectContent>
    </Select>
  );
}
