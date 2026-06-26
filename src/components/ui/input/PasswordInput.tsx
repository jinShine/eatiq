"use client";

import { useState } from "react";

import { Eye, EyeOff } from "lucide-react";

import { cn } from "@utils/shadcn";

import { Button } from "../button";
import Input, { type InputProps } from "./Input";

export default function PasswordInput({
  label,
  labelClassName,
  required,
  helperText,
  helperTextClassName,
  error,
  errorText,
  errorTextClassName,
  className,
  showEyeButton = true,
  ...props
}: InputProps & {
  showEyeButton?: boolean;
}) {
  // ** States
  const [isVisible, setIsVisible] = useState(false);

  return (
    <Input
      type={isVisible ? "text" : "password"}
      label={label}
      labelClassName={labelClassName}
      required={required}
      helperText={helperText}
      helperTextClassName={helperTextClassName}
      error={error}
      errorText={errorText}
      errorTextClassName={errorTextClassName}
      className={cn("", className)}
      endAdornment={
        showEyeButton && (
          <Button
            type="button"
            variant={"ghost"}
            size={"icon"}
            className="size-6"
            onClick={() => setIsVisible(prev => !prev)}
          >
            {isVisible ? <Eye /> : <EyeOff />}
          </Button>
        )
      }
      {...props}
    />
  );
}
