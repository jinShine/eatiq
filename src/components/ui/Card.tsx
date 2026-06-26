import React from "react";

import { Card as ShadcnCard } from "@components/shadcn/card";

import { cn } from "@utils/shadcn";

export function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <ShadcnCard className={cn("flex flex-col w-full p-0 m-0 gap-0", className)} {...props}>
      {props.children}
    </ShadcnCard>
  );
}

export function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col p-4", className)} {...props}>
      {props.children}
    </div>
  );
}

export function CardBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col flex-1 px-4 pb-4", className)} {...props}>
      {props.children}
    </div>
  );
}

export function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex items-center px-4 pb-4", className)} {...props}>
      {props.children}
    </div>
  );
}
