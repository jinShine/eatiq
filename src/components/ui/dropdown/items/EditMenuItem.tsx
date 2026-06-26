import { PenLine as EditIcon } from "lucide-react";

import { DropdownMenuItem, type DropdownMenuItemProps } from "../DropdownMenu";

export default function EditMenuItem({ ...props }: DropdownMenuItemProps) {
  return (
    <DropdownMenuItem {...props}>
      <EditIcon className="" />
      수정
    </DropdownMenuItem>
  );
}
