import { Trash2Icon } from "lucide-react";

import { DropdownMenuItem, type DropdownMenuItemProps } from "../DropdownMenu";

export default function DeleteMenuItem({ ...props }: DropdownMenuItemProps) {
  return (
    <DropdownMenuItem variant="destructive" {...props}>
      <Trash2Icon />
      삭제
    </DropdownMenuItem>
  );
}
