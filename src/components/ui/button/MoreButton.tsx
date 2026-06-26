import { EllipsisIcon } from "lucide-react";

import { cn } from "@utils/shadcn";

import Button, { type ButtonProps } from "./Button";

export default function MoreButton({ ...props }: ButtonProps) {
  return (
    <Button variant="outline" size="icon" className={cn("[&_svg]:size-3.5", props.className)} {...props}>
      <EllipsisIcon />
    </Button>
  );
}
