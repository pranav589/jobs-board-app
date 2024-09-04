import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";

import LogoutButton from "./LogoutButton";

function CustomDropDown({
  customContent,
  items = [],
  children,
  renderLogoutButton = false,
  renderItem,
}) {
  return (
    <DropdownMenu>
      {children}
      <DropdownMenuContent className="w-56" align="end">
        {customContent}
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {items?.map((item) => renderItem(item))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {renderLogoutButton && <LogoutButton />}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default CustomDropDown;
