"use client";

import { useTheme } from "next-themes";

import { CircleCheckIcon, CircleXIcon, InfoIcon, Loader2Icon, TriangleAlertIcon } from "lucide-react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-5 fill-success text-white" />,
        info: <InfoIcon className="size-5 fill-info text-white" />,
        warning: <TriangleAlertIcon className="size-5 fill-warning text-white" />,
        error: <CircleXIcon className="size-5 fill-error text-white" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          title: "!font-medium",
          description: "!text-text-secondary",
        },
      }}
      visibleToasts={1}
      position="top-center"
      {...props}
    />
  );
};

export { Toaster };
