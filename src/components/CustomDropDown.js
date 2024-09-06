import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";

import LogoutButton from "./LogoutButton";
import { cn } from "@/lib/utils";

function CustomDropDown({
  customContent,
  items = [],
  children,
  renderLogoutButton = false,
  className,
  renderItem,
}) {
  return (
    <DropdownMenu>
      {children}
      <DropdownMenuContent className={cn("w-56", className)} align="end">
        {customContent}
        {customContent && <DropdownMenuSeparator />}
        <DropdownMenuGroup>
          {items?.map((item, index) => renderItem(item, index))}
        </DropdownMenuGroup>
        {renderLogoutButton && <DropdownMenuSeparator />}
        {renderLogoutButton && <LogoutButton />}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default CustomDropDown;
