import React from "react";

import { cn } from "@utils/shadcn";

export const Box = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
};

export const Center = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn("flex justify-center items-center w-fit h-fit shrink-0", className)} {...props}>
      {children}
    </div>
  );
};

export const VStack = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn("flex flex-col w-full h-full", className)} {...props}>
      {children}
    </div>
  );
};
export const HStack = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn("flex flex-row w-full h-full", className)} {...props}>
      {children}
    </div>
  );
};
export const ZStack = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn(`relative`, className)} {...props}>
      {React.Children.map(children, (child, index) =>
        React.cloneElement(child as React.ReactElement<React.HTMLAttributes<HTMLDivElement>>, {
          className: cn(
            `absolute inset-0`,
            (child as React.ReactElement<React.HTMLAttributes<HTMLDivElement>>).props.className,
          ),
          style: {
            ...(child as React.ReactElement<React.HTMLAttributes<HTMLDivElement>>).props.style,
            zIndex: index,
          },
        }),
      )}
    </div>
  );
};

export const VDivider = ({ className, ...props }: { className?: string } & React.HTMLAttributes<HTMLDivElement>) => {
  return <div className={cn("w-[1px] h-full min-h-[8px] bg-border", className)} {...props} />;
};
export const HDivider = ({ className, ...props }: { className?: string } & React.HTMLAttributes<HTMLDivElement>) => {
  return <div className={cn("w-full h-[1px] min-w-[8px] bg-border", className)} {...props} />;
};
