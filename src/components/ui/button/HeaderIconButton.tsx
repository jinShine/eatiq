import { cn } from "@utils/shadcn";

import Button, { type ButtonProps } from "./Button";

export default function HeaderIconButton({ ...props }: ButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      {...props}
      className={cn("hover:bg-gray-100 rounded-full -ml-2 [&_svg]:size-5", props.className)}
    />
  );
}
